const fs = require('fs');
const csv = require('csv-parser');
const { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createTransferInstruction, getOrCreateAssociatedTokenAccount } = require('@solana/spl-token');
const { decode } = require('bs58');
const config = require('./config.json');

const connection = new Connection(config.rpcUrl, 'confirmed');
const payer = Keypair.fromSecretKey(decode(config.privateKey));
const recipients = [];

fs.createReadStream('recipients.csv')
  .pipe(csv())
  .on('data', (row) => {
    recipients.push({
      address: row.address.trim(),
      amount: parseFloat(row.amount),
      token: row.token ? row.token.trim() : 'SOL'
    });
  })
  .on('end', async () => {
    console.log(`Loaded ${recipients.length} recipients. Processing transactions...`);
    for (const recipient of recipients) {
      try {
        if (recipient.token === 'SOL') {
          await sendSol(recipient.address, recipient.amount);
        } else {
          await sendSplToken(recipient.address, recipient.amount, recipient.token);
        }
      } catch (error) {
        console.error(`Failed to send to ${recipient.address}:`, error.message);
      }
    }
    console.log('Batch transfer completed.');
  });

async function sendSol(destination, amount) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: new PublicKey(destination),
      lamports: amount * 1e9,
    })
  );
  await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`Sent ${amount} SOL to ${destination}`);
}

async function sendSplToken(destination, amount, tokenMint) {
  const mint = new PublicKey(tokenMint);
  const sourceTokenAccount = await getAssociatedTokenAddress(mint, payer.publicKey);
  const destinationPublicKey = new PublicKey(destination);
  const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    destinationPublicKey
  );
  
  const tx = new Transaction().add(
    createTransferInstruction(
      sourceTokenAccount,
      destinationTokenAccount.address,
      payer.publicKey,
      amount * 1e9
    )
  );
  await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`Sent ${amount} SPL tokens (${tokenMint}) to ${destination}`);
}
