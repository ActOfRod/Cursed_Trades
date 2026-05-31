import { useId } from "react";

interface TrendChartProps {
  series: number[];
  /** When true uses up (green) palette, otherwise down (red). */
  positive: boolean;
  /** Internal SVG coordinate width */
  width?: number;
  /** Internal SVG coordinate height */
  height?: number;
  /** Draw a dashed baseline at the opening price */
  showBaseline?: boolean;
  className?: string;
}

const UP = "#00c805"; // Robinhood green
const DOWN = "#ff5000"; // Robinhood red

/**
 * Lightweight, dependency-free Robinhood-style intraday trend line:
 * a thin stroke with a soft gradient area fill and a dashed open baseline.
 */
export function TrendChart({
  series,
  positive,
  width = 320,
  height = 96,
  showBaseline = true,
  className,
}: TrendChartProps) {
  const gradientId = useId();
  const color = positive ? UP : DOWN;

  const padY = 8;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const stepX = width / (series.length - 1 || 1);
  const toX = (i: number) => i * stepX;
  const toY = (v: number) =>
    padY + (1 - (v - min) / range) * (height - padY * 2);

  const points = series.map((v, i) => [toX(i), toY(v)] as const);
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    `M0,${height} ` +
    points.map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(" ") +
    ` L${width},${height} Z`;

  const open = series[0];
  const baselineY = toY(open);

  const last = points[points.length - 1];

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Intraday trend, ${positive ? "up" : "down"} on the session`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {showBaseline && (
        <line
          x1="0"
          y1={baselineY}
          x2={width}
          y2={baselineY}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
      )}

      <path d={areaPath} fill={`url(#${gradientId})`} />

      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {last && (
        <circle
          cx={last[0]}
          cy={last[1]}
          r="3"
          fill={color}
          stroke="#0b0e11"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}
