// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BondingCurveToken.sol";
import "./MockERC20.sol";

contract BondingCurveTokenTest is Test {
    BondingCurveToken token;
    MockERC20 usdc;
    address creator = address(0xC0DE);
    address alice   = address(0xA11CE);
    address bob     = address(0xB0B);

    function setUp() public {
        usdc = new MockERC20();
        token = new BondingCurveToken("BlizzCoin", "BLIZZ", "https://blizz.io/logo.png", creator, address(usdc), address(0xFEED));
    }

    // ── Basic state ──────────────────────────────────────────────────

    function test_initialState() public view {
        assertEq(token.name(), "BlizzCoin");
        assertEq(token.symbol(), "BLIZZ");
        assertEq(token.imageURI(), "https://blizz.io/logo.png");
        assertEq(token.creator(), creator);
        assertEq(token.totalSupply(), 0);
        assertEq(token.getPrice(), 100); // BASE_PRICE = 100 (0.0001 USDC)
        assertFalse(token.graduated());
    }

    // ── Buy ──────────────────────────────────────────────────────────

    function test_buy() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        vm.stopPrank();

        assertGt(token.balanceOf(alice), 0, "alice should have tokens");
        assertGt(token.totalSupply(), 0);
    }

    function test_buyIncrementsPrice() public {
        uint256 priceBefore = token.getPrice();

        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        vm.stopPrank();

        uint256 priceAfter = token.getPrice();
        assertGt(priceAfter, priceBefore, "price should increase after buy");
    }

    function test_creatorFee() public {
        // Fee is on sell side now, not buy side
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);

        // No fee on buy - all USDC goes to reserve
        assertEq(usdc.balanceOf(creator), 0, "no fee on buy");

        // Now sell and check creator receives fee
        uint256 balance = token.balanceOf(alice);
        uint256 creatorBefore = usdc.balanceOf(creator);
        token.sell(balance, 0);
        vm.stopPrank();

        uint256 fee = usdc.balanceOf(creator) - creatorBefore;
        assertGt(fee, 0, "creator should receive fee on sell");
    }

    // ── Sell ─────────────────────────────────────────────────────────

    function test_sell() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);

        uint256 balance = token.balanceOf(alice);
        uint256 usdcBefore = usdc.balanceOf(alice);

        token.sell(balance / 2, 0);
        vm.stopPrank();

        assertGt(usdc.balanceOf(alice), usdcBefore, "alice should receive USDC");
        assertEq(token.balanceOf(alice), balance - balance / 2);
    }

    function test_sellDecrementsPrice() public {
        uint256 amount = 2_000_000; // 2 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);

        uint256 priceBefore = token.getPrice();
        uint256 balance = token.balanceOf(alice);

        token.sell(balance / 2, 0);
        vm.stopPrank();

        assertLt(token.getPrice(), priceBefore, "price should decrease after sell");
    }

    // ── Bonding curve math ───────────────────────────────────────────

    function test_multipleBuys() public {
        uint256 amount = 1_000_000; // 1 USDC each

        // First buyer should get more tokens per USDC than second buyer
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        vm.stopPrank();
        uint256 aliceTokens = token.balanceOf(alice);

        usdc.mint(bob, amount);
        vm.startPrank(bob);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        vm.stopPrank();
        uint256 bobTokens = token.balanceOf(bob);

        assertGt(aliceTokens, bobTokens, "early buyer gets more tokens");
    }

    // ── Graduation ───────────────────────────────────────────────────

    function _buyInChunks(address buyer, uint256 totalAmount) internal {
        uint256 maxPerBuy = token.MAX_BUY_AMOUNT();
        usdc.mint(buyer, totalAmount);
        vm.startPrank(buyer);
        usdc.approve(address(token), totalAmount);
        uint256 remaining = totalAmount;
        while (remaining > 0) {
            uint256 chunk = remaining > maxPerBuy ? maxPerBuy : remaining;
            token.buy(chunk, 0);
            remaining -= chunk;
        }
        vm.stopPrank();
    }

    // ── T02: Graduation disabled ────────────────────────────────────

    function test_graduateDisabled() public {
        uint256 amount = 100_000_000_000; // 100,000 USDC
        _buyInChunks(alice, amount);
        vm.expectRevert("Graduation disabled - V2 feature");
        token.graduate();
    }

    function test_withdrawForMigrationDisabled() public {
        vm.prank(creator);
        vm.expectRevert("Migration disabled - V2 feature");
        token.withdrawForMigration();
    }

    function test_buyAndSellStillWork() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        uint256 bal = token.balanceOf(alice);
        assertGt(bal, 0);
        token.sell(bal / 2, 0);
        assertGt(usdc.balanceOf(alice), 0);
        vm.stopPrank();
    }

    // ── Reverts ──────────────────────────────────────────────────────

    function test_buyZero() public {
        vm.prank(alice);
        vm.expectRevert(BondingCurveToken.ZeroAmount.selector);
        token.buy(0, 0);
    }

    function test_sellZero() public {
        vm.prank(alice);
        vm.expectRevert(BondingCurveToken.ZeroAmount.selector);
        token.sell(0, 0);
    }

    // ── Market cap ───────────────────────────────────────────────────

    function test_marketCap() public {
        uint256 amount = 1_000_000; // 1 USDC
        usdc.mint(alice, amount);
        vm.startPrank(alice);
        usdc.approve(address(token), amount);
        token.buy(amount, 0);
        vm.stopPrank();

        uint256 mc = token.getMarketCap();
        assertGt(mc, 0, "market cap should be > 0");
    }
}
