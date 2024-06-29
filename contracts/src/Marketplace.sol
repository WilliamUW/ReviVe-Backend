// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Initilaze entry
// Buy entry
//Statistics

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {VETOracle} from "./VETPriceOracle.sol";

contract Marketplace is Ownable, ReentrancyGuard{
    error InsufficientVET();
    error AlreadyPurchased();
    error ItemDoesntExist();
    error TransactionFailed(bytes data);

    struct Item {
        address seller;
        uint256 price;
        bool bought;
    }

    struct PersonalStats {
        uint256 numberOfItemsSold;
        uint256 numberOfItemsBought;
    }

    mapping(uint => Item) uuidToItem;
    mapping(address => PersonalStats) addressToStats;
    IERC20 betterDAO;
    VETOracle oracle;
    uint256 amountOfTokensPerSale = 100;
    uint256 amountOfTokensPerLising = 10;

    modifier notBought(uint uuid){
        if(uuidToItem[uuid].bought){
            revert AlreadyPurchased();
        }
        _;
    }

    modifier uuidExists(uint256 uuid){
        if(uuidToItem[uuid].seller == address(0)){
            revert ItemDoesntExist();
        }
        _;
    }

    constructor(address _betterDAO, address _vetOracle) Ownable(msg.sender) {
        betterDAO = IERC20(_betterDAO);
        oracle = VETOracle(_vetOracle);
    }

    function distributeBetterToken(address _to, uint256 _amount) internal nonReentrant {
        betterDAO.transfer(_to, _amount);
    }

    function getVETPrice() internal view returns(uint256) {
        return oracle.getPrice();
    }
    
    function initializeEntry(uint256 _uuid, address _seller, uint256 _price) external onlyOwner {
        uuidToItem[_uuid] = Item(_seller, _price, false);
        distributeBetterToken(_seller, amountOfTokensPerLising);
        addressToStats[_seller].numberOfItemsSold += 1;
    }

    function buyToken(uint256 _uuid) external payable notBought(_uuid) uuidExists(_uuid){  
        uint256 priceOfMsgInUSD = (msg.value * getVETPrice())/1e18;

        if(uuidToItem[_uuid].price > priceOfMsgInUSD){
            revert InsufficientVET();
        }

        uint256 marketPlaceCut = (msg.value / 20);


        (bool successMarketPlaceCut, bytes memory data1) =  owner().call{value: marketPlaceCut}("");
        (bool successSellerCut, bytes memory data2) = uuidToItem[_uuid].seller.call{value: (msg.value - marketPlaceCut)}("");

        if(!successMarketPlaceCut){
            revert TransactionFailed(data1);
        }

        if(!successSellerCut){
            revert TransactionFailed(data2);
        }

        uuidToItem[_uuid].bought = true;

        distributeBetterToken(uuidToItem[_uuid].seller, amountOfTokensPerSale);
        distributeBetterToken(msg.sender, amountOfTokensPerSale);

        addressToStats[msg.sender].numberOfItemsBought += 1;
    }

    function getPersonalStats(address _wallet) external view returns(PersonalStats memory){
        return addressToStats[_wallet];
    }

    function getItemByUUID(uint256 _uuid) external view returns(Item memory) {
        return uuidToItem[_uuid];
    }

    function getBetterPerLisitng() external view returns(uint256) {
        return amountOfTokensPerLising;
    }

    function getBetterPerSale() external view returns(uint256) {
        return amountOfTokensPerSale;
    }

}