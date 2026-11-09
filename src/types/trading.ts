export type MarketCategory = 'Crypto' | 'Saham';
export type CryptoSubMarket = 'Spot' | 'Future';
export type TimeframeOption = '1m' | '5m' | '15m' | '1h' | '4h' | '1D';
export type ChartEngineType = 'lightweight' | 'echarts';
export type AnalysisTabType = 'Fundamental' | 'Smart Money' | 'Perhitungan';

export interface AssetItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  isFav: boolean;
  color: string;
  market: MarketCategory;
  subMarket?: CryptoSubMarket;
  fundingRate?: string;
}

export interface OHLCVCandle {
  timestamp: number;
  time: string;
  fullDate?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartSummary {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changePct: number;
  ma20: number | null;
  rsi14: number | null;
  source: string;
  isLive: boolean;
  aiAnalysis?: any;
}

export interface SmartMoneyMetrics {
  bankerPct: number;
  hotMoneyPct: number;
  retailPct: number;
  cmf20: number;
  mfi14: number;
  obvSlope: 'Accumulation' | 'Distribution' | 'Neutral';
  phase: 'Strong Institutional Accumulation' | 'Markup / Bullish Flow' | 'Distribution Warning' | 'Retail Driven / Neutral';
  whaleNetflow: string;
}

export interface QuantCalculationMetrics {
  winProbability: number;
  expectedValuePct: number;
  payoffRatio: number;
  halfKellyWeightPct: number;
  clampedMaxWeightPct: number;
  zScore20: number;
  annualizedVolatilityPct: number;
  verdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL';
  tradePlan?: {
    entry: number;
    stopLoss: number;
    takeProfit1: number;
    takeProfit2: number;
  };
  agentSignals: {
    agent: string;
    style: string;
    direction: 'LONG' | 'SHORT' | 'FLAT';
    conviction: number;
    rationale: string;
  }[];
}
