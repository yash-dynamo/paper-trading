export type TradeMode = "paper" | "real";
export type TradeSide = "long" | "short";

export type Instrument = {
  symbol: string;
  price: number;
};

export type Position = {
  id: string;
  mode: TradeMode;
  instrument: string;
  side: TradeSide;
  size: number;
  leverage: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
};

export type OrderResult = {
  route: string;
  message: string;
};
