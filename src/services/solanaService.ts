import { Connection, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import 'dotenv/config';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');


export const getWallet = () => {
  const secretKeyString = process.env.SOLANA_PRIVATE_KEY;
  if (!secretKeyString) throw new Error("Missing SOLANA_PRIVATE_KEY in .env");

  return Keypair.fromSecretKey(bs58.decode(secretKeyString));
};

export const getBalance = async (publicKey: string) => {
  const balance = await connection.getBalance(new (global as any).PublicKey(publicKey));
  return balance / 1e9; 
};

export { connection };