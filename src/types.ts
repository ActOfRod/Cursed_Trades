export type Recommendation = "Buy" | "Watch" | "Avoid";

export type SignalStatus = "good" | "neutral" | "bad";

export interface Signal {
  /** Short human-readable label, e.g. "Liquidity" */
  label: string;
  /** Displayed value, e.g. "42.1M avg vol" */
  value: string;
  /** Drives the colour coding of the signal chip */
  status: SignalStatus;
  /** One-line explanation of why this signal matters for a day trade */
  detail: string;
}

export interface Trade {
  ticker: string;
  name: string;
  sector: string;
  /** Latest price in USD */
  price: number;
  /** Percent change on the session */
  changePct: number;
  /** Intraday price points used to draw the Robinhood-style trend line */
  series: number[];
  recommendation: Recommendation;
  /**
   * 0-100 "safety" score. Higher means a cleaner, more liquid, lower-surprise
   * setup that is more appropriate for short-term day trading.
   */
  safetyScore: number;
  /** Suggested intraday levels */
  entry: number;
  target: number;
  stop: number;
  /** Holding horizon for the idea */
  horizon: string;
  /** Narrative explaining why the trade is advised */
  thesis: string;
  /** The quantitative signals behind the call */
  signals: Signal[];
}
