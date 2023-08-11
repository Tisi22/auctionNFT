# auctionNFT

## Contracts deployed on Goerli

MyToken.sol: 0x28719ac86Fc6cc271274B1e6B8230D1155C0D131 (Standard ERC721 necessari to deploy and test the AuctionNFT.sol)

AuctionNFT.sol: 0xaf6Ef2508bA80043b7a71D46a104d9e77b1013c7 - https://goerli.etherscan.io/address/0xaf6Ef2508bA80043b7a71D46a104d9e77b1013c7


## Deploy and test local environment

npm install
npx harhat test - to run the test.js

1. **Run the Hardhat Network**:

   First, start up the local Hardhat Network:

   ```bash
   npx hardhat node
   ```

   This will launch the local network and display a list of accounts with some test ETH pre-funded.

2. **Deploy Your Contract**:

   ```bash
   npx hardhat run --network hardhat scripts/deploy.js
   ```

3. **Interact with Your Deployed Contract**:

   Once deployed, you can interact with your contract on the local Hardhat Network using the Hardhat console or by writing and running scripts.

   If you want to use the console:

   ```bash
   npx hardhat console --network hardhat
   ```

   From here, you can invoke contract methods, send transactions, and query the blockchain.


Note: Keep in mind that the Hardhat Network is ephemeral. If you stop and restart it, the blockchain data resets, so you'd need to redeploy your contracts.


## Deploy on Goerli

Note: Rinkeby and Ropsten have been depreciated

To deploy a contract on the Goerli testnet using Hardhat with a public RPC, follow these steps:

1. **Modify the `hardhat.config.js` file**:
    Go to file hardhat.config.js 
    - Uncomment lines 9 to 17
    - Comment lines 4 to 6

    - Replace `"YOUR_PUBLIC_RPC_URL"` with your public RPC URL (e.g., from Infura or Alchemy).
    - Replace `"YOUR_PRIVATE_KEY"` with the private key of the deploying Ethereum account. Ensure you do not share this private key and never commit it directly into source control.

2. **Adding Etherscan**:

    If you want to add etherscan, modify the `hardhat.config.js` following:

   Here's a sample `hardhat.config.js` configuration for the Goerli testnet with wther scan:

   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.19",
     networks: {
       goerli: {
         url: "YOUR_PUBLIC_RPC_URL", // for example, use a service like Alchemy or Infura
         accounts: ["YOUR_PRIVATE_KEY"], // private key (without 0x prefix)
       },
     },
     etherscan: {
       apiKey: "YOUR_ETHERSCAN_API_KEY", // needed for contract verification
     },
   };
   ```

   - Replace `"YOUR_PUBLIC_RPC_URL"` with your public RPC URL (e.g., from Infura or Alchemy).
   - Replace `"YOUR_PRIVATE_KEY"` with the private key of the deploying Ethereum account. Ensure you do not share this private key and never commit it directly into source control.
   - Replace `"YOUR_ETHERSCAN_API_KEY"` with your Etherscan API key (you can get one from Etherscan's website).

3. **Deployment**:

   Run deploy script:

   ```bash
   npx hardhat run --network goerli scripts/deploy.js
   ```

4. **(Optional) Verify on Etherscan**:

   If you also want to verify your contract's source code on Etherscan, you can do it easily with the Hardhat Etherscan plugin:

   ```bash
   npx hardhat verify --network goerli DEPLOYED_CONTRACT_ADDRESS "ConstructorArgument1" "ConstructorArgument2"
   ```

   Replace `DEPLOYED_CONTRACT_ADDRESS` with your contract's deployed address and provide the constructor arguments if any.

Make sure you have enough test ETH in the Goerli account corresponding to the private key you provided. You can request Goerli ETH from various faucets available online.

## Constraints

Security

- Reentrancy attacks: import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
- Overflow and underflow: Compiler 0.8.19 solved this problem




