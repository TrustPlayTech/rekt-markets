// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./OutcomeToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/// @title BinaryMarket
/// @notice Prediction market with YES/NO outcome tokens and a constant-product AMM.
///         Collateralised with an ERC-20 token (e.g. USDC).
///
///         Model: Each USDC deposited mints one complete set (1 YES + 1 NO).
///         The AMM pool holds YES and NO tokens; buying one side swaps the other
///         side into the pool via constant-product pricing. 1 complete set always
///         redeems for 1 USDC-unit worth of the pool.
contract BinaryMarket is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_TRADE_AMOUNT = 100 * 1e6; // 100 USDC (6 decimals)
    uint256 public constant MAX_POOL_SIZE = 10_000 * 1e6; // 10,000 USDC
    uint256 public constant PLATFORM_FEE_BPS = 100; // 1%

    address public treasury;
    address public resolver; // UMA resolver or similar, can call resolve() alongside owner
    string public question;
    uint256 public resolutionTime;
    bool public resolved;
    bool public yesWins;
    bool public paused;

    IERC20 public collateralToken;

    OutcomeToken public yesToken;
    OutcomeToken public noToken;

    /// @dev Virtual reserves for CPMM pricing.
    uint256 public yesReserve;
    uint256 public noReserve;

    bool public initialized;
    bool public refundMode;
    bool public emergencyActivated;
    uint256 public emergencyPoolBalance;

    /// @notice Snapshot of collateral pool at resolution time for fair redemption.
    uint256 public resolvedPoolBalance;

    /// @notice Grace period after resolutionTime before emergency refund is available.
    uint256 public constant EMERGENCY_PERIOD = 30 days;

    // ── Events ───────────────────────────────────────────────────────
    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event SharesBought(address indexed buyer, bool yes, uint256 usdcIn, uint256 tokensOut);
    event SharesSold(address indexed seller, bool yes, uint256 tokensIn, uint256 usdcOut);
    event MarketResolved(bool yesWins);
    event RefundModeEnabled(bool yesWins, uint256 poolBalance);
    event Redeemed(address indexed user, uint256 usdcOut);
    event LiquiditySeeded(address indexed provider, uint256 amount);
    event EmergencyRefund(address indexed user, uint256 amount);

    // ── Errors ───────────────────────────────────────────────────────
    error MarketAlreadyResolved();
    error MarketNotResolved();
    error ZeroAmount();
    error InsufficientOutput();
    error NothingToRedeem();
    error AlreadyInitialized();
    error NotInitialized();
    error TransferFailed();

    constructor(
        string memory _question,
        uint256 _resolutionTime,
        address _owner,
        address _collateralToken,
        address _treasury,
        address _resolver
    ) Ownable(_owner) {
        require(_collateralToken != address(0), "Zero collateral");
        require(_treasury != address(0), "Zero treasury");
        question = _question;
        resolutionTime = _resolutionTime;
        collateralToken = IERC20(_collateralToken);
        treasury = _treasury;
        resolver = _resolver; // address(0) if no resolver
        yesToken = new OutcomeToken(string.concat("YES: ", _question), "YES");
        noToken  = new OutcomeToken(string.concat("NO: ", _question), "NO");
    }

    modifier notResolved() {
        if (resolved) revert MarketAlreadyResolved();
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ── Seed Liquidity ───────────────────────────────────────────────

    /// @notice Seed initial 50/50 liquidity. Callable once.
    ///         Caller must approve `amount` of collateralToken first.
    function seed(uint256 amount) external nonReentrant notResolved whenNotPaused {
        if (initialized) revert AlreadyInitialized();
        if (amount == 0) revert ZeroAmount();
        require(amount >= 1e6, "Min seed 1 USDC");
        require(amount <= MAX_POOL_SIZE, "Exceeds pool cap");
        require(block.timestamp < resolutionTime, "Past resolution");

        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        yesToken.mint(address(this), amount);
        noToken.mint(address(this), amount);
        yesReserve = amount;
        noReserve  = amount;
        initialized = true;

        emit LiquiditySeeded(msg.sender, amount);
    }

    // ── Buy ──────────────────────────────────────────────────────────

    function buyYes(uint256 amount, uint256 minTokensOut) external nonReentrant notResolved whenNotPaused { _buy(true, amount, minTokensOut); }
    function buyNo(uint256 amount, uint256 minTokensOut)  external nonReentrant notResolved whenNotPaused { _buy(false, amount, minTokensOut); }

    /// @dev 1. Transfer USDC from user.
    ///      2. Mint complete set (x YES + x NO) to contract.
    ///      3. Swap: "sell" x of the unwanted side to pool for the wanted side.
    ///      4. Transfer wanted tokens (x + swapOut) to user.
    function _buy(bool yes, uint256 x, uint256 minOut) internal {
        if (!initialized) revert NotInitialized();
        require(block.timestamp < resolutionTime, "Trading closed");
        if (x == 0) revert ZeroAmount();
        require(x <= MAX_TRADE_AMOUNT, "Exceeds trade limit");

        collateralToken.safeTransferFrom(msg.sender, address(this), x);

        // Platform fee
        uint256 fee = (x * PLATFORM_FEE_BPS) / 10000;
        uint256 amountAfterFee = x - fee;
        if (fee > 0) {
            collateralToken.safeTransfer(treasury, fee);
        }

        // Pool cap check after fee deduction (only net amount stays in pool)
        require(collateralToken.balanceOf(address(this)) <= MAX_POOL_SIZE, "Pool cap reached");

        // Snapshot reserves before minting
        uint256 yR = yesReserve;
        uint256 nR = noReserve;

        // Mint complete set to contract (using amountAfterFee)
        yesToken.mint(address(this), amountAfterFee);
        noToken.mint(address(this), amountAfterFee);

        uint256 swapOut;
        uint256 totalOut;

        if (yes) {
            swapOut = (amountAfterFee * yR) / (nR + amountAfterFee);
            yesReserve = yR - swapOut;
            noReserve  = nR + amountAfterFee;
            totalOut = amountAfterFee + swapOut;
        } else {
            swapOut = (amountAfterFee * nR) / (yR + amountAfterFee);
            noReserve  = nR - swapOut;
            yesReserve = yR + amountAfterFee;
            totalOut = amountAfterFee + swapOut;
        }

        // Slippage check BEFORE token transfer
        if (totalOut < minOut) revert InsufficientOutput();

        if (yes) {
            yesToken.transfer(msg.sender, totalOut);
        } else {
            noToken.transfer(msg.sender, totalOut);
        }

        emit SharesBought(msg.sender, yes, x, totalOut);
    }

    // ── Sell ─────────────────────────────────────────────────────────

    function sellYes(uint256 amount, uint256 minUsdcOut) external nonReentrant notResolved whenNotPaused { _sell(true, amount, minUsdcOut); }
    function sellNo(uint256 amount, uint256 minUsdcOut)  external nonReentrant notResolved whenNotPaused { _sell(false, amount, minUsdcOut); }

    /// @dev Ceiling-sqrt partial-swap decomposition.
    ///      1. Solve quadratic to split amount into (swapIn, usdcOut).
    ///      2. Pull user's sold-side tokens (burn from user, mint to contract).
    ///      3. Burn usdcOut complete sets (both YES and NO).
    ///      4. Update reserves: sameReserve + swapIn, otherReserve - usdcOut.
    ///      5. Transfer usdcOut USDC to user.
    function _sell(bool yes, uint256 amount, uint256 minOut) internal {
        if (!initialized) revert NotInitialized();
        require(block.timestamp < resolutionTime, "Trading closed");
        if (amount == 0) revert ZeroAmount();

        uint256 sameReserve  = yes ? yesReserve : noReserve;
        uint256 otherReserve = yes ? noReserve  : yesReserve;

        (uint256 usdcOut, uint256 swapIn) = _quoteSellOut(sameReserve, otherReserve, amount);
        require(usdcOut > 0, "Zero output");
        if (usdcOut < minOut) revert InsufficientOutput();

        // Pull user's tokens into the contract
        if (yes) {
            yesToken.burn(msg.sender, amount);
            yesToken.mint(address(this), amount);
        } else {
            noToken.burn(msg.sender, amount);
            noToken.mint(address(this), amount);
        }

        // Burn usdcOut complete sets
        yesToken.burn(address(this), usdcOut);
        noToken.burn(address(this), usdcOut);

        // Update reserves
        if (yes) {
            yesReserve = sameReserve + swapIn;
            noReserve  = otherReserve - usdcOut;
        } else {
            noReserve  = sameReserve + swapIn;
            yesReserve = otherReserve - usdcOut;
        }

        collateralToken.safeTransfer(msg.sender, usdcOut);

        emit SharesSold(msg.sender, yes, amount, usdcOut);
    }

    // ── Sell Helpers ─────────────────────────────────────────────────

    /// @dev Solve: u^2 - (S + O + m)*u + O*m = 0 for the smaller root.
    ///      Returns (usdcOut, swapIn) where swapIn = amount - usdcOut.
    ///      Uses ceiling sqrt to ensure the pool is never drained.
    function _quoteSellOut(uint256 S, uint256 O, uint256 m)
        internal pure returns (uint256 usdcOut, uint256 swapIn)
    {
        uint256 a = S + O + m;
        uint256 disc = a * a - 4 * O * m;
        uint256 sqrtDisc = _sqrtUp(disc);
        usdcOut = (a - sqrtDisc) / 2;
        // Cap: cannot exceed otherReserve or the amount being sold
        if (usdcOut > O) usdcOut = O;
        if (usdcOut > m) usdcOut = m;
        swapIn = m - usdcOut;
    }

    /// @dev Ceiling integer square root using OZ Math.sqrt.
    function _sqrtUp(uint256 x) internal pure returns (uint256) {
        uint256 z = Math.sqrt(x);
        if (z * z != x) return z + 1;
        return z;
    }

    /// @notice Quote how much USDC selling `amount` YES tokens would return.
    function quoteSellYes(uint256 amount) external view returns (uint256) {
        (uint256 usdcOut, ) = _quoteSellOut(yesReserve, noReserve, amount);
        return usdcOut;
    }

    /// @notice Quote how much USDC selling `amount` NO tokens would return.
    function quoteSellNo(uint256 amount) external view returns (uint256) {
        (uint256 usdcOut, ) = _quoteSellOut(noReserve, yesReserve, amount);
        return usdcOut;
    }

    // ── Resolution ───────────────────────────────────────────────────

    function resolve(bool _yesWins) external {
        require(
            msg.sender == owner() || (resolver != address(0) && msg.sender == resolver),
            "Not authorized"
        );
        if (resolved) revert MarketAlreadyResolved();
        require(block.timestamp >= resolutionTime, "Too early");
        require(!emergencyActivated, "Emergency active");

        resolved = true;
        yesWins = _yesWins;

        // Burn contract-held losing tokens (cleanup, these have no claim)
        OutcomeToken losingToken = _yesWins ? noToken : yesToken;
        uint256 losingBalance = losingToken.balanceOf(address(this));
        if (losingBalance > 0) {
            losingToken.burn(address(this), losingBalance);
        }

        // Burn contract-held winning tokens so they don't dilute redeemers
        OutcomeToken winningToken = _yesWins ? yesToken : noToken;
        uint256 contractWinning = winningToken.balanceOf(address(this));
        if (contractWinning > 0) {
            winningToken.burn(address(this), contractWinning);
        }

        // Zero out reserves (no longer needed post-resolution)
        yesReserve = 0;
        noReserve = 0;

        uint256 pool = collateralToken.balanceOf(address(this));

        // If nobody externally holds the winning side, treat as refund-mode
        // instead of creating an owner-sweep branch.
        if (winningToken.totalSupply() == 0) {
            refundMode = true;
            emergencyActivated = true;
            emergencyPoolBalance = pool;
            resolvedPoolBalance = 0;

            emit MarketResolved(_yesWins);
            emit RefundModeEnabled(_yesWins, pool);
            return;
        }

        // Normal redemption path
        resolvedPoolBalance = pool;

        emit MarketResolved(_yesWins);
    }

    /// @notice Redeem winning tokens for proportional share of USDC pool.
    function redeem() external nonReentrant {
        if (!resolved) revert MarketNotResolved();
        require(!refundMode, "Refund mode - use emergencyRefund");

        OutcomeToken winningToken = yesWins ? yesToken : noToken;
        uint256 balance = winningToken.balanceOf(msg.sender);
        if (balance == 0) revert NothingToRedeem();

        uint256 totalWinning = winningToken.totalSupply();
        uint256 usdcOut = (balance * resolvedPoolBalance) / totalWinning;

        resolvedPoolBalance -= usdcOut; // Track remaining
        winningToken.burn(msg.sender, balance);

        collateralToken.safeTransfer(msg.sender, usdcOut);

        emit Redeemed(msg.sender, usdcOut);
    }

    /// @notice Deprecated. Zero-winner markets now use refundMode + emergencyRefund().
    function recoverStrandedFunds() external pure {
        revert("Disabled - use emergencyRefund");
    }

    function sweepDust() external onlyOwner {
        uint256 dust = collateralToken.balanceOf(address(this));
        if (dust == 0) return;

        // Refund path: either unresolved expiry -> activateEmergency(),
        // or resolved zero-winner market -> refundMode set in resolve().
        if (emergencyActivated) {
            require(
                yesToken.totalSupply() + noToken.totalSupply() == 0,
                "Refunds pending"
            );
            emergencyPoolBalance = 0;
            resolvedPoolBalance = 0;
            collateralToken.safeTransfer(treasury, dust);
            return;
        }

        // Normal resolved redemption path
        require(resolved, "Not resolved");
        OutcomeToken winningToken = yesWins ? yesToken : noToken;
        require(winningToken.totalSupply() == 0, "Redemptions pending");
        resolvedPoolBalance = 0;
        collateralToken.safeTransfer(treasury, dust);
    }

    // ── Emergency Refund ─────────────────────────────────────────────

    /// @notice Activate emergency mode by burning contract-held inventory.
    ///         Callable by anyone after EMERGENCY_PERIOD. Must be called once
    ///         before emergencyRefund() so all users get fair shares.
    function activateEmergency() external nonReentrant {
        require(!resolved, "Already resolved");
        require(block.timestamp > resolutionTime + EMERGENCY_PERIOD, "Not expired");
        require(!emergencyActivated, "Already activated");

        emergencyActivated = true;

        // Burn contract-held inventory so it doesn't dilute user refunds
        uint256 contractYes = yesToken.balanceOf(address(this));
        uint256 contractNo = noToken.balanceOf(address(this));
        if (contractYes > 0) yesToken.burn(address(this), contractYes);
        if (contractNo > 0) noToken.burn(address(this), contractNo);

        // Snapshot pool balance for fair proportional refunds
        emergencyPoolBalance = collateralToken.balanceOf(address(this));
    }

    /// @notice Refund proportional share of collateral.
    /// Available in two cases:
    /// 1) unresolved market after activateEmergency()
    /// 2) resolved market in refundMode (auto-enabled when winning supply == 0)
    function emergencyRefund() external nonReentrant {
        require(emergencyActivated, "Emergency not activated");

        uint256 userYes = yesToken.balanceOf(msg.sender);
        uint256 userNo = noToken.balanceOf(msg.sender);
        uint256 totalTokens = yesToken.totalSupply() + noToken.totalSupply();

        if (totalTokens == 0) revert NothingToRedeem();

        uint256 userTokens = userYes + userNo;
        if (userTokens == 0) revert NothingToRedeem();

        uint256 refund = (userTokens * emergencyPoolBalance) / totalTokens;
        emergencyPoolBalance -= refund;

        if (userYes > 0) yesToken.burn(msg.sender, userYes);
        if (userNo > 0) noToken.burn(msg.sender, userNo);

        collateralToken.safeTransfer(msg.sender, refund);

        emit EmergencyRefund(msg.sender, refund);
    }

    // ── Views ────────────────────────────────────────────────────────

    /// @notice Implied probability of YES (18 decimals).
    function getYesPrice() external view returns (uint256) {
        if (!initialized) return 0.5e18;
        return (noReserve * 1e18) / (yesReserve + noReserve);
    }

    /// @notice Implied probability of NO (18 decimals).
    function getNoPrice() external view returns (uint256) {
        if (!initialized) return 0.5e18;
        return (yesReserve * 1e18) / (yesReserve + noReserve);
    }
}
