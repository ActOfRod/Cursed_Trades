import type { Trade } from "../types";
import { TrendChart } from "./TrendChart";
import { RecommendationBadge } from "./RecommendationBadge";
import { SafetyMeter } from "./SafetyMeter";

function formatPrice(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function riskReward(t: Trade): string {
  if (!t.entry || !t.target || !t.stop) return "—";
  const reward = Math.abs(t.target - t.entry);
  const risk = Math.abs(t.entry - t.stop);
  if (risk === 0) return "—";
  return `1 : ${(reward / risk).toFixed(1)}`;
}

export function WhyAdvised({ trade }: { trade: Trade }) {
  const positive = trade.changePct >= 0;

  return (
    <section className="why" aria-live="polite">
      <div className="why-head">
        <div>
          <div className="why-title">
            <span className="why-ticker">{trade.ticker}</span>
            <RecommendationBadge value={trade.recommendation} />
          </div>
          <p className="why-sub">
            {trade.name} · {trade.sector} · {trade.horizon}
          </p>
        </div>
        <div className="why-price">
          <span className="why-price-value">{formatPrice(trade.price)}</span>
          <span className={`trade-change ${positive ? "up" : "down"}`}>
            {positive ? "▲" : "▼"} {Math.abs(trade.changePct).toFixed(2)}%
          </span>
        </div>
      </div>

      <TrendChart
        className="why-chart"
        series={trade.series}
        positive={positive}
        height={150}
      />

      <div className="why-safety">
        <SafetyMeter score={trade.safetyScore} />
      </div>

      <div className="why-grid">
        <div className="why-thesis">
          <h3>Why this is advised</h3>
          <p>{trade.thesis}</p>

          <div className="plan">
            <div className="plan-cell">
              <span className="plan-label">Entry</span>
              <span className="plan-value">
                {trade.entry ? formatPrice(trade.entry) : "—"}
              </span>
            </div>
            <div className="plan-cell">
              <span className="plan-label">Target</span>
              <span className="plan-value up">
                {trade.target ? formatPrice(trade.target) : "—"}
              </span>
            </div>
            <div className="plan-cell">
              <span className="plan-label">Stop</span>
              <span className="plan-value down">
                {trade.stop ? formatPrice(trade.stop) : "—"}
              </span>
            </div>
            <div className="plan-cell">
              <span className="plan-label">Risk : Reward</span>
              <span className="plan-value">{riskReward(trade)}</span>
            </div>
          </div>
        </div>

        <div className="why-signals">
          <h3>Signals behind the call</h3>
          <ul className="signal-list">
            {trade.signals.map((s) => (
              <li key={s.label} className={`signal signal-${s.status}`}>
                <div className="signal-top">
                  <span className="signal-label">{s.label}</span>
                  <span className="signal-value">{s.value}</span>
                </div>
                <p className="signal-detail">{s.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
