// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {VETOracle} from "../src/VETPriceOracle.sol";

contract OracleTests is Test {
    VETOracle oracle;
    uint256 newPrice = 222111;

    function setUp() public {
        oracle = new VETOracle();
    }

    function testUpdatePrice() public {
        oracle.updatePrice(newPrice);

        assertEq(oracle.getPrice(), newPrice);
    }
}