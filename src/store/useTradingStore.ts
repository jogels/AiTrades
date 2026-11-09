import { create } from 'zustand';
import type {
  AssetItem,
  MarketCategory,
  CryptoSubMarket,
  TimeframeOption,
  ChartEngineType,
  AnalysisTabType,
  OHLCVCandle,
  ChartSummary,
} from '@/types/trading';

export const INITIAL_COINS: AssetItem[] = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC/USDT', price: 67430.25, change: 2.15, isFav: true, color: '#f7931a', market: 'Crypto', subMarket: 'Spot' },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH/USDT', price: 3420.17, change: 1.72, isFav: true, color: '#627eea', market: 'Crypto', subMarket: 'Spot' },
  { id: 'SOL', name: 'Solana', symbol: 'SOL/USDT', price: 148.32, change: -0.85, isFav: true, color: '#14f195', market: 'Crypto', subMarket: 'Spot' },
  { id: 'BNB', name: 'BNB', symbol: 'BNB/USDT', price: 602.21, change: 0.64, isFav: true, color: '#f3ba2f', market: 'Crypto', subMarket: 'Spot' },
  { id: 'XRP', name: 'XRP', symbol: 'XRP/USDT', price: 0.5421, change: -0.12, isFav: true, color: '#38bdf8', market: 'Crypto', subMarket: 'Spot' },
  { id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE/USDT', price: 0.1927, change: 4.20, isFav: true, color: '#c2a633', market: 'Crypto', subMarket: 'Spot' },
  { id: 'LINK', name: 'Chainlink', symbol: 'LINK/USDT', price: 14.87, change: 1.57, isFav: true, color: '#375bd2', market: 'Crypto', subMarket: 'Spot' },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA/USDT', price: 0.4512, change: -1.45, isFav: true, color: '#0033ad', market: 'Crypto', subMarket: 'Spot' },
  { id: 'AVAX', name: 'Avalanche', symbol: 'AVAX/USDT', price: 28.94, change: 3.82, isFav: true, color: '#e84142', market: 'Crypto', subMarket: 'Spot' },
  { id: 'SUI', name: 'Sui Network', symbol: 'SUI/USDT', price: 2.18, change: 8.45, isFav: true, color: '#38bdf8', market: 'Crypto', subMarket: 'Spot' },
  { id: 'PEPE', name: 'Pepe', symbol: 'PEPE/USDT', price: 0.0000102, change: 6.75, isFav: true, color: '#00d084', market: 'Crypto', subMarket: 'Spot' },
  { id: 'TON', name: 'Toncoin', symbol: 'TON/USDT', price: 5.12, change: 1.95, isFav: true, color: '#0088cc', market: 'Crypto', subMarket: 'Spot' },
  { id: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB/USDT', price: 0.0000184, change: 2.84, isFav: true, color: '#f59e0b', market: 'Crypto', subMarket: 'Spot' },
  { id: 'DOT', name: 'Polkadot', symbol: 'DOT/USDT', price: 4.65, change: -0.92, isFav: true, color: '#e6007a', market: 'Crypto', subMarket: 'Spot' },
  { id: 'TRX', name: 'TRON', symbol: 'TRX/USDT', price: 0.1642, change: 0.88, isFav: true, color: '#ef0027', market: 'Crypto', subMarket: 'Spot' },
  { id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR/USDT', price: 4.92, change: 5.14, isFav: true, color: '#10b981', market: 'Crypto', subMarket: 'Spot' },
  { id: 'APT', name: 'Aptos', symbol: 'APT/USDT', price: 10.24, change: 4.62, isFav: true, color: '#14b8a6', market: 'Crypto', subMarket: 'Spot' },
  { id: 'UNI', name: 'Uniswap', symbol: 'UNI/USDT', price: 8.15, change: 1.34, isFav: true, color: '#ff007a', market: 'Crypto', subMarket: 'Spot' },
  { id: 'LTC', name: 'Litecoin', symbol: 'LTC/USDT', price: 71.40, change: 0.45, isFav: true, color: '#345d9d', market: 'Crypto', subMarket: 'Spot' },
  { id: 'ICP', name: 'Internet Computer', symbol: 'ICP/USDT', price: 8.42, change: -1.18, isFav: true, color: '#a855f7', market: 'Crypto', subMarket: 'Spot' },
  { id: 'RENDER', name: 'Render', symbol: 'RENDER/USDT', price: 5.68, change: 7.12, isFav: true, color: '#ef4444', market: 'Crypto', subMarket: 'Spot' },
  { id: 'FET', name: 'Artificial Superintelligence', symbol: 'FET/USDT', price: 1.42, change: 5.88, isFav: true, color: '#6366f1', market: 'Crypto', subMarket: 'Spot' },
  { id: 'ARB', name: 'Arbitrum', symbol: 'ARB/USDT', price: 0.584, change: -2.10, isFav: true, color: '#28a0f0', market: 'Crypto', subMarket: 'Spot' },
  { id: 'OP', name: 'Optimism', symbol: 'OP/USDT', price: 1.72, change: 1.15, isFav: true, color: '#ff0420', market: 'Crypto', subMarket: 'Spot' },
  { id: 'INJ', name: 'Injective', symbol: 'INJ/USDT', price: 21.35, change: 4.05, isFav: true, color: '#00f2fe', market: 'Crypto', subMarket: 'Spot' },
  { id: 'SEI', name: 'Sei', symbol: 'SEI/USDT', price: 0.442, change: 6.20, isFav: true, color: '#991b1b', market: 'Crypto', subMarket: 'Spot' },
  { id: 'TIA', name: 'Celestia', symbol: 'TIA/USDT', price: 5.18, change: -1.65, isFav: true, color: '#7e22ce', market: 'Crypto', subMarket: 'Spot' },
  { id: 'WIF', name: 'dogwifhat', symbol: 'WIF/USDT', price: 2.54, change: 9.10, isFav: true, color: '#d97706', market: 'Crypto', subMarket: 'Spot' },
  { id: 'AAVE', name: 'Aave', symbol: 'AAVE/USDT', price: 154.80, change: 3.28, isFav: true, color: '#b6509e', market: 'Crypto', subMarket: 'Spot' },
  { id: 'ATOM', name: 'Cosmos', symbol: 'ATOM/USDT', price: 4.78, change: -0.55, isFav: true, color: '#2e3148', market: 'Crypto', subMarket: 'Spot' },
  { id: 'FIL', name: 'Filecoin', symbol: 'FIL/USDT', price: 3.85, change: 0.92, isFav: true, color: '#0090ff', market: 'Crypto', subMarket: 'Spot' },
  { id: 'BONK', name: 'Bonk', symbol: 'BONK/USDT', price: 0.0000228, change: 5.42, isFav: true, color: '#f97316', market: 'Crypto', subMarket: 'Spot' },
];

export const INITIAL_FUTURES: AssetItem[] = [
  { id: 'BTC', name: 'Bitcoin Perpetual', symbol: 'BTCUSDT.P', price: 67465.50, change: 2.24, isFav: true, color: '#f7931a', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'ETH', name: 'Ethereum Perpetual', symbol: 'ETHUSDT.P', price: 3422.80, change: 1.80, isFav: true, color: '#627eea', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'SOL', name: 'Solana Perpetual', symbol: 'SOLUSDT.P', price: 148.55, change: -0.78, isFav: true, color: '#14f195', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0125%' },
  { id: '1000PEPE', name: '1000Pepe Perpetual', symbol: '1000PEPEUSDT.P', price: 0.01024, change: 7.15, isFav: true, color: '#00d084', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0210%' },
  { id: '1000SHIB', name: '1000Shiba Perpetual', symbol: '1000SHIBUSDT.P', price: 0.01845, change: 3.12, isFav: true, color: '#f59e0b', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: '1000BONK', name: '1000Bonk Perpetual', symbol: '1000BONKUSDT.P', price: 0.02285, change: 5.84, isFav: true, color: '#f97316', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0185%' },
  { id: '1000FLOKI', name: '1000Floki Perpetual', symbol: '1000FLOKIUSDT.P', price: 0.1452, change: 6.45, isFav: true, color: '#eab308', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0150%' },
  { id: 'WIF', name: 'dogwifhat Perpetual', symbol: 'WIFUSDT.P', price: 2.55, change: 9.40, isFav: true, color: '#d97706', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0245%' },
  { id: 'SUI', name: 'Sui Perpetual', symbol: 'SUIUSDT.P', price: 2.19, change: 8.65, isFav: true, color: '#38bdf8', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0190%' },
  { id: 'POPCAT', name: 'Popcat Perpetual', symbol: 'POPCATUSDT.P', price: 1.42, change: 11.20, isFav: true, color: '#ec4899', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0320%' },
  { id: 'MOODENG', name: 'Moo Deng Perpetual', symbol: 'MOODENGUSDT.P', price: 0.248, change: 14.50, isFav: true, color: '#f43f5e', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0410%' },
  { id: 'NEIRO', name: 'First Neiro Perpetual', symbol: 'NEIROUSDT.P', price: 0.00182, change: 10.40, isFav: true, color: '#f59e0b', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0280%' },
  { id: 'GOAT', name: 'Goatseus Maximus Perp', symbol: 'GOATUSDT.P', price: 0.685, change: 8.90, isFav: true, color: '#8b5cf6', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0220%' },
  { id: 'DOGE', name: 'Dogecoin Perpetual', symbol: 'DOGEUSDT.P', price: 0.1931, change: 4.35, isFav: true, color: '#c2a633', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'BNB', name: 'BNB Perpetual', symbol: 'BNBUSDT.P', price: 602.60, change: 0.70, isFav: true, color: '#f3ba2f', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0050%' },
  { id: 'XRP', name: 'XRP Perpetual', symbol: 'XRPUSDT.P', price: 0.5425, change: -0.10, isFav: true, color: '#38bdf8', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'TON', name: 'Toncoin Perpetual', symbol: 'TONUSDT.P', price: 5.13, change: 2.02, isFav: true, color: '#0088cc', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'BTCDOM', name: 'BTC Dominance Index Perp', symbol: 'BTCDOMUSDT.P', price: 2945.0, change: 1.15, isFav: true, color: '#f7931a', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
  { id: 'DEFI', name: 'DeFi Composite Index Perp', symbol: 'DEFIUSDT.P', price: 642.5, change: 2.40, isFav: true, color: '#6366f1', market: 'Crypto', subMarket: 'Future', fundingRate: '+0.0100%' },
];

export const INITIAL_STOCKS: AssetItem[] = [
  { id: 'BBCA', name: 'Bank Central Asia Tbk', symbol: 'BBCA.JK', price: 10450.00, change: 1.25, isFav: true, color: '#005baa', market: 'Saham' },
  { id: 'BMRI', name: 'Bank Mandiri (Persero) Tbk', symbol: 'BMRI.JK', price: 6950.00, change: 0.72, isFav: true, color: '#ffb81c', market: 'Saham' },
  { id: 'BBRI', name: 'Bank Rakyat Indonesia Tbk', symbol: 'BBRI.JK', price: 4820.00, change: -0.62, isFav: true, color: '#00529c', market: 'Saham' },
  { id: 'BBNI', name: 'Bank Negara Indonesia Tbk', symbol: 'BBNI.JK', price: 5350.00, change: 1.42, isFav: true, color: '#006677', market: 'Saham' },
  { id: 'TLKM', name: 'Telkom Indonesia Tbk', symbol: 'TLKM.JK', price: 2980.00, change: 0.68, isFav: true, color: '#e11d48', market: 'Saham' },
  { id: 'ASII', name: 'Astra International Tbk', symbol: 'ASII.JK', price: 5125.00, change: 1.98, isFav: true, color: '#1d4ed8', market: 'Saham' },
  { id: 'BREN', name: 'Barito Renewables Energy Tbk', symbol: 'BREN.JK', price: 7450.00, change: 5.65, isFav: true, color: '#10b981', market: 'Saham' },
  { id: 'AMMN', name: 'Amman Mineral Internasional', symbol: 'AMMN.JK', price: 9650.00, change: 3.21, isFav: true, color: '#d97706', market: 'Saham' },
  { id: 'GOTO', name: 'GoTo Gojek Tokopedia Tbk', symbol: 'GOTO.JK', price: 68.00, change: 4.62, isFav: true, color: '#00aa13', market: 'Saham' },
  { id: 'ADRO', name: 'Alamtri Resources Indonesia', symbol: 'ADRO.JK', price: 3780.00, change: 2.72, isFav: true, color: '#059669', market: 'Saham' },
  { id: 'ANTM', name: 'Aneka Tambang Tbk', symbol: 'ANTM.JK', price: 1585.00, change: 2.26, isFav: true, color: '#0d9488', market: 'Saham' },
  { id: 'UNVR', name: 'Unilever Indonesia Tbk', symbol: 'UNVR.JK', price: 2140.00, change: -1.38, isFav: true, color: '#2563eb', market: 'Saham' },
  { id: 'ICBP', name: 'Indofood CBP Sukses Makmur', symbol: 'ICBP.JK', price: 12100.00, change: 0.83, isFav: true, color: '#4f46e5', market: 'Saham' },
  { id: 'INDF', name: 'Indofood Sukses Makmur Tbk', symbol: 'INDF.JK', price: 7450.00, change: 1.02, isFav: true, color: '#4338ca', market: 'Saham' },
  { id: 'MDKA', name: 'Merdeka Copper Gold Tbk', symbol: 'MDKA.JK', price: 2460.00, change: -0.81, isFav: true, color: '#b45309', market: 'Saham' },
  { id: 'PGAS', name: 'Perusahaan Gas Negara Tbk', symbol: 'PGAS.JK', price: 1545.00, change: 1.64, isFav: true, color: '#0284c7', market: 'Saham' },
  { id: 'PTBA', name: 'Bukit Asam Tbk', symbol: 'PTBA.JK', price: 2890.00, change: 1.40, isFav: true, color: '#dc2626', market: 'Saham' },
  { id: 'ITMG', name: 'Indo Tambangraya Megah Tbk', symbol: 'ITMG.JK', price: 26450.00, change: 0.95, isFav: true, color: '#7c3aed', market: 'Saham' },
  { id: 'BRIS', name: 'Bank Syariah Indonesia Tbk', symbol: 'BRIS.JK', price: 2990.00, change: 2.40, isFav: true, color: '#0d9488', market: 'Saham' },
  { id: 'KLBF', name: 'Kalbe Farma Tbk', symbol: 'KLBF.JK', price: 1620.00, change: -0.61, isFav: true, color: '#16a34a', market: 'Saham' },
  { id: 'NVDA', name: 'NVIDIA Corp.', symbol: 'NVDA/USD', price: 138.60, change: 3.45, isFav: true, color: '#76b900', market: 'Saham' },
  { id: 'AAPL', name: 'Apple Inc.', symbol: 'AAPL/USD', price: 228.45, change: 1.12, isFav: true, color: '#555555', market: 'Saham' },
  { id: 'MSFT', name: 'Microsoft Corp.', symbol: 'MSFT/USD', price: 425.10, change: 0.85, isFav: true, color: '#00a4ef', market: 'Saham' },
  { id: 'GOOGL', name: 'Alphabet Inc.', symbol: 'GOOGL/USD', price: 181.20, change: -0.42, isFav: true, color: '#4285f4', market: 'Saham' },
  { id: 'TSLA', name: 'Tesla Inc.', symbol: 'TSLA/USD', price: 254.75, change: 4.18, isFav: true, color: '#cc0000', market: 'Saham' },
  { id: 'AMZN', name: 'Amazon.com Inc.', symbol: 'AMZN/USD', price: 208.90, change: 1.95, isFav: true, color: '#ff9900', market: 'Saham' },
  { id: 'META', name: 'Meta Platforms Inc.', symbol: 'META/USD', price: 589.40, change: 2.64, isFav: true, color: '#0668E1', market: 'Saham' },
  { id: 'AMD', name: 'Advanced Micro Devices', symbol: 'AMD/USD', price: 152.30, change: -1.15, isFav: true, color: '#ed1c24', market: 'Saham' },
  { id: 'NFLX', name: 'Netflix Inc.', symbol: 'NFLX/USD', price: 754.20, change: 3.10, isFav: true, color: '#e50914', market: 'Saham' },
  { id: 'AVGO', name: 'Broadcom Inc.', symbol: 'AVGO/USD', price: 178.90, change: 2.85, isFav: true, color: '#cc092f', market: 'Saham' },
  { id: 'PLTR', name: 'Palantir Technologies', symbol: 'PLTR/USD', price: 54.80, change: 6.40, isFav: true, color: '#3b82f6', market: 'Saham' },
  { id: 'COIN', name: 'Coinbase Global Inc.', symbol: 'COIN/USD', price: 248.50, change: 5.12, isFav: true, color: '#0052ff', market: 'Saham' },
];

interface TradingStoreState {
  activeNav: MarketCategory;
  cryptoSubMarket: CryptoSubMarket;
  coins: AssetItem[];
  futuresCoins: AssetItem[];
  stocks: AssetItem[];
  selectedCoin: AssetItem;
  timeframe: TimeframeOption;
  chartEngine: ChartEngineType;
  activeAnalysisTab: AnalysisTabType;
  candles: OHLCVCandle[];
  chartSummary: ChartSummary | null;
  botActive: boolean;
  setActiveNav: (market: MarketCategory) => void;
  setCryptoSubMarket: (sub: CryptoSubMarket) => void;
  setSelectedCoin: (asset: AssetItem) => void;
  setTimeframe: (tf: TimeframeOption) => void;
  setChartEngine: (engine: ChartEngineType) => void;
  setActiveAnalysisTab: (tab: AnalysisTabType) => void;
  setCandles: (candles: OHLCVCandle[]) => void;
  setChartSummary: (summary: ChartSummary | null) => void;
  toggleBotActive: () => void;
}

export const useTradingStore = create<TradingStoreState>((set, get) => ({
  activeNav: 'Crypto',
  cryptoSubMarket: 'Spot',
  coins: INITIAL_COINS,
  futuresCoins: INITIAL_FUTURES,
  stocks: INITIAL_STOCKS,
  selectedCoin: INITIAL_COINS[0],
  timeframe: '15m',
  chartEngine: 'lightweight',
  activeAnalysisTab: 'Fundamental',
  candles: [],
  chartSummary: null,
  botActive: true,
  setActiveNav: (market) => {
    const state = get();
    const list = market === 'Crypto' ? (state.cryptoSubMarket === 'Future' ? state.futuresCoins : state.coins) : state.stocks;
    set({
      activeNav: market,
      selectedCoin: list[0],
    });
  },
  setCryptoSubMarket: (sub) => {
    const state = get();
    const list = sub === 'Future' ? state.futuresCoins : state.coins;
    const match = list.find((c) => c.id === state.selectedCoin.id) || list[0];
    set({
      cryptoSubMarket: sub,
      selectedCoin: match,
    });
  },
  setSelectedCoin: (asset) => set({ selectedCoin: asset }),
  setTimeframe: (tf) => set({ timeframe: tf }),
  setChartEngine: (engine) => set({ chartEngine: engine }),
  setActiveAnalysisTab: (tab) => set({ activeAnalysisTab: tab }),
  setCandles: (candles) => set({ candles }),
  setChartSummary: (summary) => set({ chartSummary: summary }),
  toggleBotActive: () => set((s) => ({ botActive: !s.botActive })),
}));
