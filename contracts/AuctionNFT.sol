// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AuctionNFT is Ownable, ReentrancyGuard {

    struct Auction {
        address highestBidder;
        uint256 highestBid;
        uint256 endTime;
    }

    //ERC721 smart contract to set up auctions
    IERC721 public nft;

    // in wei
    uint256 public minBidAmount;

    // in seconds
    uint256 public auctionDuration;

    // mapping tokenId and aution struct
    mapping(uint256 => Auction) public auctions;

    event AuctionStarted(uint256 tokenId);
    event NewBidPlaced(uint256 tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 tokenId, address winner, uint256 amount);

    constructor(address _nftAddress, uint256 _minBidAmount, uint256 _auctionDuration) {
        nft = IERC721(_nftAddress);
        minBidAmount = _minBidAmount;
        auctionDuration = _auctionDuration;
    }

    // ----- SET FUNCTIONS -----

    /// @notice Sets a new Auction duration for all the auctions.
    /// @param _auctionDuration Auction duration in seconds (1 hour - 3600).
    function setNewAuctionDuration(uint256 _auctionDuration) public onlyOwner {
        auctionDuration = _auctionDuration;
    }

    /// @notice Sets a new minimum bid amount for all the auctions.
    /// @param _minBidAmount minimum bid amount in wei.
    function setNewMinBidAmount(uint256 _minBidAmount) public onlyOwner {
        minBidAmount = _minBidAmount;
    }

    // ----- END -----

    // ----- AUCTION FUNCTIONS -----

    /// @notice Starts a new auction for a token Id.
    /// @dev Will revert if the owner of the tokenId is not this contract or the auction for the tokenId has already started.
    /// @param tokenId of the NFT to start the auction.
    function startAuction(uint256 tokenId) external onlyOwner {
        require(auctions[tokenId].endTime == 0, "Auction already started");
        require(nft.ownerOf(tokenId) == address(this), "Contract does not have ownership of NFT");

        auctions[tokenId].endTime = block.timestamp + auctionDuration;
        auctions[tokenId].highestBidder = address(0);
        auctions[tokenId].highestBid = 0;

        emit AuctionStarted(tokenId);
    }

    /// @notice Place a bid for a token Id.
    /// @dev Will revert if the auction of the tokenId has not started, if the auction has ended or if the amount that place is lower than the current bid.
    /// @param tokenId of the NFT to bid.
    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.endTime > 0, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.value > auction.highestBid, "Bid amount too low");

        if (auction.highestBidder != address(0)) {
            // Refund the previous highest bidder
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;

        emit NewBidPlaced(tokenId, msg.sender, msg.value);
    }

    /// @notice Sends the NFT to the buyer and the money to the owner of the contract.
    /// @dev Will revert if the auction of the tokenId has not started or if the auction has not ended.
    /// @param tokenId of the NFT to close the auction.
    function closeAuction(uint256 tokenId) external onlyOwner {

        Auction storage auction = auctions[tokenId];

        require(auction.endTime > 0, "Auction not started");
        require(block.timestamp >= auction.endTime, "Auction not yet ended");

        nft.transferFrom(address(this), auction.highestBidder, tokenId);

        uint256 amountToTransfer = auction.highestBid;
        auction.highestBid = 0;  // Reset highest bid to prevent reentrancy
        payable(owner()).transfer(amountToTransfer);

        emit AuctionEnded(tokenId, auction.highestBidder, amountToTransfer);
    }

    // ----- END ----- 

    // Function to receive ETH. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

}
