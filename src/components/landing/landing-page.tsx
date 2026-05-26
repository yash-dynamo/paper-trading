import Link from "next/link";
import { ArrowRight } from "lucide-react";

const flow = [
  "Paper trades stay in your DB",
  "Real trades route to Hotstuff",
  "Same UI shows both P&L streams",
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-black">
      <section className="mx-auto grid min-h-screen max-w-6xl content-between px-5 py-5 sm:px-8">
        <nav className="flex items-center justify-between border-b border-black pb-4">
          <Link href="/" className="text-sm font-black">
            PaperTrade x Hotstuff
          </Link>
          <Link
            href="/trade"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-black px-4 text-sm font-bold text-white"
          >
            Launch <ArrowRight size={16} />
          </Link>
        </nav>

        <div className="grid gap-10 py-16 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
              Fake money, real prices
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] sm:text-7xl">
              Practice on Hotstuff prices before trading real money.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
              One lightweight frontend for the whole flow: choose paper or real, place the same order, and compare the
              results side by side.
            </p>
            <Link
              href="/trade"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-black px-6 text-sm font-black text-white"
            >
              Open app <ArrowRight size={17} />
            </Link>
          </div>

          <div className="border border-black bg-white p-5 shadow-[10px_10px_0_#101010]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Frontend checkpoint</p>
            <div className="mt-5 grid gap-3">
              {flow.map((item, index) => (
                <div key={item} className="grid grid-cols-[32px_1fr] items-center gap-3 border border-black/10 p-3">
                  <span className="grid h-8 w-8 place-items-center bg-black text-sm font-black text-white">{index + 1}</span>
                  <p className="text-sm font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-t border-black py-6 text-sm text-neutral-600 sm:grid-cols-3">
          <p>Paper: write positions locally, calculate P&L from mark price.</p>
          <p>Real: sign wallet order, send brokerConfig to Hotstuff.</p>
          <p>Later: mirror fills and build leaderboard from Postgres.</p>
        </div>
      </section>
    </main>
  );
}
