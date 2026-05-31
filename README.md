# DayScope — Day Trading Advisor (demo)

DayScope is a small web app that surfaces short-term, day-trading trade ideas
and — importantly — explains **why** each one is advised. It runs entirely on
simulated test data, so there are no API keys, accounts, or live market feeds
involved.

> **Not financial advice.** This is a research/education demo on mock data. Day
> trading is risky and can lose money quickly. Always do your own due diligence.

## What it shows

- **Advised trades** — a grid of ticker cards, each ranked for short-term
  trading and tagged `Buy`, `Watchlist`, or `Avoid`. Every card shows the
  current price, session change, and a **Robinhood-style intraday trend line**
  (green when up, red when down, with a dashed open baseline).
- **Why it's advised** — select any card and the panel below breaks down the
  thesis, the planned **entry / target / stop** levels with the resulting
  risk:reward, a **safety score**, and the quantitative **signals** behind the
  call (liquidity, volatility, trend structure, relative volume, catalysts).

### How "safety" is framed

The picks are scored for *short-term tradability* rather than long-term value:

- **High liquidity** → tight spreads and clean fills (low slippage).
- **Moderate volatility** → enough range to profit, calm enough to manage risk.
- **Clear trend structure** → fewer whipsaws and stop-outs.
- **No imminent binary catalysts** (e.g. earnings) → lower gap risk.

A name with extreme volatility or a choppy, two-sided tape is flagged `Avoid`.

## Tech

- React 19 + TypeScript + Vite
- Zero charting dependencies — the trend lines are hand-rolled SVG
- All data lives in `src/data/trades.ts` (deterministic mock intraday series)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint     # eslint
```

## Project layout

```
src/
  data/trades.ts          # mock trade ideas + intraday series generator
  components/
    TradeCard.tsx         # advised-trade card (price, change, trend line)
    TrendChart.tsx        # Robinhood-style SVG trend line
    WhyAdvised.tsx        # detail panel: thesis, plan, signals
    SafetyMeter.tsx       # 0–100 safety score bar
    RecommendationBadge.tsx
  types.ts                # shared Trade / Signal types
  App.tsx                 # layout + selection state
```
