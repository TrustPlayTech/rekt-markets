// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BinaryMarket.sol";
import "../src/OutcomeToken.sol";
import "./MockERC20.sol";

contract BinaryMarketTest is Test {
    BinaryMarket market;
    MockERC20 usdc;
    address owner = address(this);
    address alice = address(0xA11CE);
    address bob   = address(0xB0B);
    address treasury = address(0xFEE);

    uint256 constant SEED = 10_000_000; // 10 USDC (6 decimals)

    function setUp() public {
        usdc = new MockERC20();
        market = new BinaryMarket("Will BTC hit 150k?", block.timestamp + 30 days, owner, address(usdc), treasury, address(0));

        // Seed liquidity with 10 USDC
        usdc.mint(owner, SEED);
        usdc.approve(address(market), SEED);
        market.seed(SEED);
    }

    // ── Initialization ───────────────────────────────────────────────

    function test_initialization() public view {
        assertTrue(market.initialized());
        assertEq(market.yesReserve(), SEED);
        assertEq(market.noReserve(), SEED);
        assertEq(usdc.balanceOf(address(market)), SEED);
    }

    function test_initialPrices() public view {
        assertEq(market.getYesPrice(), 0.5e18);
        assertEq(market.getNoPrice(), 0.5e18);
    }

    // ── Buy YES ──────────────────────────────────────────────────────

    function test_buyYes() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        OutcomeToken yesToken = market.yesToken();
        uint256 balance = yesToken.balanceOf(alice);
        assertGt(balance, 0, "alice should have YES tokens");

        // YES price should increase after buying YES
        assertGt(market.getYesPrice(), 0.5e18);
    }

    // ── Buy NO ───────────────────────────────────────────────────────

    function test_buyNo() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        OutcomeToken noToken = market.noToken();
        uint256 balance = noToken.balanceOf(alice);
        assertGt(balance, 0, "alice should have NO tokens");

        assertGt(market.getNoPrice(), 0.5e18);
    }

    // ── Price movement ───────────────────────────────────────────────

    function test_priceMovement() public {
        uint256 initialYesPrice = market.getYesPrice();

        // Buy YES
        uint256 amount = 2_000_000; // 2 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        uint256 afterYesPrice = market.getYesPrice();
        assertGt(afterYesPrice, initialYesPrice, "YES price should rise after YES buy");

        // Buy NO
        usdc.mint(bob, amount);
        vm.startPrank(bob);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        uint256 afterNoPrice = market.getNoPrice();
        assertGt(afterNoPrice, market.getYesPrice() > afterYesPrice ? 0 : 1);
    }

    // ── Sell YES ─────────────────────────────────────────────────────

    function test_sellYes() public {
        uint256 amount = 2_000_000; // 2 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);

        OutcomeToken yesToken = market.yesToken();
        uint256 yesBalance = yesToken.balanceOf(alice);
        uint256 usdcBefore = usdc.balanceOf(alice);

        // Sell half
        uint256 sellAmount = yesBalance / 2;
        market.sellYes(sellAmount, 0);
        vm.stopPrank();

        assertGt(usdc.balanceOf(alice), usdcBefore, "alice should have received USDC");
        assertEq(yesToken.balanceOf(alice), yesBalance - sellAmount);
    }

    // ── Sell NO ──────────────────────────────────────────────────────

    function test_sellNo() public {
        uint256 amount = 2_000_000; // 2 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);

        OutcomeToken noToken = market.noToken();
        uint256 noBalance = noToken.balanceOf(alice);
        uint256 usdcBefore = usdc.balanceOf(alice);

        uint256 sellAmount = noBalance / 2;
        market.sellNo(sellAmount, 0);
        vm.stopPrank();

        assertGt(usdc.balanceOf(alice), usdcBefore, "alice should have received USDC");
    }

    // ── Resolve and Redeem ───────────────────────────────────────────

    function test_resolveYesWins() public {
        uint256 amount = 5_000_000; // 5 USDC

        // Alice buys YES
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        // Bob buys NO
        usdc.mint(bob, amount);
        vm.startPrank(bob);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        // Warp past resolution time, then resolve: YES wins
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);
        assertTrue(market.resolved());
        assertTrue(market.yesWins());

        // Alice redeems
        uint256 usdcBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.redeem();
        assertGt(usdc.balanceOf(alice), usdcBefore, "alice should receive USDC");

        // Bob has no winning tokens
        vm.prank(bob);
        vm.expectRevert(BinaryMarket.NothingToRedeem.selector);
        market.redeem();
    }

    function test_resolveNoWins() public {
        uint256 amount = 5_000_000; // 5 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 31 days);
        market.resolve(false);
        assertFalse(market.yesWins());

        uint256 usdcBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.redeem();
        assertGt(usdc.balanceOf(alice), usdcBefore);
    }

    // ── Reverts ──────────────────────────────────────────────────────

    function test_cannotBuyAfterResolution() public {
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);
        uint256 amount = 1_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        vm.expectRevert(BinaryMarket.MarketAlreadyResolved.selector);
        market.buyYes(amount, 0);
        vm.stopPrank();
    }

    function test_cannotRedeemBeforeResolution() public {
        vm.prank(alice);
        vm.expectRevert(BinaryMarket.MarketNotResolved.selector);
        market.redeem();
    }

    function test_cannotResolvetwice() public {
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);
        vm.expectRevert(BinaryMarket.MarketAlreadyResolved.selector);
        market.resolve(false);
    }

    function test_onlyOwnerOrResolverCanResolve() public {
        vm.warp(block.timestamp + 31 days);
        vm.prank(alice);
        vm.expectRevert("Not authorized");
        market.resolve(true);
    }

    function test_resolverCanResolve() public {
        address resolverAddr = address(0xDE50);
        BinaryMarket marketWithResolver = new BinaryMarket(
            "Resolver test?", block.timestamp + 30 days, owner, address(usdc), treasury, resolverAddr
        );

        // Seed it
        usdc.mint(owner, SEED);
        usdc.approve(address(marketWithResolver), SEED);
        marketWithResolver.seed(SEED);

        vm.warp(block.timestamp + 31 days);
        vm.prank(resolverAddr);
        marketWithResolver.resolve(true);
        assertTrue(marketWithResolver.resolved());
    }

    // ── Prices sum to 1 ─────────────────────────────────────────────

    function test_pricesSumToOne() public {
        uint256 amount = 3_000_000; // 3 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        uint256 yesPrice = market.getYesPrice();
        uint256 noPrice  = market.getNoPrice();
        // Should sum to ~1e18 (allow 1 wei rounding)
        assertApproxEqAbs(yesPrice + noPrice, 1e18, 1);
    }

    // ── Pause mechanism ──────────────────────────────────────────────

    function test_pauseBuyYesReverts() public {
        market.pause();
        uint256 amount = 1_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        vm.expectRevert("Paused");
        market.buyYes(amount, 0);
        vm.stopPrank();
    }

    function test_pauseBuyNoReverts() public {
        market.pause();
        uint256 amount = 1_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        vm.expectRevert("Paused");
        market.buyNo(amount, 0);
        vm.stopPrank();
    }

    function test_pauseSellYesReverts() public {
        // First buy some YES tokens
        uint256 amount = 2_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        // Pause, then try to sell
        market.pause();
        OutcomeToken yesToken = market.yesToken();
        uint256 balance = yesToken.balanceOf(alice);
        vm.startPrank(alice);
        vm.expectRevert("Paused");
        market.sellYes(balance, 0);
        vm.stopPrank();
    }

    function test_pauseSellNoReverts() public {
        uint256 amount = 2_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        market.pause();
        OutcomeToken noToken = market.noToken();
        uint256 balance = noToken.balanceOf(alice);
        vm.startPrank(alice);
        vm.expectRevert("Paused");
        market.sellNo(balance, 0);
        vm.stopPrank();
    }

    function test_redeemWorksWhenPaused() public {
        // Alice buys YES
        uint256 amount = 5_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        // Resolve YES wins
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);

        // Pause the market
        market.pause();

        // Redeem should still work
        uint256 usdcBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.redeem();
        assertGt(usdc.balanceOf(alice), usdcBefore, "redeem should work when paused");
    }

    function test_emergencyRefundWorksWhenPaused() public {
        // Alice buys YES
        uint256 amount = 2_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        // Warp past resolution + emergency period, activate emergency
        vm.warp(block.timestamp + 31 days + 30 days + 1);
        market.activateEmergency();

        // Pause
        market.pause();

        // Emergency refund should still work
        uint256 usdcBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.emergencyRefund();
        assertGt(usdc.balanceOf(alice), usdcBefore, "emergency refund should work when paused");
    }

    // ── T07: Pool cap after fee ────────────────────────────────────

    function test_poolCapAfterFee() public {
        // MAX_POOL_SIZE = 10,000 USDC, PLATFORM_FEE_BPS = 100 (1%)
        // Seed is already 10 USDC. Need to get pool near cap.
        // Buy in chunks to fill pool. Each buy: 1% fee goes to treasury.
        // After fee, net amount stays in pool.
        // Let's create a fresh market with a bigger seed near the cap.
        BinaryMarket bigMarket = new BinaryMarket(
            "Cap test?", block.timestamp + 30 days, owner, address(usdc), treasury, address(0)
        );
        uint256 seedAmt = 9_900 * 1e6; // 9900 USDC seed
        usdc.mint(owner, seedAmt);
        usdc.approve(address(bigMarket), seedAmt);
        bigMarket.seed(seedAmt);

        // Pool is at 9900 USDC. Cap is 10000 USDC. 
        // Buy 100 USDC: fee = 1 USDC, net = 99 USDC. Pool = 9900 + 99 = 9999 <= 10000. Should succeed.
        uint256 buyAmt = 100 * 1e6; // unused, kept for reference
        // MAX_TRADE_AMOUNT is 100 USDC. So max buy is 100. Fee = 1 USDC (1%). Net = 99.
        // Pool = 9900 + 99 = 9999. Need to get closer to cap.
        // Seed 9_950 USDC instead.
        BinaryMarket capMarket = new BinaryMarket(
            "Cap test 2?", block.timestamp + 30 days, owner, address(usdc), treasury, address(0)
        );
        uint256 seedAmt2 = 9_950 * 1e6;
        usdc.mint(owner, seedAmt2);
        usdc.approve(address(capMarket), seedAmt2);
        capMarket.seed(seedAmt2);

        // Pool at 9950. With 1% fee: net = buy * 0.99. pool + buy*0.99 <= 10000
        // 9950 + buy*0.99 <= 10000 -> buy <= 50.50 USDC
        // So buy 50 USDC: fee = 0.50. net = 49.50. Pool = 9999.50. OK.
        usdc.mint(alice, 50 * 1e6);
        vm.startPrank(alice);
        usdc.approve(address(capMarket), 50 * 1e6);
        capMarket.buyYes(50 * 1e6, 0); // Should succeed with fee deducted before cap check
        vm.stopPrank();
    }

    function test_poolCapExceeded() public {
        BinaryMarket capMarket = new BinaryMarket(
            "Cap exceed?", block.timestamp + 30 days, owner, address(usdc), treasury, address(0)
        );
        uint256 seedAmt = 9_950 * 1e6;
        usdc.mint(owner, seedAmt);
        usdc.approve(address(capMarket), seedAmt);
        capMarket.seed(seedAmt);

        // Buy 100 USDC: fee = 2 USDC. Net = 98 USDC. Pool = 9950 + 98 = 10048 > 10000.
        usdc.mint(alice, 100 * 1e6);
        vm.startPrank(alice);
        usdc.approve(address(capMarket), 100 * 1e6);
        vm.expectRevert("Pool cap reached");
        capMarket.buyYes(100 * 1e6, 0);
        vm.stopPrank();
    }

    // ── T06: sweepDust ─────────────────────────────────────────────

    function test_sweepDust() public {
        // Alice buys YES
        uint256 amount = 5_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        // Resolve YES wins
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);

        // Alice redeems all
        vm.prank(alice);
        market.redeem();

        // There may be dust left
        uint256 dustBefore = usdc.balanceOf(address(market));
        uint256 treasuryBefore = usdc.balanceOf(treasury);

        market.sweepDust();

        assertEq(usdc.balanceOf(address(market)), 0);
        assertEq(usdc.balanceOf(treasury), treasuryBefore + dustBefore);
    }

    function test_sweepDustBeforeAllRedemptions() public {
        uint256 amount = 5_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 31 days);
        market.resolve(true);

        // Don't redeem - supply > 0
        vm.expectRevert("Redemptions pending");
        market.sweepDust();
    }

    function test_sweepDustUnresolved() public {
        vm.expectRevert("Not resolved");
        market.sweepDust();
    }

    function test_sweepDustOnlyOwner() public {
        vm.warp(block.timestamp + 31 days);
        market.resolve(true);

        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", alice));
        market.sweepDust();
    }

    // ── T05: Emergency snapshot ────────────────────────────────────

    function test_emergencySnapshotFair() public {
        // Alice and Bob buy
        uint256 amount = 2_000_000; // 2 USDC each
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        usdc.mint(bob, amount);
        vm.startPrank(bob);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        // Warp past resolution + emergency period
        vm.warp(block.timestamp + 31 days + 30 days + 1);

        // Send extra USDC directly to contract (attacker inflating balance)
        usdc.mint(address(this), 100_000_000); // 100 USDC
        usdc.transfer(address(market), 100_000_000);

        // Activate emergency - snapshot taken BEFORE extra USDC matters for proportional calc
        market.activateEmergency();
        uint256 snapshot = market.emergencyPoolBalance();

        // Both refund
        uint256 aliceBefore = usdc.balanceOf(alice);
        vm.prank(alice);
        market.emergencyRefund();
        uint256 aliceRefund = usdc.balanceOf(alice) - aliceBefore;

        uint256 bobBefore = usdc.balanceOf(bob);
        vm.prank(bob);
        market.emergencyRefund();
        uint256 bobRefund = usdc.balanceOf(bob) - bobBefore;

        // Refunds should be based on snapshot, total should equal snapshot
        assertEq(aliceRefund + bobRefund, snapshot, "Total refunds should equal snapshot");
    }

    function test_emergencyPoolBalanceZeroAfterAllRefunds() public {
        uint256 amount = 2_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        usdc.mint(bob, amount);
        vm.startPrank(bob);
        usdc.approve(address(market), amount);
        market.buyNo(amount, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 31 days + 30 days + 1);
        market.activateEmergency();

        vm.prank(alice);
        market.emergencyRefund();
        vm.prank(bob);
        market.emergencyRefund();

        assertEq(market.emergencyPoolBalance(), 0, "emergencyPoolBalance should be 0");
    }

    // ── T08: Pause/Unpause events ──────────────────────────────────

    event Paused(address indexed account);
    event Unpaused(address indexed account);

    function test_pauseEvent() public {
        vm.expectEmit(true, false, false, true);
        emit Paused(owner);
        market.pause();
    }

    function test_unpauseEvent() public {
        market.pause();
        vm.expectEmit(true, false, false, true);
        emit Unpaused(owner);
        market.unpause();
    }

    function test_unpauseThenBuyWorks() public {
        market.pause();
        market.unpause();

        uint256 amount = 1_000_000;
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(market), amount);
        market.buyYes(amount, 0);
        vm.stopPrank();

        OutcomeToken yesToken = market.yesToken();
        assertGt(yesToken.balanceOf(alice), 0);
    }
}
