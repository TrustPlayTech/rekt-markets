// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BondingCurveToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title TokenFactory
/// @notice Factory that deploys BondingCurveToken instances with ERC-20 collateral.
contract TokenFactory {
    using SafeERC20 for IERC20;

    uint256 public constant TOKEN_CREATION_FEE = 10 * 1e6; // 10 USDC
    address public immutable collateralToken;
    address public treasury;
    address public owner;
    bool public paused;
    address[] public tokens;

    event Paused(address indexed account);
    event Unpaused(address indexed account);
    event TokenCreated(address indexed token, string name, string symbol, address indexed creator);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _collateralToken, address _treasury) {
        require(_collateralToken != address(0), "Zero address");
        require(_treasury != address(0), "Zero treasury");
        collateralToken = _collateralToken;
        treasury = _treasury;
        owner = msg.sender;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /// @notice Deploy a new bonding curve meme token.
    function createToken(
        string calldata name,
        string calldata symbol,
        string calldata imageURI
    ) external returns (address) {
        require(!paused, "Paused");
        require(bytes(name).length > 0, "Empty name");
        require(bytes(symbol).length > 0, "Empty symbol");

        // Collect creation fee
        if (TOKEN_CREATION_FEE > 0) {
            IERC20(collateralToken).safeTransferFrom(msg.sender, treasury, TOKEN_CREATION_FEE);
        }

        BondingCurveToken token = new BondingCurveToken(name, symbol, imageURI, msg.sender, collateralToken, treasury);
        tokens.push(address(token));
        emit TokenCreated(address(token), name, symbol, msg.sender);
        return address(token);
    }

    function getTokens() external view returns (address[] memory) {
        return tokens;
    }

    function getTokenCount() external view returns (uint256) {
        return tokens.length;
    }
}
