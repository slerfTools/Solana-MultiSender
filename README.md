# Solana MultiSender Tool

## Introduction
Solana MultiSender is a powerful tool designed to streamline batch transfers of SOL and SPL tokens on the Solana blockchain. Whether you're conducting airdrops, distributing rewards, or sending payments to multiple recipients, this tool simplifies the process by leveraging a CSV-based approach for bulk transactions. With support for both native SOL and SPL tokens, it ensures efficiency and accuracy in handling multiple transfers in a single execution.

## Features
- Supports SOL and SPL token transfers
- Reads recipient data from a CSV file
- Automatically finds or creates associated token accounts
- Uses Solana's `web3.js` and `spl-token` libraries

## Requirements
- Node.js (v16+ recommended)
- Solana CLI (for keypair generation if needed)

## Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/solana-multisender.git
   cd solana-multisender
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure your `config.json` file:
   ```json
   {
     "rpcUrl": "https://api.mainnet-beta.solana.com",
     "privateKey": "your_private_key_base58"
   }
   ```

## Usage
1. Prepare a `recipients.csv` file with the following format:
   ```csv
   address,amount,token
   Gsaf...xyz,0.5,SOL
   A1b2...xyz,10,TokenMintAddress
   ```
   - `address`: Receiver's Solana wallet address
   - `amount`: Amount to send
   - `token`: Either `SOL` or a valid SPL token mint address

2. Run the script:
   ```sh
   node batch_transfer.js
   ```

3. The script will process transactions and log the results.

## License
MIT License

