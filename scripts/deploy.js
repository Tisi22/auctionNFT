// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const nftContractFactory = await ethers.getContractFactory("MyToken");
  const nftContract = await nftContractFactory.deploy();
  const nftAddress = await nftContract.getAddress();

  const AuctionContractFactory = await ethers.getContractFactory("AuctionNFT");
  //minimumBit = 0.001 ETH
  //auctionDuration = 30 seg
  const AuctionContract = await AuctionContractFactory.deploy(nftAddress, 1000000000000000, 30);

  console.log("AuctionNFT address:", await AuctionContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  