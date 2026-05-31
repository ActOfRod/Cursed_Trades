interface SafetyMeterProps {
  score: number;
}

function tier(score: number) {
  if (score >= 80) return { label: "High safety", cls: "safe-high" };
  if (score >= 65) return { label: "Moderate", cls: "safe-mid" };
  return { label: "Elevated risk", cls: "safe-low" };
}

export function SafetyMeter({ score }: SafetyMeterProps) {
  const { label, cls } = tier(score);
  return (
    <div className="safety">
      <div className="safety-head">
        <span className="safety-label">Safety score</span>
        <span className={`safety-value ${cls}`}>{score}</span>
      </div>
      <div className="safety-track" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`Safety score ${score} of 100`}>
        <div className={`safety-fill ${cls}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`safety-tier ${cls}`}>{label}</span>
    </div>
  );
}
