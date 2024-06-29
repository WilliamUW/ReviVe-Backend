// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {LocalToken} from "../src/utils/LocalBetterDAOtoken.sol";
import {VETOracle} from "../src/VETPriceOracle.sol";

contract MarketPlaceTests is Test {
    LocalToken token;
    VETOracle oracle;
    Marketplace market;
    uint256 testUUID = 1;
    address seller = address(1);
    uint256 testPrice = 1;
    uint256 oneVET = 1000000000000000000;

    function setUp() public {
        token = new LocalToken();
        oracle = new VETOracle();
        market = new Marketplace(address(token), address(oracle));
        token.transfer(address(market), 10000);
        oracle.updatePrice(10000000);
    }

    function testInitializeEntry_works() public {
        market.initializeEntry(testUUID, seller, testPrice);

        assertEq(token.balanceOf(seller), market.getBetterPerLisitng());
        Marketplace.Item memory temp = market.getItemByUUID(testUUID);
        assertEq(testPrice, temp.price);
        Marketplace.PersonalStats memory tempStats = market.getPersonalStats(seller);
        assertEq(tempStats.numberOfItemsSold, 1);
    }

    function testBuyToken_works() public {
        testInitializeEntry_works();

        vm.deal(address(2), oneVET);
        vm.prank(address(2));
        market.buyToken{value: oneVET}(testUUID);

        assertEq(seller.balance, oneVET - (oneVET / 20));
        Marketplace.Item memory tempItem = market.getItemByUUID(testUUID);
        assertEq(tempItem.bought, true);
    }

    function testBuyTokens_notEnoughVET() public {
        testInitializeEntry_works();

        vm.deal(address(2), 1);
        vm.prank(address(2));
        vm.expectRevert(Marketplace.InsufficientVET.selector);
        market.buyToken{value: 1}(testUUID);
    }

    function testBuyToken_wrongUUID() public {
        testInitializeEntry_works();

        vm.deal(address(2), oneVET);
        vm.prank(address(2));
        vm.expectRevert(Marketplace.ItemDoesntExist.selector);
        market.buyToken{value: oneVET}(testUUID + 1);
    }

    function testBuyToken_AlreadyBought() public {
        testBuyToken_works();

        vm.deal(address(2), oneVET);
        vm.prank(address(2));
        vm.expectRevert(Marketplace.AlreadyPurchased.selector);
        market.buyToken{value: oneVET}(testUUID);
    }

    fallback() external payable {}

    receive() external payable {}
}