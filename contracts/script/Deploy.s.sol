// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MarketFactory.sol";
import "../src/TokenFactory.sol";

contract Deploy is Script {
    // Circle's official Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    // Gnosis Safe multisig treasury
    address constant TREASURY = 0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72;

    function run() external {
        vm.startBroadcast();

        // Deploy factories with USDC collateral and treasury
        MarketFactory marketFactory = new MarketFactory(USDC, TREASURY, address(0));
        TokenFactory tokenFactory = new TokenFactory(USDC, TREASURY);

        console.log("MarketFactory:", address(marketFactory));
        console.log("TokenFactory:", address(tokenFactory));

        // Create sample markets (no seeding - requires USDC approval)
        address m1 = marketFactory.createMarket(
            "Will BTC exceed $150k by end of 2026?",
            1767225600 // 2026-01-01
        );
        address m2 = marketFactory.createMarket(
            "Will ETH flip BTC market cap in 2026?",
            1767225600
        );
        address m3 = marketFactory.createMarket(
            "Will Base surpass Solana in TVL?",
            1767225600
        );

        console.log("Market 1:", m1);
        console.log("Market 2:", m2);
        console.log("Market 3:", m3);

        // Create sample meme tokens
        address t1 = tokenFactory.createToken("Blizz Token", "BLIZZ", "https://blizz.io/token.png");
        address t2 = tokenFactory.createToken("Pepe 2.0", "PEPE2", "https://blizz.io/pepe2.png");

        console.log("Token 1 (BLIZZ):", t1);
        console.log("Token 2 (PEPE2):", t2);

        vm.stopBroadcast();
    }
}
