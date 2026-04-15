// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MarketFactory.sol";
import "../src/UMAMarketResolver.sol";

contract DeployFactory is Script {
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    address constant TREASURY = 0xBeA133eBCa0F66d1eB68fE5485edc419096A5b72;

    // UMA OOV3 on Base Sepolia
    address constant UMA_OOV3 = 0x0F7fC5E6482f096380db6158f978167b57388deE;
    // TestnetERC20 (UMA bond token) on Base Sepolia
    address constant UMA_BOND_TOKEN = 0x7E6d9618Ba8a87421609352d6e711958A97e2512;

    function run() external {
        vm.startBroadcast();

        // Deploy UMA resolver
        UMAMarketResolver resolver = new UMAMarketResolver(UMA_OOV3, UMA_BOND_TOKEN);
        console.log("UMAMarketResolver:", address(resolver));

        // Deploy factory with resolver
        MarketFactory factory = new MarketFactory(USDC, TREASURY, address(resolver));
        console.log("MarketFactory:", address(factory));

        vm.stopBroadcast();
    }
}
