// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BinaryMarket.sol";
import "../src/OutcomeToken.sol";
import "./MockERC20.sol";

contract BinaryMarketRefundModeTest is Test {
    BinaryMarket market;
    MockERC20 usdc;
    address owner = address(this);
    address alice = address(0xA11CE);
    address bob   = address(0xB0B);
    address treasury = address(0xFEE);

    uint256 constant SEED = 10_000_000; // 10 USDC (6 decimals)

    function setUp() public {
        usdc = new MockERC20();
        market = new BinaryMarket(
            "Will BTC hit 150k?",
            block.timestamp + 30 days,
            owner,
            address(usdc),
            treasury,
            address(0)
        );

        // Seed liquidity with 10 USDC
        usdc.mint(owner, SEED);
        usdc.approve(address(market), SEED);
        market.seed(SEED);
    }

    /// @notice Helper: alice buys YES tokens only (no one buys NO)
    function _aliceBuysYesOnly(uint256 amount) internal {
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();
    }

    // ── Test 1: resolving to zero-holder winning side sets refundMode ──

    function test_refundMode_zeroWinnerSetsRefundMode() public {
        // Alice buys only YES (no one buys NO)
        _aliceBuysYesOnly(5_000_000);

        // Warp past resolution time
        vm.warp(block.timestamp + 31 days);

        // Resolve to NO (zero external holders of NO token)
        market.resolve(false);

        // Assert state
        assertTrue(market.refundMode(), "refundMode should be true");
        assertTrue(market.emergencyActivated(), "emergencyActivated should be true");
        assertTrue(market.resolved(), "resolved should be true");
        assertGt(market.emergencyPoolBalance(), 0, "emergencyPoolBalance should be > 0");
        assertEq(market.resolvedPoolBalance(), 0, "resolvedPoolBalance should be 0");

        // redeem() should revert with "Refund mode" message
        vm.prank(alice);
        vm.expectRevert("Refund mode - use emergencyRefund");
        market.redeem();
    }

    // ── Test 2: recoverStrandedFunds always reverts ──

    function test_recoverStrandedFunds_alwaysReverts() public {
        // Should revert from any address, regardless of state
        vm.expectRevert("Disabled - use emergencyRefund");
        market.recoverStrandedFunds();

        vm.prank(alice);
        vm.expectRevert("Disabled - use emergencyRefund");
        market.recoverStrandedFunds();

        // Even after resolution
        _aliceBuysYesOnly(5_000_000);
        vm.warp(block.timestamp + 31 days);
        market.resolve(false);

        vm.expectRevert("Disabled - use emergencyRefund");
        market.recoverStrandedFunds();
    }

    // ── Test 3: emergencyRefund works after zero-winner resolution ──

    function test_refundMode_emergencyRefundWorks() public {
        uint256 buyAmount = 5_000_000; // 5 USDC
        _aliceBuysYesOnly(buyAmount);

        // Warp and resolve to NO (refundMode triggers)
        vm.warp(block.timestamp + 31 days);
        market.resolve(false);

        assertTrue(market.refundMode(), "should be in refundMode");
        assertTrue(market.emergencyActivated(), "emergency should be activated");

        // Alice calls emergencyRefund
        uint256 aliceUsdcBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.emergencyRefund();
        uint256 aliceUsdcAfter = usdc.balanceOf(alice);

        assertGt(aliceUsdcAfter, aliceUsdcBefore, "alice should receive USDC refund");

        // Alice's YES tokens should be burned
        OutcomeToken yesToken = market.yesToken();
        assertEq(yesToken.balanceOf(alice), 0, "alice YES balance should be 0");
    }

    // ── Test 4: sweepDust reverts while refund tokens remain ──

    function test_sweepDust_revertsWhileRefundsPending() public {
        _aliceBuysYesOnly(5_000_000);

        vm.warp(block.timestamp + 31 days);
        market.resolve(false);

        assertTrue(market.refundMode());
        assertTrue(market.emergencyActivated());

        // Alice hasn't refunded yet - tokens still exist
        vm.expectRevert("Refunds pending");
        market.sweepDust();
    }

    // ── Test 5: sweepDust succeeds after all refunds complete ──

    function test_sweepDust_succeedsAfterAllRefunds() public {
        _aliceBuysYesOnly(5_000_000);

        vm.warp(block.timestamp + 31 days);
        market.resolve(false);

        // Alice refunds all her YES tokens
        vm.prank(alice);
        market.emergencyRefund();

        // Now all user tokens are burned. sweepDust should work.
        uint256 treasuryBefore = usdc.balanceOf(treasury);
        uint256 marketBalance = usdc.balanceOf(address(market));

        market.sweepDust();

        // If there was any dust, it should go to treasury
        assertEq(usdc.balanceOf(address(market)), 0, "market should have 0 USDC");
        assertEq(usdc.balanceOf(treasury), treasuryBefore + marketBalance, "treasury should receive dust");
    }

    // ── Test 6: resolve reverts if emergency already activated ──

    function test_resolve_revertsIfEmergencyActive() public {
        _aliceBuysYesOnly(5_000_000);

        // Warp past resolution time + emergency period, activate emergency
        vm.warp(block.timestamp + 31 days + 30 days + 1);
        market.activateEmergency();

        assertTrue(market.emergencyActivated());

        // Try to resolve - should revert
        vm.expectRevert("Emergency active");
        market.resolve(true);
    }
}
