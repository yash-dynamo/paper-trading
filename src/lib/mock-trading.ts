import type { Instrument, OrderResult, Position, TradeMode, TradeSide } from "@/types/trading";

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMarket(): Promise<Instrument[]> {
  await wait(80);

  return [
    { symbol: "BTC-PERP", price: 92048.2 },
    { symbol: "ETH-PERP", price: 3384.6 },
    { symbol: "SOL-PERP", price: 176.14 },
  ];
}

export async function getPositions(mode: TradeMode): Promise<Position[]> {
  await wait();

  const positions: Position[] = [
    {
      id: "paper-btc",
      mode: "paper",
      instrument: "BTC-PERP",
      side: "long",
      size: 0.18,
      leverage: 8,
      entryPrice: 90120,
      markPrice: 92048.2,
      pnl: 347.08,
    },
    {
      id: "real-eth",
      mode: "real",
      instrument: "ETH-PERP",
      side: "short",
      size: 1.5,
      leverage: 5,
      entryPrice: 3421.2,
      markPrice: 3384.6,
      pnl: 54.9,
    },
  ];

  return positions.filter((position) => position.mode === mode);
}

export async function placeOrder(input: {
  mode: TradeMode;
  instrument: string;
  side: TradeSide;
  size: number;
  leverage: number;
}): Promise<OrderResult> {
  await wait(300);

  if (input.mode === "paper") {
    return {
      route: "paper_trades table",
      message: "Open paper position locally. No wallet, no chain, no Hotstuff order.",
    };
  }

  return {
    route: "Hotstuff /exchange",
    message: "Prepare signed order with brokerConfig. Fills can be mirrored later.",
  };
}
