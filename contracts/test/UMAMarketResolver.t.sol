// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UMAMarketResolver.sol";
import "../src/BinaryMarket.sol";
import "./MockERC20.sol";

/// @dev Minimal mock of UMA Optimistic Oracle V3 for testing
contract MockOOV3 {
    uint256 private nextId = 1;
    mapping(bytes32 => address) public callbackRecipients;

    function assertTruth(
        bytes calldata,
        address,
        address callbackRecipient,
        address,
        uint64,
        IERC20 currency,
        uint256 bond,
        bytes32,
        bytes32
    ) external returns (bytes32) {
        // Pull bond from caller
        currency.transferFrom(msg.sender, address(this), bond);
        bytes32 assertionId = bytes32(nextId++);
        callbackRecipients[assertionId] = callbackRecipient;
        return assertionId;
    }

    // Test helper: simulate successful assertion
    function resolveAssertion(bytes32 assertionId, bool truthfully) external {
        address recipient = callbackRecipients[assertionId];
        UMAMarketResolver(recipient).assertionResolvedCallback(assertionId, truthfully);
    }

    // Test helper: simulate dispute
    function disputeAssertion(bytes32 assertionId) external {
        address recipient = callbackRecipients[assertionId];
        UMAMarketResolver(recipient).assertionDisputedCallback(assertionId);
    }
}

contract UMAMarketResolverTest is Test {
    UMAMarketResolver resolver;
    MockOOV3 mockOracle;
    MockERC20 usdc;
    MockERC20 bondToken;
    BinaryMarket market;

    address owner = address(this);
    address proposer = address(0xA11CE);
    address treasury = address(0xFEE);

    uint256 constant SEED = 10_000_000; // 10 USDC

    function setUp() public {
        usdc = new MockERC20();
        bondToken = new MockERC20();
        mockOracle = new MockOOV3();

        resolver = new UMAMarketResolver(address(mockOracle), address(bondToken));

        market = new BinaryMarket(
            "Will BTC hit 150k?",
            block.timestamp + 30 days,
            owner,
            address(usdc),
            treasury,
            address(resolver)
        );

        // Seed market
        usdc.mint(owner, SEED);
        usdc.approve(address(market), SEED);
        market.seed(SEED);

        // Give proposer bond tokens (enough for multiple proposals at 360 USDC each)
        bondToken.mint(proposer, 5000e6);
    }

    function test_proposeResolution() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();

        bytes32 assertionId = resolver.marketAssertions(address(market));
        assertTrue(assertionId != bytes32(0), "Should have active assertion");
        assertEq(resolver.assertionMarkets(assertionId), address(market));
    }

    function test_cannotProposeTwice() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 720e6);
        resolver.proposeResolution(address(market), true);

        vm.expectRevert("Pending assertion");
        resolver.proposeResolution(address(market), false);
        vm.stopPrank();
    }

    function test_resolveViaCallback_yesWins() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();

        bytes32 assertionId = resolver.marketAssertions(address(market));

        // Warp past resolution time (needed for market.resolve)
        vm.warp(block.timestamp + 31 days);

        // Oracle resolves: assertion was truthful
        mockOracle.resolveAssertion(assertionId, true);

        assertTrue(market.resolved(), "Market should be resolved");
        assertTrue(market.yesWins(), "YES should win");
    }

    function test_resolveViaCallback_noWins() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), false);
        vm.stopPrank();

        bytes32 assertionId = resolver.marketAssertions(address(market));
        vm.warp(block.timestamp + 31 days);

        mockOracle.resolveAssertion(assertionId, true);

        assertTrue(market.resolved());
        assertFalse(market.yesWins(), "NO should win");
    }

    function test_disputeCleansUp() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();

        bytes32 assertionId = resolver.marketAssertions(address(market));

        // Oracle disputes
        mockOracle.disputeAssertion(assertionId);

        // State cleaned up
        assertEq(resolver.marketAssertions(address(market)), bytes32(0));
        assertEq(resolver.assertionMarkets(assertionId), address(0));
        assertFalse(market.resolved(), "Market should NOT be resolved after dispute");
    }

    function test_canReproposeAfterDispute() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 720e6);

        resolver.proposeResolution(address(market), true);
        bytes32 firstId = resolver.marketAssertions(address(market));
        mockOracle.disputeAssertion(firstId);

        // Advance past cooldown
        vm.warp(block.timestamp + 1 hours + 1);

        // Can propose again
        resolver.proposeResolution(address(market), false);
        bytes32 secondId = resolver.marketAssertions(address(market));
        assertTrue(secondId != bytes32(0));
        assertTrue(secondId != firstId);
        vm.stopPrank();
    }

    function test_falseAssertionDoesNotResolve() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();

        bytes32 assertionId = resolver.marketAssertions(address(market));
        vm.warp(block.timestamp + 31 days);

        // Oracle says assertion was NOT truthful (e.g., DVM voted against)
        mockOracle.resolveAssertion(assertionId, false);

        assertFalse(market.resolved(), "Market should NOT be resolved");
    }

    function test_onlyOracleCanCallback() public {
        vm.prank(proposer);
        vm.expectRevert("Only oracle");
        resolver.assertionResolvedCallback(bytes32(uint256(1)), true);

        vm.prank(proposer);
        vm.expectRevert("Only oracle");
        resolver.assertionDisputedCallback(bytes32(uint256(1)));
    }

    function test_cannotProposeForResolvedMarket() public {
        // Owner resolves directly
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);

        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        vm.expectRevert("Already resolved");
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();
    }

    function test_ownerCanStillResolveDirectly() public {
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);
        assertTrue(market.resolved());
        assertTrue(market.yesWins());
    }

    // ── T04: Bond amount & cooldown ──────────────────────────────────

    function test_bondAmount360() public {
        // Proposer must approve 360 USDC worth of bond
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), 360e6);
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();

        // Bond token was transferred (360 USDC)
        assertEq(bondToken.balanceOf(address(mockOracle)), 360e6);
    }

    function test_cooldownAfterDispute() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), type(uint256).max);

        resolver.proposeResolution(address(market), true);
        bytes32 aid = resolver.marketAssertions(address(market));
        vm.stopPrank();

        mockOracle.disputeAssertion(aid);

        // Immediate re-propose should fail (cooldown active)
        vm.startPrank(proposer);
        vm.expectRevert("Cooldown active");
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();
    }

    function test_cooldownExpires() public {
        vm.startPrank(proposer);
        bondToken.approve(address(resolver), type(uint256).max);

        resolver.proposeResolution(address(market), true);
        bytes32 aid = resolver.marketAssertions(address(market));
        vm.stopPrank();

        mockOracle.disputeAssertion(aid);

        // Advance 1 hour + 1 second
        vm.warp(block.timestamp + 1 hours + 1);

        vm.startPrank(proposer);
        resolver.proposeResolution(address(market), false);
        vm.stopPrank();

        bytes32 newAid = resolver.marketAssertions(address(market));
        assertTrue(newAid != bytes32(0));
    }

    function test_insufficientBond() public {
        // Give a new user only 100 USDC worth of bond tokens
        address poorProposer = address(0xDEAD);
        bondToken.mint(poorProposer, 100e6);
        vm.startPrank(poorProposer);
        bondToken.approve(address(resolver), 100e6);
        vm.expectRevert(); // Will fail on transferFrom since 100 < 360
        resolver.proposeResolution(address(market), true);
        vm.stopPrank();
    }
}
