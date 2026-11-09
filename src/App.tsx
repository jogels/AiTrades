import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTradingStore } from '@/store/useTradingStore';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { AnalysisTabsPanel } from '@/components/panels/AnalysisTabsPanel';
import { formatExactPrice } from '@/lib/indicators';
import type { TimeframeOption, AssetItem } from '@/types/trading';

export const App: React.FC = () => {
  const {
    activeNav,
    cryptoSubMarket,
    coins,
    futuresCoins,
    stocks,
    selectedCoin,
    timeframe,
    chartEngine,
    activeAnalysisTab,
    candles,
    chartSummary,
    botActive,
    setActiveNav,
    setCryptoSubMarket,
    setSelectedCoin,
    setTimeframe,
    setChartEngine,
    setActiveAnalysisTab,
    setCandles,
    setChartSummary,
    toggleBotActive,
  } = useTradingStore();

  const [activeCoinTab, setActiveCoinTab] = useState<'All' | 'Gainers' | 'Losers'>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showMA20, setShowMA20] = useState<boolean>(true);
  const [showBOLL, setShowBOLL] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'buy' | 'sell' | null>(null);
  const [orderQty, setOrderQty] = useState<string>('0.1');
  const [isTickerMenuOpen, setIsTickerMenuOpen] = useState<boolean>(false);
  const [tickerSearch, setTickerSearch] = useState<string>('');
  const tickerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tickerMenuRef.current && !tickerMenuRef.current.contains(e.target as Node)) {
        setIsTickerMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAsset = (asset: AssetItem) => {
    setSelectedCoin(asset);
    setIsTickerMenuOpen(false);
    setTickerSearch('');
  };

  // Strictly only Crypto (Spot or Future) when activeNav === 'Crypto', and only Saham when activeNav === 'Saham'
  const activeAssets = activeNav === 'Crypto' ? (cryptoSubMarket === 'Future' ? futuresCoins : coins) : stocks;

  const dropdownAssets = useMemo(() => {
    const filtered = activeAssets.filter((item) => {
      if (!tickerSearch.trim()) return true;
      const q = tickerSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q)
      );
    });
    return [...filtered].sort((a, b) =>
      sortOrder === 'desc' ? b.change - a.change : a.change - b.change
    );
  }, [activeAssets, tickerSearch, sortOrder]);

  const filteredAssets = useMemo(() => {
    const base = activeAssets.filter((c) => {
      if (activeCoinTab === 'Gainers') return c.change >= 0;
      if (activeCoinTab === 'Losers') return c.change < 0;
      return true;
    });
    return [...base].sort((a, b) =>
      sortOrder === 'desc' ? b.change - a.change : a.change - b.change
    );
  }, [activeAssets, activeCoinTab, sortOrder]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100">
      {/* LEFT SIDEBAR: Only Crypto & Saham */}
      <aside className="w-64 flex-shrink-0 bg-[#0c111e] border-r border-[#1a233a] flex flex-col justify-between p-4 select-none">
        <div>
          <div className="flex items-center space-x-3 px-2 py-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-bold text-white text-sm">AI</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">AI Trading Bot</h1>
              <span className="text-xs text-brand-textMuted font-mono">React + TW + ECharts</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {(['Crypto', 'Saham'] as const).map((market) => {
              const isActive = activeNav === market;
              return (
                <button
                  key={market}
                  onClick={() => {
                    setActiveNav(market);
                    setIsTickerMenuOpen(false);
                    setTickerSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#151c2e]'
                  }`}
                >
                  <span>{market}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20">
                    {market === 'Crypto' ? coins.length : stocks.length}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div
            onClick={toggleBotActive}
            className="bg-[#121929] border border-[#1e273f] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#2d3a5e] transition"
          >
            <div className="flex items-center space-x-2.5">
              <span className={`block w-2.5 h-2.5 rounded-full ${botActive ? 'bg-brand-green animate-pulse' : 'bg-brand-red'}`} />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Bot Status</span>
                <span className={`text-xs font-semibold ${botActive ? 'text-brand-green' : 'text-brand-red'}`}>
                  {botActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 bg-[#172136] px-2 py-0.5 rounded">{botActive ? 'ON' : 'OFF'}</span>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden bg-[#090d16]">
        {/* Top Action Bar: Only Buy & Sell */}
        <header className="h-16 px-6 border-b border-[#182137] flex items-center justify-between bg-[#0b101c]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setModalMode('buy')}
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-brand-blue hover:bg-brand-blueHover text-white transition shadow-lg shadow-blue-600/25"
            >
              Buy
            </button>
            <button
              onClick={() => setModalMode('sell')}
              className="px-6 py-2 rounded-xl text-sm font-semibold bg-[#172033] hover:bg-[#1f2b45] text-slate-200 border border-[#232f4c] transition"
            >
              Sell
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Chart Engine:</span>
            <button
              onClick={() => setChartEngine('lightweight')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                chartEngine === 'lightweight' ? 'bg-brand-blue text-white' : 'bg-[#151e33] text-slate-400'
              }`}
            >
              TradingView LW
            </button>
            <button
              onClick={() => setChartEngine('echarts')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                chartEngine === 'echarts' ? 'bg-brand-blue text-white' : 'bg-[#151e33] text-slate-400'
              }`}
            >
              Apache ECharts
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-12 gap-6">
            {/* CANDLESTICK CHART PANEL (Col 1-9) */}
            <div className="col-span-12 lg:col-span-9 bg-[#101626] border border-[#1c2740] rounded-2xl p-5 flex flex-col shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1b253d]">
                <div className="flex items-center space-x-4">
                  <div className="relative" ref={tickerMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsTickerMenuOpen((prev) => !prev)}
                      className="flex items-center space-x-2.5 bg-[#162035] hover:bg-[#1c2942] px-3.5 py-2 rounded-xl border border-[#243558] hover:border-brand-blue transition cursor-pointer shadow-sm"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: selectedCoin.color }}
                      >
                        {selectedCoin.id[0]}
                      </div>
                      <span className="font-bold text-white text-base">{selectedCoin.symbol}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-blue/20 text-blue-300 border border-brand-blue/30">
                        {selectedCoin.market}
                      </span>
                      <span className="text-slate-300 text-xs">{isTickerMenuOpen ? '▲' : '▼'}</span>
                    </button>

                    {isTickerMenuOpen && (
                      <div className="absolute left-0 mt-2 w-80 bg-[#0e1526] border border-[#26385e] rounded-2xl shadow-2xl z-50 p-3 space-y-2.5">
                        {activeNav === 'Crypto' && (
                          <div className="grid grid-cols-2 gap-1.5 bg-[#131c31] p-1 rounded-xl border border-[#223152]">
                            {(['Spot', 'Future'] as const).map((sub) => (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => setCryptoSubMarket(sub)}
                                className={`py-1.5 px-2 rounded-lg text-xs font-bold font-mono transition ${
                                  cryptoSubMarket === sub
                                    ? sub === 'Future'
                                      ? 'bg-amber-500 text-slate-950'
                                      : 'bg-brand-blue text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                              >
                                {sub === 'Spot' ? `Spot (${coins.length})` : `Future / Perp (${futuresCoins.length})`}
                              </button>
                            ))}
                          </div>
                        )}
                        <input
                          type="text"
                          value={tickerSearch}
                          onChange={(e) => setTickerSearch(e.target.value)}
                          placeholder={activeNav === 'Crypto' ? 'Cari coin Crypto (BTC, SOL, PEPE)...' : 'Cari Saham (BBCA, BREN, NVDA)...'}
                          autoFocus
                          className="w-full bg-[#151f36] border border-[#253558] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue font-mono"
                        />
                        <div className="flex items-center justify-between px-1 py-1 border-b border-[#1f2d4d]">
                          <span className="text-[11px] font-semibold text-slate-300">
                            Daftar {activeNav} <span className="font-mono text-brand-blue">({dropdownAssets.length})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#152038] hover:bg-[#1c2b4b] border border-[#26385e] text-[11px] font-mono text-slate-200 transition"
                          >
                            <span>{sortOrder === 'desc' ? '% Tertinggi ↓' : '% Terendah ↑'}</span>
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                          {dropdownAssets.map((item) => (
                            <button
                              key={`${item.market}-${item.subMarket || 'Spot'}-${item.id}`}
                              type="button"
                              onClick={() => handleSelectAsset(item)}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition border ${
                                item.id === selectedCoin.id && item.market === selectedCoin.market
                                  ? 'bg-brand-blue/20 border-brand-blue/60 text-white'
                                  : 'bg-[#131c31]/70 border-transparent hover:bg-[#192540]'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                                  style={{ backgroundColor: item.color }}
                                >
                                  {item.id[0]}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white font-mono">{item.symbol}</div>
                                  <div className="text-[10px] text-slate-400">{item.name}</div>
                                </div>
                              </div>
                              <div className="text-right font-mono">
                                <div className="text-xs font-semibold text-white">
                                  {item.symbol.endsWith('.JK') ? 'Rp ' : '$'}{formatExactPrice(item.price)}
                                </div>
                                <div className={`text-[10px] font-bold ${item.change >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                                  {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-2xl font-bold font-mono text-white">
                      {selectedCoin.symbol.endsWith('.JK') ? 'Rp ' : '$'}{formatExactPrice(chartSummary?.close ?? selectedCoin.price)}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        selectedCoin.change >= 0 ? 'text-brand-green bg-brand-green/10' : 'text-brand-red bg-brand-red/10'
                      }`}
                    >
                      {selectedCoin.change >= 0 ? '▲' : '▼'} {Math.abs(selectedCoin.change)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowMA20(!showMA20)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                      showMA20 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-[#151e33] border-[#202c49] text-slate-400'
                    }`}
                  >
                    MA20
                  </button>
                  <button
                    onClick={() => setShowBOLL(!showBOLL)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                      showBOLL ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-[#151e33] border-[#202c49] text-slate-400'
                    }`}
                  >
                    BOLL
                  </button>
                  <div className="flex items-center space-x-1 bg-[#151e33] p-1 rounded-xl border border-[#202c49]">
                    {(['1m', '5m', '15m', '1h', '4h', '1D'] as TimeframeOption[]).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                          timeframe === tf ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 pt-3">
                <CandlestickChart
                  coin={selectedCoin}
                  timeframe={timeframe}
                  chartEngine={chartEngine}
                  showMA20={showMA20}
                  showBOLL={showBOLL}
                  onDataLoaded={(summary, loadedCandles) => {
                    setChartSummary(summary);
                    setCandles(loadedCandles);
                  }}
                />
              </div>
            </div>

            {/* TOP ASSETS PANEL (Col 10-12) */}
            <div className="col-span-12 lg:col-span-3 bg-[#101626] border border-[#1c2740] rounded-2xl p-5 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-base font-bold text-white">
                  🔥 {activeNav === 'Crypto' ? `Crypto (${cryptoSubMarket})` : 'Daftar Saham'}
                </h2>
                <button
                  type="button"
                  onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#152038] hover:bg-[#1c2b4b] border border-[#26385e] text-[11px] font-mono text-slate-200 transition"
                >
                  <span>{sortOrder === 'desc' ? '% Tertinggi ↓' : '% Terendah ↑'}</span>
                </button>
              </div>
              {activeNav === 'Crypto' && (
                <div className="grid grid-cols-2 gap-1.5 bg-[#131c31] p-1 rounded-xl border border-[#223152] mb-2.5">
                  {(['Spot', 'Future'] as const).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setCryptoSubMarket(sub)}
                      className={`py-1 px-2 rounded-lg text-xs font-bold font-mono transition ${
                        cryptoSubMarket === sub
                          ? sub === 'Future'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-brand-blue text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sub === 'Spot' ? `Spot (${coins.length})` : `Future (${futuresCoins.length})`}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-1 border-b border-[#1d2740] pb-2 mb-3">
                {(
                  [
                    { id: 'All', label: `Semua (${activeAssets.length})` },
                    { id: 'Gainers', label: 'Gainers' },
                    { id: 'Losers', label: 'Losers' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCoinTab(tab.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                      activeCoinTab === tab.id ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {filteredAssets.map((coin) => (
                  <div
                    key={coin.id}
                    onClick={() => setSelectedCoin(coin)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                      selectedCoin.id === coin.id
                        ? 'bg-[#18233b] border-brand-blue/50 shadow-md'
                        : 'bg-[#121929] border-[#1d2740] hover:border-[#2a3859]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: coin.color }}
                      >
                        {coin.id[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{coin.id}</div>
                        <div className="text-[10px] text-slate-400">{coin.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold font-mono text-white">
                        {coin.symbol.endsWith('.JK') ? 'Rp ' : '$'}{formatExactPrice(coin.price)}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          coin.change >= 0 ? 'text-brand-green bg-brand-green/15' : 'text-brand-red bg-brand-red/15'
                        }`}
                      >
                        {coin.change >= 0 ? `+${coin.change}%` : `${coin.change}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM PANEL: Fundamental | Smart Money | Perhitungan */}
            <AnalysisTabsPanel
              activeTab={activeAnalysisTab}
              onSelectTab={setActiveAnalysisTab}
              asset={selectedCoin}
              candles={candles}
            />
          </div>
        </div>
      </main>

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121929] border border-[#232f4c] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2840] mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                {modalMode} Order - {selectedCoin.symbol}
              </h3>
              <button onClick={() => setModalMode(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Quantity ({selectedCoin.id})</label>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full bg-[#162137] border border-[#243355] rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>
              <button
                onClick={() => setModalMode(null)}
                className={`w-full py-2.5 rounded-xl font-bold text-white transition ${
                  modalMode === 'buy' ? 'bg-brand-blue hover:bg-blue-600' : 'bg-brand-red hover:bg-red-600'
                }`}
              >
                Confirm {modalMode.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
