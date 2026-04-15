// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/MarketFactory.sol";
import "./MockERC20.sol";

contract MarketFactoryTest is Test {
    event MarketCreated(address indexed market, string question, address indexed creator);
    MarketFactory factory;
    MockERC20 usdc;
    address treasury = address(0xFEE);

    function setUp() public {
        usdc = new MockERC20();
        usdc.mint(address(this), 1_000_000 * 1e6);
        factory = new MarketFactory(address(usdc), treasury, address(0));
        // Approve factory to spend creation fees
        usdc.approve(address(factory), type(uint256).max);
    }

    function test_createMarket() public {
        address market = factory.createMarket("Will BTC hit 150k?", block.timestamp + 30 days);
        assertFalse(market == address(0));
        assertEq(factory.getMarketCount(), 1);
    }

    function test_creationFeeCollected() public {
        uint256 balBefore = usdc.balanceOf(treasury);
        factory.createMarket("Fee test?", block.timestamp + 30 days);
        uint256 balAfter = usdc.balanceOf(treasury);
        assertEq(balAfter - balBefore, factory.MARKET_CREATION_FEE());
    }

    function test_multipleMarkets() public {
        factory.createMarket("Q1", block.timestamp + 30 days);
        factory.createMarket("Q2", block.timestamp + 60 days);
        factory.createMarket("Q3", block.timestamp + 90 days);

        assertEq(factory.getMarketCount(), 3);

        address[] memory markets = factory.getMarkets();
        assertEq(markets.length, 3);
    }

    function test_marketCreatedEvent() public {
        vm.expectEmit(false, false, false, true);
        emit MarketCreated(address(0), "Test?", address(this));
        factory.createMarket("Test?", block.timestamp + 1 days);
    }

    function test_marketOwnership() public {
        address marketAddr = factory.createMarket("Q?", block.timestamp + 1 days);
        BinaryMarket market = BinaryMarket(payable(marketAddr));
        assertEq(market.owner(), address(this));
    }

    function test_collateralToken() public view {
        assertEq(factory.collateralToken(), address(usdc));
    }

    function test_revertWithoutApproval() public {
        // Deploy from a user with no approval
        address user = address(0xBEEF);
        usdc.transfer(user, 100 * 1e6);
        vm.startPrank(user);
        vm.expectRevert();
        factory.createMarket("No approval", block.timestamp + 1 days);
        vm.stopPrank();
    }

    // ── Pause mechanism ──────────────────────────────────────────────

    function test_ownerCanPause() public {
        factory.pause();
        assertTrue(factory.paused());
    }

    function test_createMarketRevertsWhenPaused() public {
        factory.pause();
        vm.expectRevert("Paused");
        factory.createMarket("Paused market?", block.timestamp + 1 days);
    }

    function test_ownerCanUnpause() public {
        factory.pause();
        assertTrue(factory.paused());
        factory.unpause();
        assertFalse(factory.paused());
    }

    function test_createMarketWorksAfterUnpause() public {
        factory.pause();
        factory.unpause();
        address market = factory.createMarket("After unpause?", block.timestamp + 1 days);
        assertFalse(market == address(0));
        assertEq(factory.getMarketCount(), 1);
    }

    function test_nonOwnerCannotPause() public {
        vm.prank(address(0xBEEF));
        vm.expectRevert("Not owner");
        factory.pause();
    }

    function test_nonOwnerCannotUnpause() public {
        factory.pause();
        vm.prank(address(0xBEEF));
        vm.expectRevert("Not owner");
        factory.unpause();
    }

    // ── T08: Pause/Unpause events ──────────────────────────────────

    event Paused(address indexed account);
    event Unpaused(address indexed account);

    function test_pauseEvent() public {
        vm.expectEmit(true, false, false, true);
        emit Paused(address(this));
        factory.pause();
    }

    function test_unpauseEvent() public {
        factory.pause();
        vm.expectEmit(true, false, false, true);
        emit Unpaused(address(this));
        factory.unpause();
    }

    // ── T01: Trusted Creator ─────────────────────────────────────────

    function test_setTrustedCreator() public {
        factory.setTrustedCreator(address(0xA11CE), true);
        assertTrue(factory.trustedCreators(address(0xA11CE)));
        factory.setTrustedCreator(address(0xA11CE), false);
        assertFalse(factory.trustedCreators(address(0xA11CE)));
    }

    function test_officialMarketFromTrusted() public {
        address creator = address(0xA11CE);
        factory.setTrustedCreator(creator, true);
        usdc.mint(creator, 100 * 1e6);
        vm.startPrank(creator);
        usdc.approve(address(factory), type(uint256).max);
        address mkt = factory.createMarket("Trusted?", block.timestamp + 30 days);
        vm.stopPrank();
        assertTrue(factory.isOfficialMarket(mkt));
    }

    function test_nonOfficialMarketFromUntrusted() public {
        address mkt = factory.createMarket("Untrusted?", block.timestamp + 30 days);
        assertFalse(factory.isOfficialMarket(mkt));
    }

    function test_setTrustedCreatorOnlyOwner() public {
        vm.prank(address(0xBEEF));
        vm.expectRevert("Not owner");
        factory.setTrustedCreator(address(0xA11CE), true);
    }

    // ── T03: transferOwnership ────────────────────────────────────────

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function test_transferOwnership() public {
        address newOwner = address(0xBEEF);
        factory.transferOwnership(newOwner);
        assertEq(factory.owner(), newOwner);
    }

    function test_transferOwnershipOnlyOwner() public {
        vm.prank(address(0xBEEF));
        vm.expectRevert("Not owner");
        factory.transferOwnership(address(0xDEAD));
    }

    function test_transferOwnershipZeroAddress() public {
        vm.expectRevert("Zero address");
        factory.transferOwnership(address(0));
    }

    function test_oldOwnerLosesAccess() public {
        address newOwner = address(0xBEEF);
        factory.transferOwnership(newOwner);
        vm.expectRevert("Not owner");
        factory.pause();
    }

    function test_newOwnerHasAccess() public {
        address newOwner = address(0xBEEF);
        factory.transferOwnership(newOwner);
        vm.prank(newOwner);
        factory.pause();
        assertTrue(factory.paused());
    }

    function test_ownershipTransferredEvent() public {
        address newOwner = address(0xBEEF);
        vm.expectEmit(true, true, false, true);
        emit OwnershipTransferred(address(this), newOwner);
        factory.transferOwnership(newOwner);
    }

    function test_isOfficialMarket() public {
        // Untrusted case
        address mkt1 = factory.createMarket("Q1?", block.timestamp + 30 days);
        assertFalse(factory.isOfficialMarket(mkt1));

        // Trusted case
        address creator = address(0xA11CE);
        factory.setTrustedCreator(creator, true);
        usdc.mint(creator, 100 * 1e6);
        vm.startPrank(creator);
        usdc.approve(address(factory), type(uint256).max);
        address mkt2 = factory.createMarket("Q2?", block.timestamp + 30 days);
        vm.stopPrank();
        assertTrue(factory.isOfficialMarket(mkt2));
    }
}
