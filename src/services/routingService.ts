
interface TradeRequest {
  orderId:string;
  inputMint: string;
  outputMint: string;
  amount: number;
}

interface QuoteResponse {
  dex: string;
  outAmount: bigint;
  rawResponse: {
    poolAddress: string;
    info: string;
  };
}

const USDC_MINT = "USDC";

export const getBestQuote= async (input: TradeRequest): Promise<QuoteResponse> => {
  
    await new Promise(r => setTimeout(r, 10000));
  const isSell = input.outputMint === USDC_MINT;
  const marketPrice = 200;
  const outDecimals = isSell ? 1e6 : 1e9;
  const inDecimals = isSell ? 1e9 : 1e6;

  const theoreticalOut = isSell
    ? (input.amount / inDecimals) * marketPrice * outDecimals
    : (input.amount / inDecimals) / marketPrice * outDecimals;

  const rayAmount = BigInt(Math.floor(theoreticalOut * (1 - Math.random() * 0.005)));
  const metAmount = BigInt(Math.floor(theoreticalOut * (1 - Math.random() * 0.005)));

  const rayQuote: QuoteResponse = {
    dex: 'RAYDIUM',
    outAmount: rayAmount,
    rawResponse: {
      poolAddress: "58oQChx4yWmvKtmSfP643M9ajqyYzwYxrV75GgWpYbT1",
      info: "Raydium V3 AMM"
    }
  };

  const metQuote: QuoteResponse = {
    dex: 'METEORA',
    outAmount: metAmount,
    rawResponse: {
      poolAddress: "ARwi1S4DaiTG5DX7S4M4ZsrXqpMD1MrTmbu9ue2tpmEq",
      info: "Meteora DLMM"
    }
  };
console.log(`radiyum trades for : ${rayQuote.outAmount} and meteora trades for : ${metQuote.outAmount}`)
  if (rayQuote.outAmount > metQuote.outAmount) {
    console.log(`radiyum is giving better swap`)
    return rayQuote;
  } else {
    console.log(`meteora is giving better swap`)
    return metQuote;
  }
};