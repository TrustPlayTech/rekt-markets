// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BinaryMarket.sol";
import "../src/OutcomeToken.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/// @dev Minimal mock USDC (6 decimals).
contract MockUSDC {
    string public name = "Mock USDC";
    string public symbol = "USDC";
    uint8  public decimals = 6;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "MockUSDC: insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "MockUSDC: insufficient balance");
        require(allowance[from][msg.sender] >= amount, "MockUSDC: insufficient allowance");
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

/// @dev Harness to expose internal _quoteSellOut for isolated testing.
contract BinaryMarketHarness is BinaryMarket {
    constructor(
        string memory _question,
        uint256 _resolutionTime,
        address _owner,
        address _collateralToken,
        address _treasury,
        address _resolver
    ) BinaryMarket(_question, _resolutionTime, _owner, _collateralToken, _treasury, _resolver) {}

    function exposed_quoteSellOut(uint256 S, uint256 O, uint256 m)
        external pure returns (uint256 usdcOut, uint256 swapIn)
    {
        return _quoteSellOut(S, O, m);
    }
}

contract BinaryMarketSellFixTest is Test {
    BinaryMarket market;
    BinaryMarketHarness harness;
    MockUSDC usdc;
    address owner = address(this);
    address alice = address(0xA11CE);
    address bob   = address(0xB0B);
    address carol = address(0xCA201);
    address treasury = address(0xFEE);

    uint256 constant SEED = 100_000_000; // 100 USDC (6 decimals)

    function setUp() public {
        usdc = new MockUSDC();
        market = new BinaryMarket(
            "Test?", block.timestamp + 30 days, owner,
            address(usdc), treasury, address(0)
        );
        harness = new BinaryMarketHarness(
            "Test?", block.timestamp + 30 days, owner,
            address(usdc), treasury, address(0)
        );

        // Seed market
        usdc.mint(owner, SEED);
        usdc.approve(address(market), SEED);
        market.seed(SEED);

        // Seed harness
        usdc.mint(owner, SEED);
        usdc.approve(address(harness), SEED);
        harness.seed(SEED);
    }

    // ═══════════════════════════════════════════════════════════════
    // 1. Fuzz: same-side round trip never profitable (YES)
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_roundTripYes_neverProfitable(uint256 buyAmt) public {
        buyAmt = bound(buyAmt, 1e4, 100e6); // 0.01 to 100 USDC

        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        market.yesToken().approve(address(market), yesBalance);
        market.sellYes(yesBalance, 0);
        vm.stopPrank();

        uint256 usdcAfter = usdc.balanceOf(alice);
        assertLe(usdcAfter, buyAmt, "Round trip YES must not profit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 2. Fuzz: same-side round trip never profitable (NO)
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_roundTripNo_neverProfitable(uint256 buyAmt) public {
        buyAmt = bound(buyAmt, 1e4, 100e6);

        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyNo(buyAmt, 0);

        uint256 noBalance = market.noToken().balanceOf(alice);
        market.noToken().approve(address(market), noBalance);
        market.sellNo(noBalance, 0);
        vm.stopPrank();

        uint256 usdcAfter = usdc.balanceOf(alice);
        assertLe(usdcAfter, buyAmt, "Round trip NO must not profit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. Fuzz: reserves match balances after buy/sell
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_reservesMatchBalances(uint256 buyAmt) public {
        buyAmt = bound(buyAmt, 1e4, 100e6);

        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        uint256 sellAmt = yesBalance / 2; // sell half
        if (sellAmt > 0) {
            market.yesToken().approve(address(market), sellAmt);
            market.sellYes(sellAmt, 0);
        }
        vm.stopPrank();

        // Reserves should match contract token balances
        uint256 contractYes = market.yesToken().balanceOf(address(market));
        uint256 contractNo  = market.noToken().balanceOf(address(market));
        assertEq(market.yesReserve(), contractYes, "YES reserve mismatch");
        assertEq(market.noReserve(), contractNo, "NO reserve mismatch");
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. Fuzz: collateral/supply invariant
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_collateralInvariant(uint256 buyAmt) public {
        buyAmt = bound(buyAmt, 1e4, 100e6);

        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        market.yesToken().approve(address(market), yesBalance);
        market.sellYes(yesBalance, 0);
        vm.stopPrank();

        // YES and NO total supply should be equal (complete sets)
        uint256 yesSupply = market.yesToken().totalSupply();
        uint256 noSupply  = market.noToken().totalSupply();
        assertEq(yesSupply, noSupply, "Supply mismatch after round trip");

        // Collateral should equal total supply of either token
        uint256 poolBalance = usdc.balanceOf(address(market));
        assertEq(poolBalance, yesSupply, "Collateral != supply");
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. Exact audit exploit regression (100 seed + 100 buy)
    // ═══════════════════════════════════════════════════════════════

    function test_auditExploit_100seed_100buy() public {
        // Fresh market with exact audit params
        MockUSDC usdc2 = new MockUSDC();
        BinaryMarket m = new BinaryMarket(
            "Audit?", block.timestamp + 30 days, owner,
            address(usdc2), treasury, address(0)
        );
        usdc2.mint(owner, 100e6);
        usdc2.approve(address(m), 100e6);
        m.seed(100e6);

        // Alice buys 100 USDC of YES
        usdc2.mint(alice, 100e6);
        vm.startPrank(alice);
        usdc2.approve(address(m), 100e6);
        m.buyYes(100e6, 0);

        uint256 yesBalance = m.yesToken().balanceOf(alice);

        // Now sell all YES back
        m.yesToken().approve(address(m), yesBalance);
        m.sellYes(yesBalance, 0);
        vm.stopPrank();

        uint256 usdcBack = usdc2.balanceOf(alice);
        assertLe(usdcBack, 100e6, "Exploit: got more USDC back than invested");

        // Pool should not be drained
        uint256 pool = usdc2.balanceOf(address(m));
        assertGe(pool, 100e6, "Pool drained below seed");
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. Looped exploit regression
    // ═══════════════════════════════════════════════════════════════

    function test_auditExploit_looped() public {
        MockUSDC usdc2 = new MockUSDC();
        BinaryMarket m = new BinaryMarket(
            "Loop?", block.timestamp + 30 days, owner,
            address(usdc2), treasury, address(0)
        );
        usdc2.mint(owner, 100e6);
        usdc2.approve(address(m), 100e6);
        m.seed(100e6);

        uint256 startBalance = 100e6;
        usdc2.mint(alice, startBalance);

        for (uint256 i = 0; i < 10; i++) {
            uint256 bal = usdc2.balanceOf(alice);
            if (bal < 1e4) break; // min trade
            uint256 tradeAmt = bal > 100e6 ? 100e6 : bal;

            vm.startPrank(alice);
            usdc2.approve(address(m), tradeAmt);
            m.buyYes(tradeAmt, 0);

            uint256 yesAmt = m.yesToken().balanceOf(alice);
            m.yesToken().approve(address(m), yesAmt);
            m.sellYes(yesAmt, 0);
            vm.stopPrank();
        }

        uint256 finalBalance = usdc2.balanceOf(alice);
        assertLe(finalBalance, startBalance, "Looped exploit: profit detected");
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. Fuzz: multi-trader no-arbitrage
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_multiTrader_poolSolvency(uint256 amt1, uint256 amt2) public {
        amt1 = bound(amt1, 1e4, 50e6);
        amt2 = bound(amt2, 1e4, 50e6);

        uint256 totalDeposited = amt1 + amt2;

        // Alice buys YES
        usdc.mint(alice, amt1);
        vm.startPrank(alice);
        usdc.approve(address(market), amt1);
        market.buyYes(amt1, 0);
        vm.stopPrank();

        // Bob buys NO
        usdc.mint(bob, amt2);
        vm.startPrank(bob);
        usdc.approve(address(market), amt2);
        market.buyNo(amt2, 0);
        vm.stopPrank();

        // Alice sells all YES
        vm.startPrank(alice);
        uint256 aliceYes = market.yesToken().balanceOf(alice);
        market.yesToken().approve(address(market), aliceYes);
        market.sellYes(aliceYes, 0);
        vm.stopPrank();

        // Bob sells all NO
        vm.startPrank(bob);
        uint256 bobNo = market.noToken().balanceOf(bob);
        market.noToken().approve(address(market), bobNo);
        market.sellNo(bobNo, 0);
        vm.stopPrank();

        // Total withdrawn should not exceed total deposited (after fees)
        uint256 aliceOut = usdc.balanceOf(alice);
        uint256 bobOut = usdc.balanceOf(bob);
        assertLe(aliceOut + bobOut, totalDeposited, "Total withdrawals exceed deposits");

        // Pool should not be drained below seed
        uint256 poolBal = usdc.balanceOf(address(market));
        assertGe(poolBal, SEED, "Pool drained below seed");

        // Supply invariant
        assertEq(market.yesToken().totalSupply(), market.noToken().totalSupply(), "Supply diverged");
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. Fuzz: quote helper feasibility
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_quoteHelper_feasibility(uint256 S, uint256 O, uint256 m) public view {
        S = bound(S, 1e6, 1000e6);
        O = bound(O, 1e6, 1000e6);
        m = bound(m, 1, S + O); // amount <= total reserves

        (uint256 usdcOut, uint256 swapIn) = harness.exposed_quoteSellOut(S, O, m);
        assertEq(usdcOut + swapIn, m, "decomposition mismatch");
        assertLe(usdcOut, O, "usdcOut exceeds other reserve");
        assertLe(usdcOut, m, "usdcOut exceeds sell amount");
    }

    // ═══════════════════════════════════════════════════════════════
    // 9. Fuzz: quote helper extremes
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_quoteHelper_extremes(uint256 m) public view {
        m = bound(m, 1, 100e6);
        // Symmetric reserves
        (uint256 usdcOut, uint256 swapIn) = harness.exposed_quoteSellOut(100e6, 100e6, m);
        assertEq(usdcOut + swapIn, m, "decomposition mismatch symmetric");
        assertLe(usdcOut, 100e6, "exceeds reserve symmetric");
    }

    // ═══════════════════════════════════════════════════════════════
    // 10. Edge: minimum amount
    // ═══════════════════════════════════════════════════════════════

    function test_edge_minimumAmount() public {
        uint256 buyAmt = 1e4; // 0.01 USDC
        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        if (yesBalance > 0) {
            market.yesToken().approve(address(market), yesBalance);
            market.sellYes(yesBalance, 0);
        }
        vm.stopPrank();

        assertLe(usdc.balanceOf(alice), buyAmt, "Min amount exploit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 11. Edge: max trade amount
    // ═══════════════════════════════════════════════════════════════

    function test_edge_maxTradeAmount() public {
        uint256 buyAmt = 100e6; // 100 USDC max
        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        market.yesToken().approve(address(market), yesBalance);
        market.sellYes(yesBalance, 0);
        vm.stopPrank();

        assertLe(usdc.balanceOf(alice), buyAmt, "Max amount exploit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 12. Edge: price movement preserved
    // ═══════════════════════════════════════════════════════════════

    function test_edge_priceMovement() public {
        uint256 priceBefore = market.getYesPrice();

        usdc.mint(alice, 50e6);
        vm.startPrank(alice);
        usdc.approve(address(market), 50e6);
        market.buyYes(50e6, 0);
        vm.stopPrank();

        uint256 priceAfterBuy = market.getYesPrice();
        assertGt(priceAfterBuy, priceBefore, "Buy should increase price");

        // Sell half back
        vm.startPrank(alice);
        uint256 yesBalance = market.yesToken().balanceOf(alice);
        uint256 halfYes = yesBalance / 2;
        market.yesToken().approve(address(market), halfYes);
        market.sellYes(halfYes, 0);
        vm.stopPrank();

        uint256 priceAfterSell = market.getYesPrice();
        assertLt(priceAfterSell, priceAfterBuy, "Sell should decrease price");
    }

    // ═══════════════════════════════════════════════════════════════
    // 13. Edge: partial sell
    // ═══════════════════════════════════════════════════════════════

    function test_edge_partialSell() public {
        usdc.mint(alice, 50e6);
        vm.startPrank(alice);
        usdc.approve(address(market), 50e6);
        market.buyYes(50e6, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        uint256 quarter = yesBalance / 4;

        // Sell in 4 parts
        uint256 totalUsdcBack;
        for (uint256 i = 0; i < 4; i++) {
            uint256 sellAmt = (i == 3) ? market.yesToken().balanceOf(alice) : quarter;
            if (sellAmt == 0) break;
            market.yesToken().approve(address(market), sellAmt);
            uint256 before = usdc.balanceOf(alice);
            market.sellYes(sellAmt, 0);
            totalUsdcBack += usdc.balanceOf(alice) - before;
        }
        vm.stopPrank();

        assertLe(totalUsdcBack, 50e6, "Partial sell exploit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 14. Edge: alternating buy/sell
    // ═══════════════════════════════════════════════════════════════

    function test_edge_alternatingBuySell() public {
        uint256 startAmt = 20e6;
        usdc.mint(alice, startAmt);

        for (uint256 i = 0; i < 5; i++) {
            uint256 bal = usdc.balanceOf(alice);
            if (bal < 1e4) break;
            uint256 tradeAmt = bal > 100e6 ? 100e6 : bal;

            vm.startPrank(alice);
            usdc.approve(address(market), tradeAmt);
            if (i % 2 == 0) {
                market.buyYes(tradeAmt, 0);
                uint256 yesAmt = market.yesToken().balanceOf(alice);
                market.yesToken().approve(address(market), yesAmt);
                market.sellYes(yesAmt, 0);
            } else {
                market.buyNo(tradeAmt, 0);
                uint256 noAmt = market.noToken().balanceOf(alice);
                market.noToken().approve(address(market), noAmt);
                market.sellNo(noAmt, 0);
            }
            vm.stopPrank();
        }

        assertLe(usdc.balanceOf(alice), startAmt, "Alternating exploit");
    }

    // ═══════════════════════════════════════════════════════════════
    // 15. Supply invariant: YES supply == NO supply always
    // ═══════════════════════════════════════════════════════════════

    function testFuzz_supplyInvariant(uint256 buyAmt, uint256 sellFrac) public {
        buyAmt = bound(buyAmt, 1e4, 100e6);
        sellFrac = bound(sellFrac, 1, 100); // 1-100%

        usdc.mint(alice, buyAmt);
        vm.startPrank(alice);
        usdc.approve(address(market), buyAmt);
        market.buyYes(buyAmt, 0);

        uint256 yesBalance = market.yesToken().balanceOf(alice);
        uint256 sellAmt = (yesBalance * sellFrac) / 100;
        if (sellAmt > 0) {
            market.yesToken().approve(address(market), sellAmt);
            market.sellYes(sellAmt, 0);
        }
        vm.stopPrank();

        assertEq(
            market.yesToken().totalSupply(),
            market.noToken().totalSupply(),
            "YES/NO supply diverged"
        );
    }
}
