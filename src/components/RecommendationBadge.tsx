import type { Recommendation } from "../types";

const LABELS: Record<Recommendation, string> = {
  Buy: "Advised · Buy",
  Watch: "Watchlist",
  Avoid: "Avoid",
};

export function RecommendationBadge({ value }: { value: Recommendation }) {
  return (
    <span className={`rec-badge rec-${value.toLowerCase()}`}>
      <span className="rec-dot" aria-hidden="true" />
      {LABELS[value]}
    </span>
  );
}
