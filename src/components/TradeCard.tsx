import type { Trade } from "../types";
import { TrendChart } from "./TrendChart";
import { RecommendationBadge } from "./RecommendationBadge";

interface TradeCardProps {
  trade: Trade;
  active: boolean;
  onSelect: (ticker: string) => void;
}

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function TradeCard({ trade, active, onSelect }: TradeCardProps) {
  const positive = trade.changePct >= 0;

  return (
    <button
      type="button"
      className={`trade-card ${active ? "is-active" : ""}`}
      onClick={() => onSelect(trade.ticker)}
      aria-pressed={active}
    >
      <header className="trade-card-head">
        <div className="trade-id">
          <span className="trade-ticker">{trade.ticker}</span>
          <span className="trade-name">{trade.name}</span>
        </div>
        <RecommendationBadge value={trade.recommendation} />
      </header>

      <div className="trade-price-row">
        <span className="trade-price">{formatPrice(trade.price)}</span>
        <span className={`trade-change ${positive ? "up" : "down"}`}>
          {positive ? "▲" : "▼"} {Math.abs(trade.changePct).toFixed(2)}%
        </span>
      </div>

      <TrendChart
        className="trade-chart"
        series={trade.series}
        positive={positive}
      />

      <footer className="trade-card-foot">
        <div className="mini-stat">
          <span className="mini-label">Entry</span>
          <span className="mini-value">
            {trade.entry ? formatPrice(trade.entry) : "—"}
          </span>
        </div>
        <div className="mini-stat">
          <span className="mini-label">Target</span>
          <span className="mini-value up">
            {trade.target ? formatPrice(trade.target) : "—"}
          </span>
        </div>
        <div className="mini-stat">
          <span className="mini-label">Stop</span>
          <span className="mini-value down">
            {trade.stop ? formatPrice(trade.stop) : "—"}
          </span>
        </div>
        <div className="mini-stat mini-score">
          <span className="mini-label">Safety</span>
          <span className="mini-value">{trade.safetyScore}</span>
        </div>
      </footer>
    </button>
  );
}
