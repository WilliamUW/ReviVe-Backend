// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract VETOracle is Ownable {

    event PriceUpdate(uint256 newPrice);

    uint256 currentPrice;

    constructor() Ownable(msg.sender) {}

    function updatePrice(uint256 _priceInUSD) external onlyOwner {
        currentPrice = _priceInUSD;
    }

    function getPrice() external view returns(uint256){
        return currentPrice;
    }
}