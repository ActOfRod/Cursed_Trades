import { useMemo, useState } from "react";
import "./App.css";
import { trades } from "./data/trades";
import type { Recommendation } from "./types";
import { TradeCard } from "./components/TradeCard";
import { WhyAdvised } from "./components/WhyAdvised";

const ORDER: Record<Recommendation, number> = { Buy: 0, Watch: 1, Avoid: 2 };

export default function App() {
  const sorted = useMemo(
    () =>
      [...trades].sort(
        (a, b) =>
          ORDER[a.recommendation] - ORDER[b.recommendation] ||
          b.safetyScore - a.safetyScore,
      ),
    [],
  );

  const [selected, setSelected] = useState(sorted[0].ticker);
  const activeTrade =
    sorted.find((t) => t.ticker === selected) ?? sorted[0];

  const counts = useMemo(() => {
    const buy = trades.filter((t) => t.recommendation === "Buy").length;
    const watch = trades.filter((t) => t.recommendation === "Watch").length;
    const avoid = trades.filter((t) => t.recommendation === "Avoid").length;
    const avgSafety = Math.round(
      trades.reduce((s, t) => s + t.safetyScore, 0) / trades.length,
    );
    return { buy, watch, avoid, avgSafety };
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <span className="brand-name">DayScope</span>
            <span className="brand-tag">Short-term trade advisor</span>
          </div>
        </div>
        <div className="market-status">
          <span className="dot-live" aria-hidden="true" />
          Markets open · demo data
        </div>
      </header>

      <main className="container">
        <section className="overview">
          <div>
            <h1>Today&apos;s advised trades</h1>
            <p className="overview-sub">
              Ranked for short-term day trading by liquidity, volatility and
              trend quality. Pick a name to see exactly why it made the list.
            </p>
          </div>
          <div className="overview-stats">
            <div className="ov-stat">
              <span className="ov-value up">{counts.buy}</span>
              <span className="ov-label">Buy</span>
            </div>
            <div className="ov-stat">
              <span className="ov-value">{counts.watch}</span>
              <span className="ov-label">Watch</span>
            </div>
            <div className="ov-stat">
              <span className="ov-value down">{counts.avoid}</span>
              <span className="ov-label">Avoid</span>
            </div>
            <div className="ov-stat">
              <span className="ov-value">{counts.avgSafety}</span>
              <span className="ov-label">Avg safety</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="advised-heading">
          <h2 id="advised-heading" className="section-title">
            Advised trades
          </h2>
          <div className="trade-grid">
            {sorted.map((trade) => (
              <TradeCard
                key={trade.ticker}
                trade={trade}
                active={trade.ticker === selected}
                onSelect={setSelected}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="section-title">
            Why it&apos;s advised
          </h2>
          <WhyAdvised trade={activeTrade} />
        </section>

        <p className="disclaimer">
          <strong>Not financial advice.</strong> DayScope is a research and
          education demo running on simulated data. Markets are risky and day
          trading can lose money quickly — always do your own due diligence and
          manage your risk.
        </p>
      </main>
    </div>
  );
}
