"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowLeft, ArrowUp, Database, Radio, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getMarket, getPositions, placeOrder } from "@/lib/mock-trading";
import type { Instrument, Position, TradeMode, TradeSide } from "@/types/trading";

export function TradingDesk() {
  const [mode, setMode] = useState<TradeMode>("paper");
  const [instrument, setInstrument] = useState("BTC-PERP");
  const [side, setSide] = useState<TradeSide>("long");
  const [size, setSize] = useState(0.1);
  const [leverage, setLeverage] = useState(5);
  const queryClient = useQueryClient();

  const market = useQuery({ queryKey: ["market"], queryFn: getMarket, refetchInterval: 4000 });
  const positions = useQuery({ queryKey: ["positions", mode], queryFn: () => getPositions(mode) });

  const selectedMarket = useMemo(
    () => market.data?.find((item) => item.symbol === instrument),
    [instrument, market.data],
  );

  const order = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["positions"] }),
  });

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <header className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold">
            <ArrowLeft size={16} /> PaperTrade
          </Link>
          <ModeToggle mode={mode} onChange={setMode} />
          <button className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-bold text-white">
            <Wallet size={16} /> Connect
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[1fr_320px]">
        <section className="grid gap-4">
          <MarketBar
            instruments={market.data ?? []}
            selected={instrument}
            onSelect={setInstrument}
          />
          <PricePanel instrument={instrument} price={selectedMarket?.price ?? 0} />
          <PositionsPanel positions={positions.data ?? []} loading={positions.isLoading} mode={mode} />
          <ComparisonPanel />
        </section>

        <aside className="grid content-start gap-4">
          <OrderTicket
            mode={mode}
            instrument={instrument}
            side={side}
            size={size}
            leverage={leverage}
            pending={order.isPending}
            route={order.data?.route}
            message={order.data?.message}
            onSide={setSide}
            onSize={setSize}
            onLeverage={setLeverage}
            onSubmit={() => order.mutate({ mode, instrument, side, size, leverage })}
          />
          <RoutePanel mode={mode} />
        </aside>
      </div>
    </main>
  );
}

function ModeToggle({ mode, onChange }: { mode: TradeMode; onChange: (mode: TradeMode) => void }) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-black bg-white p-1">
      {(["paper", "real"] as const).map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`h-9 px-4 text-sm font-bold capitalize ${mode === item ? "bg-black text-white" : "text-neutral-600"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function MarketBar({
  instruments,
  selected,
  onSelect,
}: {
  instruments: Instrument[];
  selected: string;
  onSelect: (symbol: string) => void;
}) {
  return (
    <section className="grid gap-2 sm:grid-cols-3">
      {instruments.map((item) => (
        <button
          key={item.symbol}
          onClick={() => onSelect(item.symbol)}
          className={`border border-black p-4 text-left ${selected === item.symbol ? "bg-black text-white" : "bg-white"}`}
        >
          <p className="text-sm font-black">{item.symbol}</p>
          <p className="mt-2 text-xl font-black">{item.price.toLocaleString()}</p>
        </button>
      ))}
    </section>
  );
}

function PricePanel({ instrument, price }: { instrument: string; price: number }) {
  return (
    <section className="border border-black bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Hotstuff mids channel</p>
          <h1 className="mt-2 text-4xl font-black">{instrument}</h1>
        </div>
        <p className="text-3xl font-black">{price.toLocaleString()}</p>
      </div>
      <div className="mt-6 flex h-48 items-end gap-1 border-t border-black/10 pt-5">
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            className="flex-1 bg-black"
            style={{ height: 30 + ((index * 17) % 150) }}
          />
        ))}
      </div>
    </section>
  );
}

function OrderTicket({
  mode,
  instrument,
  side,
  size,
  leverage,
  pending,
  route,
  message,
  onSide,
  onSize,
  onLeverage,
  onSubmit,
}: {
  mode: TradeMode;
  instrument: string;
  side: TradeSide;
  size: number;
  leverage: number;
  pending: boolean;
  route?: string;
  message?: string;
  onSide: (side: TradeSide) => void;
  onSize: (size: number) => void;
  onLeverage: (leverage: number) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="border border-black bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black">Order</h2>
        <span className="text-xs font-bold uppercase text-neutral-500">{mode}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSide("long")}
          className={`h-11 rounded-md text-sm font-black ${side === "long" ? "bg-emerald-600 text-white" : "bg-neutral-100"}`}
        >
          <ArrowUp className="mr-1 inline" size={15} /> Long
        </button>
        <button
          onClick={() => onSide("short")}
          className={`h-11 rounded-md text-sm font-black ${side === "short" ? "bg-red-600 text-white" : "bg-neutral-100"}`}
        >
          <ArrowDown className="mr-1 inline" size={15} /> Short
        </button>
      </div>

      <label className="mt-5 block text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Size</label>
      <input
        value={size}
        min={0.01}
        step={0.01}
        type="number"
        onChange={(event) => onSize(Number(event.target.value))}
        className="mt-2 h-11 w-full border border-black px-3 font-bold outline-none"
      />

      <label className="mt-5 block text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Leverage</label>
      <input
        value={leverage}
        min={1}
        max={25}
        type="range"
        onChange={(event) => onLeverage(Number(event.target.value))}
        className="mt-3 w-full accent-black"
      />
      <p className="mt-2 text-sm font-black">{leverage}x</p>

      <button
        onClick={onSubmit}
        disabled={pending}
        className="mt-6 h-12 w-full rounded-md bg-black text-sm font-black text-white disabled:bg-neutral-400"
      >
        {pending ? "Routing..." : `Open ${side} ${instrument}`}
      </button>

      <div className="mt-4 border border-black/10 bg-neutral-50 p-3 text-sm">
        <p className="font-black">{route ?? (mode === "paper" ? "paper_trades table" : "Hotstuff /exchange")}</p>
        <p className="mt-1 leading-5 text-neutral-600">
          {message ?? (mode === "paper" ? "Store fake trade in DB using live mark price." : "Send signed order with brokerConfig.")}
        </p>
      </div>
    </section>
  );
}

function PositionsPanel({ positions, loading, mode }: { positions: Position[]; loading: boolean; mode: TradeMode }) {
  return (
    <section className="border border-black bg-white">
      <div className="border-b border-black p-4">
        <h2 className="font-black capitalize">{mode} positions</h2>
      </div>
      {loading ? (
        <p className="p-4 text-sm text-neutral-500">Loading positions...</p>
      ) : positions.length === 0 ? (
        <p className="p-4 text-sm text-neutral-500">No open positions in this mode.</p>
      ) : (
        positions.map((position) => (
          <div key={position.id} className="grid grid-cols-5 gap-3 border-t border-black/10 p-4 text-sm">
            <strong>{position.instrument}</strong>
            <span className={position.side === "long" ? "text-emerald-700" : "text-red-700"}>{position.side}</span>
            <span>{position.size}</span>
            <span>{position.leverage}x</span>
            <strong className="text-right">{position.pnl.toFixed(2)}</strong>
          </div>
        ))
      )}
    </section>
  );
}

function ComparisonPanel() {
  return (
    <section className="grid gap-4 border border-black bg-black p-5 text-white sm:grid-cols-3">
      <Metric label="Paper return" value="34.2%" />
      <Metric label="Real return" value="12.4%" />
      <Metric label="Execution gap" value="21.8%" />
    </section>
  );
}

function RoutePanel({ mode }: { mode: TradeMode }) {
  const paperSteps = ["Write paper_trades", "Use Hotstuff mark price", "Calculate P&L locally"];
  const realSteps = ["Wallet signs order", "POST /exchange", "Mirror fills later"];
  const steps = mode === "paper" ? paperSteps : realSteps;

  return (
    <section className="border border-black bg-white p-4">
      <div className="flex items-center gap-2">
        {mode === "paper" ? <Database size={18} /> : <Radio size={18} />}
        <h2 className="font-black">{mode === "paper" ? "Paper engine" : "Real engine"}</h2>
      </div>
      <div className="mt-4 grid gap-2">
        {steps.map((step) => (
          <p key={step} className="border border-black/10 bg-neutral-50 px-3 py-2 text-sm font-semibold">
            {step}
          </p>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
