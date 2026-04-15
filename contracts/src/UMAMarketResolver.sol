// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IOptimisticOracleV3 {
    function assertTruth(
        bytes calldata claim,
        address asserter,
        address callbackRecipient,
        address escalationManager,
        uint64 liveness,
        IERC20 currency,
        uint256 bond,
        bytes32 identifier,
        bytes32 domainId
    ) external returns (bytes32);

    function settleAssertion(bytes32 assertionId) external;
}

interface IBinaryMarket {
    function resolve(bool _yesWins) external;
    function resolved() external view returns (bool);
    function question() external view returns (string memory);
}

/// @title UMAMarketResolver
/// @notice Decentralized resolution for BinaryMarket via UMA Optimistic Oracle V3.
///         Anyone can propose a resolution by posting a bond. After the challenge
///         period (2 hours), if undisputed, the market is resolved automatically.
///         The market owner retains emergency override via direct resolve().
contract UMAMarketResolver {
    using SafeERC20 for IERC20;

    IOptimisticOracleV3 public immutable oracle;
    IERC20 public immutable bondCurrency;
    uint256 public constant BOND_AMOUNT = 360e6; // 360 USDC bond (6 decimals)
    uint64 public constant LIVENESS = 7200; // 2 hours
    bytes32 public constant IDENTIFIER = bytes32("ASSERT_TRUTH");

    // Market -> active assertion
    mapping(address => bytes32) public marketAssertions;
    // Assertion -> market
    mapping(bytes32 => address) public assertionMarkets;
    // Assertion -> proposed outcome (true = YES wins)
    mapping(bytes32 => bool) public assertionOutcomes;
    // Market -> last dispute timestamp (for cooldown)
    mapping(address => uint256) public lastDisputeTime;

    event ResolutionProposed(address indexed market, bytes32 assertionId, bool yesWins, address proposer);
    event ResolutionExecuted(address indexed market, bool yesWins);
    event ResolutionDisputed(address indexed market, bytes32 assertionId);

    constructor(address _oracle, address _bondCurrency) {
        require(_oracle != address(0), "Zero oracle");
        require(_bondCurrency != address(0), "Zero currency");
        oracle = IOptimisticOracleV3(_oracle);
        bondCurrency = IERC20(_bondCurrency);
    }

    /// @notice Propose a resolution for a market. Caller must approve BOND_AMOUNT of bondCurrency.
    /// @param market Address of the BinaryMarket to resolve
    /// @param yesWins Proposed outcome: true = YES wins, false = NO wins
    function proposeResolution(address market, bool yesWins) external {
        require(!IBinaryMarket(market).resolved(), "Already resolved");
        require(marketAssertions[market] == bytes32(0), "Pending assertion");
        if (lastDisputeTime[market] != 0) {
            require(block.timestamp >= lastDisputeTime[market] + 1 hours, "Cooldown active");
        }

        // Build claim text
        string memory question = IBinaryMarket(market).question();
        bytes memory claim = abi.encodePacked(
            "Resolution for Blizz Markets: ",
            question,
            " Outcome: ",
            yesWins ? "YES" : "NO"
        );

        // Transfer bond from proposer
        bondCurrency.safeTransferFrom(msg.sender, address(this), BOND_AMOUNT);
        bondCurrency.forceApprove(address(oracle), BOND_AMOUNT);

        // Assert truth via UMA OOV3
        bytes32 assertionId = oracle.assertTruth(
            claim,
            msg.sender,        // asserter
            address(this),     // callback recipient
            address(0),        // no escalation manager
            LIVENESS,
            bondCurrency,
            BOND_AMOUNT,
            IDENTIFIER,
            bytes32(0)         // no domain
        );

        marketAssertions[market] = assertionId;
        assertionMarkets[assertionId] = market;
        assertionOutcomes[assertionId] = yesWins;

        emit ResolutionProposed(market, assertionId, yesWins, msg.sender);
    }

    /// @notice Called by UMA OOV3 when assertion is resolved (after liveness or DVM vote)
    function assertionResolvedCallback(bytes32 assertionId, bool assertedTruthfully) external {
        require(msg.sender == address(oracle), "Only oracle");

        address market = assertionMarkets[assertionId];
        require(market != address(0), "Unknown assertion");

        if (assertedTruthfully && !IBinaryMarket(market).resolved()) {
            bool yesWins = assertionOutcomes[assertionId];
            IBinaryMarket(market).resolve(yesWins);
            emit ResolutionExecuted(market, yesWins);
        }

        // Clean up
        _cleanup(assertionId, market);
    }

    /// @notice Called by UMA OOV3 when assertion is disputed
    function assertionDisputedCallback(bytes32 assertionId) external {
        require(msg.sender == address(oracle), "Only oracle");

        address market = assertionMarkets[assertionId];
        lastDisputeTime[market] = block.timestamp;
        emit ResolutionDisputed(market, assertionId);

        // Clean up - market stays unresolved, can be re-proposed
        _cleanup(assertionId, market);
    }

    function _cleanup(bytes32 assertionId, address market) internal {
        delete marketAssertions[market];
        delete assertionMarkets[assertionId];
        delete assertionOutcomes[assertionId];
    }
}
