import type { Trade } from "../types";

/**
 * Small seeded PRNG (mulberry32) so the mock intraday series are deterministic.
 * Without this the trend lines would jitter on every render.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a believable intraday price walk.
 *
 * @param start    opening price
 * @param drift    per-step bias (positive trends up over the session)
 * @param vol      volatility as a fraction of price per step
 * @param points   number of samples (≈ one trading session)
 * @param seed     deterministic seed
 */
function generateSeries(
  start: number,
  drift: number,
  vol: number,
  points: number,
  seed: number,
): number[] {
  const rng = mulberry32(seed);
  const out: number[] = [];
  let price = start;
  for (let i = 0; i < points; i++) {
    const shock = (rng() - 0.5) * 2 * vol * price;
    price = Math.max(0.5, price + drift * price + shock);
    out.push(Number(price.toFixed(2)));
  }
  return out;
}

const POINTS = 78; // ~ 6.5h session sampled every 5 minutes

export const trades: Trade[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    series: generateSeries(189.2, 0.0009, 0.0016, POINTS, 11),
    price: 0,
    changePct: 0,
    recommendation: "Buy",
    safetyScore: 88,
    entry: 190.4,
    target: 193.1,
    stop: 188.9,
    horizon: "Intraday · close by EOD",
    thesis:
      "Mega-cap liquidity keeps spreads razor-thin, so slippage on entry and exit is negligible. Price is holding above the rising VWAP with steady relative volume, giving a clean trend-day structure. Tight stop just below VWAP keeps risk contained while the measured move targets the prior session high.",
    signals: [
      {
        label: "Liquidity",
        value: "54.2M avg vol",
        status: "good",
        detail: "Deep order book means easy fills and minimal slippage.",
      },
      {
        label: "Volatility",
        value: "ATR 1.4%",
        status: "good",
        detail: "Enough range to move, calm enough to manage risk.",
      },
      {
        label: "Trend",
        value: "Above rising VWAP",
        status: "good",
        detail: "Buyers in control through the session — trend-day setup.",
      },
      {
        label: "Catalyst",
        value: "No earnings this week",
        status: "good",
        detail: "No binary event risk to gap you out of the position.",
      },
    ],
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    series: generateSeries(421.0, 0.0006, 0.0014, POINTS, 27),
    price: 0,
    changePct: 0,
    recommendation: "Buy",
    safetyScore: 84,
    entry: 423.5,
    target: 428.0,
    stop: 420.6,
    horizon: "Intraday · scalp / swing",
    thesis:
      "Orderly grind higher on above-average volume with shallow pullbacks that get bought. Spread is a penny wide, so the risk:reward of roughly 1:1.6 is realistic to capture. Stop sits beneath the morning consolidation low.",
    signals: [
      {
        label: "Liquidity",
        value: "22.8M avg vol",
        status: "good",
        detail: "Institutional-grade liquidity, tight spreads.",
      },
      {
        label: "Volatility",
        value: "ATR 1.2%",
        status: "good",
        detail: "Low-noise trend, easy to size and manage.",
      },
      {
        label: "Rel. volume",
        value: "1.3x average",
        status: "good",
        detail: "Participation confirms the move is real.",
      },
      {
        label: "Catalyst",
        value: "Sector strength",
        status: "neutral",
        detail: "Riding broad tech bid rather than a stock-specific story.",
      },
    ],
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase",
    sector: "Financials",
    series: generateSeries(198.5, 0.0002, 0.0018, POINTS, 43),
    price: 0,
    changePct: 0,
    recommendation: "Watch",
    safetyScore: 71,
    entry: 199.8,
    target: 202.4,
    stop: 198.2,
    horizon: "Intraday · needs confirmation",
    thesis:
      "Coiling in a tight range just under resistance. Liquidity is excellent, but the stock has not committed to a direction yet. Wait for a volume-backed break of the range high before taking the long; otherwise it is choppy and stop-prone.",
    signals: [
      {
        label: "Liquidity",
        value: "9.6M avg vol",
        status: "good",
        detail: "Plenty deep for clean entries and exits.",
      },
      {
        label: "Structure",
        value: "Range-bound",
        status: "neutral",
        detail: "No trend yet — entries can whipsaw until it breaks.",
      },
      {
        label: "Rel. volume",
        value: "0.8x average",
        status: "neutral",
        detail: "Below-average flow; conviction is light.",
      },
      {
        label: "Catalyst",
        value: "Rate headlines",
        status: "neutral",
        detail: "Macro-sensitive; watch for surprise Fed commentary.",
      },
    ],
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Semiconductors",
    series: generateSeries(118.4, -0.0004, 0.0042, POINTS, 58),
    price: 0,
    changePct: 0,
    recommendation: "Avoid",
    safetyScore: 38,
    entry: 0,
    target: 0,
    stop: 0,
    horizon: "Stand aside today",
    thesis:
      "Liquidity is fine, but realized volatility is extreme and the tape is two-sided with violent reversals. Without a defined level, stops get run on both sides. The expected slippage and whipsaw risk make this a poor short-term setup — sit out until it calms down.",
    signals: [
      {
        label: "Volatility",
        value: "ATR 4.2%",
        status: "bad",
        detail: "Huge swings — stops are easily blown through.",
      },
      {
        label: "Structure",
        value: "Choppy / two-sided",
        status: "bad",
        detail: "No clean trend; reversals punish either direction.",
      },
      {
        label: "Rel. volume",
        value: "2.6x average",
        status: "neutral",
        detail: "Heavy but emotional flow increases gap risk.",
      },
      {
        label: "Catalyst",
        value: "Headline-driven",
        status: "bad",
        detail: "Unpredictable news flow can gap the position instantly.",
      },
    ],
  },
  {
    ticker: "KO",
    name: "Coca-Cola Co.",
    sector: "Consumer Staples",
    series: generateSeries(62.1, 0.0003, 0.0009, POINTS, 71),
    price: 0,
    changePct: 0,
    recommendation: "Watch",
    safetyScore: 76,
    entry: 62.4,
    target: 63.2,
    stop: 61.9,
    horizon: "Intraday · low-vol grind",
    thesis:
      "Textbook low-volatility name drifting higher with the broad market. Very safe to manage, but the daily range is small, so the profit potential per share is modest. Good for a low-stress, smaller-target trade rather than a home run.",
    signals: [
      {
        label: "Volatility",
        value: "ATR 0.9%",
        status: "good",
        detail: "Very calm — low surprise risk, easy to hold.",
      },
      {
        label: "Liquidity",
        value: "14.1M avg vol",
        status: "good",
        detail: "Tight spreads, dependable fills.",
      },
      {
        label: "Range",
        value: "Small daily range",
        status: "neutral",
        detail: "Limited upside per share; keep targets modest.",
      },
      {
        label: "Catalyst",
        value: "None pending",
        status: "good",
        detail: "No events on the calendar to disrupt the drift.",
      },
    ],
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    sector: "Semiconductors",
    series: generateSeries(162.0, 0.0011, 0.0026, POINTS, 89),
    price: 0,
    changePct: 0,
    recommendation: "Buy",
    safetyScore: 79,
    entry: 163.2,
    target: 167.5,
    stop: 161.4,
    horizon: "Intraday · momentum",
    thesis:
      "Strong momentum breakout off the open holding above the opening range high on expanding volume. More volatile than the mega-caps, so position size is smaller, but the trend is clean and the stop is well-defined under the breakout level.",
    signals: [
      {
        label: "Trend",
        value: "Opening-range breakout",
        status: "good",
        detail: "Classic momentum continuation structure.",
      },
      {
        label: "Rel. volume",
        value: "1.9x average",
        status: "good",
        detail: "Volume expansion confirms the breakout.",
      },
      {
        label: "Volatility",
        value: "ATR 2.6%",
        status: "neutral",
        detail: "Punchy — size down to keep dollar risk in check.",
      },
      {
        label: "Liquidity",
        value: "48.0M avg vol",
        status: "good",
        detail: "Highly liquid, fills are clean despite the speed.",
      },
    ],
  },
];

// Derive price + session change from the generated series so they stay consistent.
for (const t of trades) {
  const open = t.series[0];
  const last = t.series[t.series.length - 1];
  t.price = last;
  t.changePct = Number((((last - open) / open) * 100).toFixed(2));
}
