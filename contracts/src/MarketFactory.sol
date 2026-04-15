// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BinaryMarket.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title MarketFactory
/// @notice Factory that deploys BinaryMarket instances with ERC-20 collateral.
contract MarketFactory {
    using SafeERC20 for IERC20;

    uint256 public constant MARKET_CREATION_FEE = 5 * 1e6; // 5 USDC
    address public immutable collateralToken;
    address public treasury;
    address public resolver; // UMA resolver contract address
    address public owner;
    bool public paused;
    address[] public markets;
    mapping(address => bool) public trustedCreators;
    mapping(address => bool) public officialMarkets;

    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event MarketCreated(address indexed market, string question, address indexed creator);
    event TrustedCreatorUpdated(address indexed creator, bool trusted);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _collateralToken, address _treasury, address _resolver) {
        require(_collateralToken != address(0), "Zero address");
        require(_treasury != address(0), "Zero treasury");
        collateralToken = _collateralToken;
        treasury = _treasury;
        resolver = _resolver; // address(0) if no resolver yet
        owner = msg.sender;
    }

    function setResolver(address _resolver) external onlyOwner {
        resolver = _resolver;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    function setTrustedCreator(address _creator, bool _trusted) external onlyOwner {
        trustedCreators[_creator] = _trusted;
        emit TrustedCreatorUpdated(_creator, _trusted);
    }

    /// @notice Deploy a new prediction market.
    function createMarket(string calldata question, uint256 resolutionTime) external returns (address) {
        require(!paused, "Paused");
        require(bytes(question).length > 0, "Empty question");
        require(resolutionTime > block.timestamp, "Past resolution");

        // Collect creation fee
        if (MARKET_CREATION_FEE > 0) {
            IERC20(collateralToken).safeTransferFrom(msg.sender, treasury, MARKET_CREATION_FEE);
        }

        BinaryMarket market = new BinaryMarket(question, resolutionTime, msg.sender, collateralToken, treasury, resolver);
        markets.push(address(market));
        if (trustedCreators[msg.sender]) {
            officialMarkets[address(market)] = true;
        }
        emit MarketCreated(address(market), question, msg.sender);
        return address(market);
    }

    function isOfficialMarket(address _market) external view returns (bool) {
        return officialMarkets[_market];
    }

    function getMarkets() external view returns (address[] memory) {
        return markets;
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
