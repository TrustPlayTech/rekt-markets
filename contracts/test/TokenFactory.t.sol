// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/TokenFactory.sol";
import "./MockERC20.sol";

contract TokenFactoryTest is Test {
    event TokenCreated(address indexed token, string name, string symbol, address indexed creator);
    TokenFactory factory;
    MockERC20 usdc;
    address treasury = address(0xFEE);

    function setUp() public {
        usdc = new MockERC20();
        usdc.mint(address(this), 1_000_000 * 1e6);
        factory = new TokenFactory(address(usdc), treasury);
        // Approve factory to spend creation fees
        usdc.approve(address(factory), type(uint256).max);
    }

    function test_createToken() public {
        address token = factory.createToken("BlizzCoin", "BLIZZ", "https://blizz.io/logo.png");
        assertFalse(token == address(0));
        assertEq(factory.getTokenCount(), 1);
    }

    function test_creationFeeCollected() public {
        uint256 balBefore = usdc.balanceOf(treasury);
        factory.createToken("FeeToken", "FEE", "");
        uint256 balAfter = usdc.balanceOf(treasury);
        assertEq(balAfter - balBefore, factory.TOKEN_CREATION_FEE());
    }

    function test_multipleTokens() public {
        factory.createToken("Token1", "T1", "");
        factory.createToken("Token2", "T2", "");

        assertEq(factory.getTokenCount(), 2);

        address[] memory tokens = factory.getTokens();
        assertEq(tokens.length, 2);
    }

    function test_tokenCreatedEvent() public {
        vm.expectEmit(false, false, false, true);
        emit TokenCreated(address(0), "Test", "TST", address(this));
        factory.createToken("Test", "TST", "img");
    }

    function test_tokenProperties() public {
        address tokenAddr = factory.createToken("MemeKing", "MEME", "https://example.com/meme.png");
        BondingCurveToken token = BondingCurveToken(payable(tokenAddr));

        assertEq(token.name(), "MemeKing");
        assertEq(token.symbol(), "MEME");
        assertEq(token.imageURI(), "https://example.com/meme.png");
        assertEq(token.creator(), address(this));
    }

    function test_collateralToken() public view {
        assertEq(factory.collateralToken(), address(usdc));
    }

    function test_revertWithoutApproval() public {
        address user = address(0xBEEF);
        usdc.transfer(user, 100 * 1e6);
        vm.startPrank(user);
        vm.expectRevert();
        factory.createToken("Nope", "NOPE", "");
        vm.stopPrank();
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
}
