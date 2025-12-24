import {  Connection, Keypair } from '@solana/web3.js';
export const executeSwap = async (connection: Connection, wallet: Keypair, quote: any) => {
  if (quote.dex === 'RAYDIUM') {
 
   console.log(`[Sim] Executing radiyum swap for pool: ${quote.rawResponse.poolAddress}`);
    

    await new Promise(r => setTimeout(r, 12000));

    const fakeSignature = "SIM_TX_" + Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
    
    return fakeSignature;
    
  } else {
 
    console.log(`[Sim] Executing Meteora swap for pool: ${quote.rawResponse.poolAddress}`);
    

    await new Promise(r => setTimeout(r, 12000));

    const fakeSignature = "SIM_TX_" + Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
    
    return fakeSignature;
  }
};