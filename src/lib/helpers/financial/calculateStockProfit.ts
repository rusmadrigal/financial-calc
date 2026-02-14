/**
 * Stock profit/loss: (sell - buy) * shares - buyCommission - sellCommission.
 * Return % = (netProfit / costBasis) * 100.
 */

export interface StockProfitInput {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  buyCommission?: number;
  sellCommission?: number;
}

export interface StockProfitOutput {
  costBasis: number;
  proceeds: number;
  grossProfit: number;
  totalCommission: number;
  netProfit: number;
  returnPercent: number;
}

export function calculateStockProfit(input: StockProfitInput): StockProfitOutput {
  const buy = Math.max(0, input.buyPrice);
  const sell = Math.max(0, input.sellPrice);
  const shares = Math.max(0, Math.round(input.shares));
  const buyComm = Math.max(0, input.buyCommission ?? 0);
  const sellComm = Math.max(0, input.sellCommission ?? 0);

  const costBasis = buy * shares + buyComm;
  const proceeds = sell * shares - sellComm;
  const grossProfit = proceeds - costBasis;
  const totalCommission = buyComm + sellComm;
  const netProfit = grossProfit;

  const returnPercent =
    costBasis > 0 ? (netProfit / costBasis) * 100 : 0;

  return {
    costBasis: Math.round(costBasis * 100) / 100,
    proceeds: Math.round(proceeds * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    returnPercent: Math.round(returnPercent * 100) / 100,
  };
}
