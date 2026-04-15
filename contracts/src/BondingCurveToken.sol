// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title BondingCurveToken
/// @notice ERC-20 meme token with a linear bonding curve backed by USDC (6 decimals).
///         price(s) = BASE_PRICE + s * SLOPE, where s = totalSupply in whole tokens.
///         All token amounts use 18 decimals internally.
///         Prices and reserves are in USDC units (6 decimals).
contract BondingCurveToken is ERC20, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_BUY_AMOUNT = 100 * 1e6; // 100 USDC
    uint256 public constant BASE_PRICE = 100;       // 0.0001 USDC (100 units at 6 decimals)
    uint256 public constant SLOPE = 1;               // 0.000001 USDC per whole token
    uint256 public constant GRADUATION_THRESHOLD = 5000 * 1e6; // 5000 USDC
    uint256 public constant CREATOR_FEE_BPS = 100;   // 1% to creator
    uint256 public constant PLATFORM_FEE_BPS = 100;   // 1% to treasury
    uint256 public constant GRADUATION_FEE = 5 * 1e6;  // 5 USDC (V2 - not active)
    uint256 public constant MAX_SUPPLY = 1_000_000_000e18; // 1B tokens - prevents overflow in quadratic math
    uint256 internal constant WAD = 1e18;

    IERC20 public collateralToken;
    address public creator;
    address public treasury;
    string public imageURI;
    bool public graduated;
    bool public migrated;

    event TokensBought(address indexed buyer, uint256 usdcIn, uint256 tokensOut);
    event TokensSold(address indexed seller, uint256 tokensIn, uint256 usdcOut);
    event Graduated(uint256 marketCap);
    event LiquidityMigrated(uint256 usdcAmount);

    error ZeroAmount();
    error InsufficientUSDC();
    error TransferFailed();
    error AlreadyGraduated();
    error ThresholdNotMet();
    error InsufficientOutput();

    constructor(
        string memory name_,
        string memory symbol_,
        string memory imageURI_,
        address creator_,
        address _collateralToken,
        address _treasury
    ) ERC20(name_, symbol_) {
        creator = creator_;
        imageURI = imageURI_;
        collateralToken = IERC20(_collateralToken);
        treasury = _treasury;
    }

    // ── Buy ──────────────────────────────────────────────────────────

    /// @notice Buy tokens with USDC. Caller must approve `usdcAmount` first.
    ///         All USDC goes to the reserve (no fee on buy to prevent reserve deficit).
    function buy(uint256 usdcAmount, uint256 minTokensOut) external nonReentrant {
        require(!graduated, "Graduated");
        if (usdcAmount == 0) revert ZeroAmount();
        require(usdcAmount <= MAX_BUY_AMOUNT, "Exceeds buy limit");

        collateralToken.safeTransferFrom(msg.sender, address(this), usdcAmount);

        // All USDC goes to tokens (fee moved to sell side)
        uint256 tokensOut = _calculateBuyTokens(totalSupply(), usdcAmount);
        if (tokensOut == 0) revert ZeroAmount();
        if (tokensOut < minTokensOut) revert InsufficientOutput();
        require(totalSupply() + tokensOut <= MAX_SUPPLY, "Max supply reached");

        _mint(msg.sender, tokensOut);

        emit TokensBought(msg.sender, usdcAmount, tokensOut);
    }

    // ── Sell ─────────────────────────────────────────────────────────

    /// @notice Sell tokens back to the curve. Allowed even after graduation so holders can exit.
    function sell(uint256 amount, uint256 minUsdcOut) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        uint256 grossOut = _calculateSellReturn(totalSupply(), amount);
        if (grossOut == 0) revert ZeroAmount();

        // Creator fee on sell side to prevent reserve deficit
        uint256 creatorFee = (grossOut * CREATOR_FEE_BPS) / 10000;
        uint256 platformFee = (grossOut * PLATFORM_FEE_BPS) / 10000;
        uint256 totalFee = creatorFee + platformFee;
        uint256 usdcOut = grossOut - totalFee;

        if (grossOut > collateralToken.balanceOf(address(this))) revert InsufficientUSDC();
        if (usdcOut < minUsdcOut) revert InsufficientOutput();

        _burn(msg.sender, amount);

        if (creatorFee > 0) {
            collateralToken.safeTransfer(creator, creatorFee);
        }
        if (platformFee > 0 && treasury != address(0)) {
            collateralToken.safeTransfer(treasury, platformFee);
        }

        collateralToken.safeTransfer(msg.sender, usdcOut);

        emit TokensSold(msg.sender, amount, usdcOut);
    }

    // ── Graduation ───────────────────────────────────────────────────

    function graduate() external {
        revert("Graduation disabled - V2 feature");
    }

    // ── Liquidity migration ────────────────────────────────────────────

    /// @notice Creator withdraws 90% of reserve for DEX listing after graduation.
    ///         10% remains so existing holders can still sell via the bonding curve.
    ///         On mainnet this will migrate to Aerodrome; for testnet the creator
    ///         handles the DEX listing manually.
    function withdrawForMigration() external nonReentrant {
        revert("Migration disabled - V2 feature");
    }

    // ── Views ────────────────────────────────────────────────────────

    /// @notice Current price per whole token (in USDC units, 6 decimals).
    function getPrice() public view returns (uint256) {
        uint256 s = totalSupply() / WAD; // supply in whole tokens
        return BASE_PRICE + s * SLOPE;
    }

    /// @notice Market cap in USDC units = (totalSupply / 1e18) * pricePerToken.
    function getMarketCap() public view returns (uint256) {
        return (totalSupply() * getPrice()) / WAD;
    }

    // ── Internal math ────────────────────────────────────────────────
    //
    // Price at supply s (whole tokens): p(s) = BASE_PRICE + s * SLOPE
    // Cost to buy from s0 to s0+n (whole tokens):
    //   integral = n * BASE_PRICE + SLOPE * n * (2*s0 + n) / 2
    //
    // We work in wad-scaled (1e18) token amounts throughout.
    // s0_wad = totalSupply(), n_wad = token amount in 1e18 units
    // s0 = s0_wad / WAD, n = n_wad / WAD
    //
    // cost = n_wad * BASE_PRICE / WAD + SLOPE * (n_wad^2 + 2*n_wad*s0_wad) / (2 * WAD^2)

    function _curveIntegral(uint256 s0Wad, uint256 nWad) internal pure returns (uint256) {
        uint256 linear = (nWad * BASE_PRICE) / WAD;
        uint256 quad = (SLOPE * nWad * (nWad + 2 * s0Wad)) / (2 * WAD * WAD);
        return linear + quad;
    }

    /// @dev Solve quadratic for tokens out given usdcIn at supply s0Wad.
    function _calculateBuyTokens(uint256 s0Wad, uint256 usdcIn) internal pure returns (uint256) {
        uint256 p = (2 * WAD * BASE_PRICE) / SLOPE + 2 * s0Wad;
        uint256 q = (2 * WAD * WAD * usdcIn) / SLOPE;
        uint256 disc = p * p + 4 * q;
        uint256 sqrtDisc = _sqrt(disc);
        return (sqrtDisc - p) / 2;
    }

    function _calculateSellReturn(uint256 s0Wad, uint256 amountWad) internal pure returns (uint256) {
        if (amountWad > s0Wad) return 0;
        return _curveIntegral(s0Wad - amountWad, amountWad);
    }

    function _sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
