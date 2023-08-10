const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;

async function deploy() {
  const nftContractFactory = await ethers.getContractFactory("MyToken");
  const nftContract = await nftContractFactory.deploy();
  const nftAddress = await nftContract.getAddress();

  const AuctionContractFactory = await ethers.getContractFactory("AuctionNFT");
  //minimumBit = 0.001 ETH
  //auctionDuration = 30 seg
  const AuctionContract = await AuctionContractFactory.deploy(nftAddress, 1000000000000000, 30);
  const AuctionAddress = await AuctionContract.getAddress();

  console.log(AuctionAddress);

  return {
    nftContract,
    AuctionContract,
    AuctionAddress
  }
}

describe("Deploy", function() {
  it("Should deploy AuctionNFT", async function() {

    const nftContractFactory = await ethers.getContractFactory("MyToken");
    const nftContract = await nftContractFactory.deploy();
    const nftAddress = await nftContract.getAddress();

    const AuctionContractFactory = await ethers.getContractFactory("AuctionNFT");
    //minimumBit = 0.001 ETH
    //auctionDuration = 30 seg
    const AuctionContract = await AuctionContractFactory.deploy(nftAddress, 1000000000000000, 30);
    const AuctionAddress = await AuctionContract.getAddress();

    console.log(AuctionAddress);

  });
});

describe("AuctionNFT", function() {
  it("Start an Auction", async function() {

    const {nftContract, AuctionContract, AuctionAddress} = await deploy();

    console.log(AuctionAddress);

    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    await nftContract.safeMint(minter, "https://raw.githubusercontent.com/Tisi22/json/main/3.json", 1);

    await nftContract.transferFrom(minter, AuctionAddress, 1);

    await expect(AuctionContract.startAuction(1))
      .to.emit(AuctionContract, 'AuctionStarted')
      .withArgs(1)

  });

  it("Start an Auction and place a Bid", async function() {

    const {nftContract, AuctionContract, AuctionAddress} = await deploy();

    console.log(AuctionAddress);

    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    await nftContract.safeMint(minter, "https://raw.githubusercontent.com/Tisi22/json/main/3.json", 1);

    await nftContract.transferFrom(minter, AuctionAddress, 1);

    await AuctionContract.startAuction(1);

    await expect(AuctionContract.placeBid(1, { value: 2000000000000000 }))
      .to.emit(AuctionContract, 'NewBidPlaced')
      .withArgs(1, minter, 2000000000000000)

  });

  it("Start an Auction and place a Bid and close the auction", async function() {

    const {nftContract, AuctionContract, AuctionAddress} = await deploy();

    console.log(AuctionAddress);

    const signers = await ethers.getSigners();
    const minter = signers[0].address;

    await nftContract.safeMint(minter, "https://raw.githubusercontent.com/Tisi22/json/main/3.json", 1);

    await nftContract.transferFrom(minter, AuctionAddress, 1);

    await AuctionContract.startAuction(1);

    await AuctionContract.placeBid(1, { value: 2000000000000000 });

    await AuctionContract.placeBid(1, { value: 3000000000000000 });

    await new Promise(resolve => setTimeout(resolve, 40000));

    await expect(AuctionContract.closeAuction(1))
      .to.emit(AuctionContract, 'AuctionEnded')
      .withArgs(1, minter, 3000000000000000)

  });

  
});