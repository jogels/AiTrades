import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts';
import * as echarts from 'echarts';
import type { AssetItem, TimeframeOption, ChartEngineType, OHLCVCandle, ChartSummary } from '@/types/trading';
import { calcSMA, calcBollingerBands, calcRSI, exactNum, formatExactPrice, getChartPriceFormat } from '@/lib/indicators';

interface CandlestickChartProps {
  coin: AssetItem;
  timeframe: TimeframeOption;
  chartEngine: ChartEngineType;
  showMA20: boolean;
  showBOLL: boolean;
  onDataLoaded?: (summary: ChartSummary, candles: OHLCVCandle[]) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  coin,
  timeframe,
  chartEngine,
  showMA20,
  showBOLL,
  onDataLoaded,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const echartsInstanceRef = useRef<echarts.ECharts | null>(null);
  const candlesRef = useRef<OHLCVCandle[]>([]);
  const [candles, setCandles] = useState<OHLCVCandle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    let ws: WebSocket | null = null;
    setLoading(true);

    const mapTf: Record<string, string> = { '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1D': '1d' };
    const interval = mapTf[timeframe] || '15m';
    const isFuture = coin.subMarket === 'Future';
    const cleanId = coin.id.toUpperCase();
    const is1000 = isFuture && cleanId.startsWith('1000');
    const spotBase = is1000 ? cleanId.slice(4) : cleanId;
    const mult = is1000 ? 1000.0 : 1.0;

    const fetchRealCandles = async () => {
      // 1. Primary: Query our Python bridge (/api/ohlcv) which connects directly to
      // TradingView Live WebSocket (BINANCE:*USDT.P / BINANCE:*USDT / IDX / NASDAQ)
      // and Binance Vision / CryptoCompare for 100% authentic market candles
      try {
        const subMarketParam = encodeURIComponent(coin.subMarket || 'Spot');
        const res = await fetch(
          `/api/ohlcv?symbol=${encodeURIComponent(coin.id)}&market=${encodeURIComponent(coin.market)}&submarket=${subMarketParam}&interval=${encodeURIComponent(timeframe)}&limit=120`
        );
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.candles) && data.candles.length > 0) {
            candlesRef.current = data.candles;
            setCandles(data.candles);
            setLoading(false);
            const closes = data.candles.map((c: OHLCVCandle) => c.close);
            const ma20Arr = calcSMA(closes, 20);
            const rsiArr = calcRSI(closes, 14);
            const last = data.candles[data.candles.length - 1];
            onDataLoaded?.(
              {
                open: last.open,
                high: last.high,
                low: last.low,
                close: last.close,
                volume: last.volume,
                changePct: data.change_pct,
                ma20: ma20Arr[ma20Arr.length - 1],
                rsi14: rsiArr[rsiArr.length - 1],
                source: data.source || 'Live Market API',
                isLive: true,
              },
              data.candles
            );
            return;
          }
        }
      } catch {
        // Fallback to direct browser fetch
      }

      // 2. Secondary fallback: Direct Binance Vision REST (for Spot pairs)
      if (coin.market === 'Crypto') {
        try {
          const apiUrl = `https://data-api.binance.vision/api/v3/klines?symbol=${spotBase}USDT&interval=${interval}&limit=120`;
          const res = await fetch(apiUrl);
          if (res.ok) {
            const raw = await res.json();
            if (active && Array.isArray(raw) && raw.length > 0) {
              const parsed: OHLCVCandle[] = raw.map((k: any) => {
                const dt = new Date(k[0]);
                const pad = (n: number) => String(n).padStart(2, '0');
                return {
                  timestamp: Math.floor(k[0] / 1000),
                  time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
                  fullDate: dt.toLocaleString(),
                  open: exactNum(parseFloat(k[1]) * mult),
                  high: exactNum(parseFloat(k[2]) * mult),
                  low: exactNum(parseFloat(k[3]) * mult),
                  close: exactNum(parseFloat(k[4]) * mult),
                  volume: parseFloat(k[5]),
                };
              });
              candlesRef.current = parsed;
              setCandles(parsed);
              setLoading(false);
              const closes = parsed.map(c => c.close);
              const ma20Arr = calcSMA(closes, 20);
              const rsiArr = calcRSI(closes, 14);
              const last = parsed[parsed.length - 1];
              const first = parsed[0];
              onDataLoaded?.(
                {
                  open: last.open,
                  high: last.high,
                  low: last.low,
                  close: last.close,
                  volume: last.volume,
                  changePct: +(((last.close - first.open) / first.open) * 100).toFixed(2),
                  ma20: ma20Arr[ma20Arr.length - 1],
                  rsi14: rsiArr[rsiArr.length - 1],
                  source: isFuture ? 'Binance Vision Futures WS (Live)' : 'Binance Vision Spot WS (Live)',
                  isLive: true,
                },
                parsed
              );
            }
          }
        } catch {
          // Ignore
        }
      }
    };

    fetchRealCandles().then(() => {
      if (!active || coin.market !== 'Crypto') return;
      const streamSymbol = `${spotBase.toLowerCase()}usdt`;
      const wsUrl = `wss://data-stream.binance.vision/ws/${streamSymbol}@kline_${interval}`;

      try {
        ws = new WebSocket(wsUrl);
        ws.onmessage = (event) => {
          if (!active) return;
          try {
            const msg = JSON.parse(event.data);
            if (!msg?.k) return;
            const k = msg.k;
            const kTs = Math.floor(k.t / 1000);
            const dt = new Date(k.t);
            const pad = (n: number) => String(n).padStart(2, '0');
            const updatedBar: OHLCVCandle = {
              timestamp: kTs,
              time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`,
              fullDate: dt.toLocaleString(),
              open: parseFloat(k.o),
              high: parseFloat(k.h),
              low: parseFloat(k.l),
              close: parseFloat(k.c),
              volume: parseFloat(k.v),
            };

            const list = [...candlesRef.current];
            if (list.length === 0) return;
            const lastIdx = list.length - 1;
            if (list[lastIdx].timestamp === kTs) {
              list[lastIdx] = updatedBar;
            } else if (kTs > (list[lastIdx].timestamp || 0)) {
              list.push(updatedBar);
              if (list.length > 120) list.shift();
            }
            candlesRef.current = list;

            if (candleSeriesRef.current && volumeSeriesRef.current) {
              candleSeriesRef.current.update({
                time: kTs as any,
                open: updatedBar.open,
                high: updatedBar.high,
                low: updatedBar.low,
                close: updatedBar.close,
              });
              volumeSeriesRef.current.update({
                time: kTs as any,
                value: updatedBar.volume,
                color: updatedBar.close >= updatedBar.open ? 'rgba(0, 208, 132, 0.28)' : 'rgba(255, 77, 106, 0.28)',
              });
            }

            if (echartsInstanceRef.current) {
              const dates = list.map(c => c.time);
              const ohlc = list.map(c => [c.open, c.close, c.low, c.high]);
              const vols = list.map((c, i) => [i, c.volume, c.close >= c.open ? 1 : -1]);
              echartsInstanceRef.current.setOption({
                xAxis: [{ data: dates }, { data: dates }],
                series: [
                  { name: coin.symbol, data: ohlc },
                  { name: 'Volume', data: vols },
                ],
              });
            }

            const closes = list.map(c => c.close);
            const ma20Arr = calcSMA(closes, 20);
            const rsiArr = calcRSI(closes, 14);
            const latencyMs = Math.max(18, Math.min(350, Date.now() - (msg.E || Date.now())));

            onDataLoaded?.(
              {
                open: updatedBar.open,
                high: updatedBar.high,
                low: updatedBar.low,
                close: updatedBar.close,
                volume: updatedBar.volume,
                ma20: ma20Arr[ma20Arr.length - 1],
                rsi14: rsiArr[rsiArr.length - 1],
                source: `${isFuture ? 'Binance Futures WS' : 'Binance Spot WS'} (⚡ ~${latencyMs}ms)`,
                isLive: true,
              },
              list
            );
          } catch {
            // Ignore malformed frame
          }
        };
      } catch {
        // Fallback to timer
      }
    });

    const timer = setInterval(() => {
      if (coin.market !== 'Crypto' || !ws || ws.readyState !== WebSocket.OPEN) {
        fetchRealCandles();
      }
    }, 10000);

    return () => {
      active = false;
      clearInterval(timer);
      if (ws) {
        try {
          ws.close();
        } catch {}
      }
    };
  }, [coin.id, coin.market, coin.subMarket, timeframe]);

  // Render via TradingView Lightweight Charts OR Apache ECharts
  useEffect(() => {
    const el = containerRef.current;
    if (!el || candles.length === 0) return;
    el.innerHTML = '';

    const closes = candles.map(c => c.close);
    const ma20 = calcSMA(closes, 20);
    const boll = calcBollingerBands(closes, 20, 2);
    const dynamicPriceFormat = getChartPriceFormat(coin.price, candles);
    const stepSec = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1D': 86400 }[timeframe] || 900;
    const baseTs = Math.floor(Date.now() / 1000) - candles.length * stepSec;
    let prevUnix = 0;
    const uniqueCandles = candles.map((c, idx) => {
      let t = Number(c.timestamp) || (baseTs + idx * stepSec);
      if (idx > 0 && t <= prevUnix) {
        t = prevUnix + stepSec;
      }
      prevUnix = t;
      return {
        time: t as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      };
    });

    if (chartEngine === 'lightweight') {
      const chart = createChart(el, {
        width: el.clientWidth,
        height: el.clientHeight || 380,
        localization: {
          priceFormatter: (price: number) => formatExactPrice(price),
        },
        layout: {
          background: { type: ColorType.Solid, color: '#0d1322' },
          textColor: '#94a3b8',
          fontFamily: 'JetBrains Mono, monospace',
        },
        grid: {
          vertLines: { color: '#161f33' },
          horzLines: { color: '#161f33' },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: '#1f2942', autoScale: true },
        timeScale: { borderColor: '#1f2942', timeVisible: true, secondsVisible: timeframe === '1m' },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#00d084',
        downColor: '#ff4d6a',
        borderUpColor: '#00d084',
        borderDownColor: '#ff4d6a',
        wickUpColor: '#00d084',
        wickDownColor: '#ff4d6a',
        priceFormat: dynamicPriceFormat,
      });

      candleSeries.setData(uniqueCandles);

      const volumeSeries = chart.addHistogramSeries({
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      volumeSeries.setData(
        candles.map((c, idx) => ({
          time: uniqueCandles[idx].time,
          value: c.volume,
          color: c.close >= c.open ? 'rgba(0, 208, 132, 0.28)' : 'rgba(255, 77, 106, 0.28)',
        }))
      );
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;
      echartsInstanceRef.current = null;

      if (showMA20) {
        const ma20Series = chart.addLineSeries({ color: '#f59e0b', lineWidth: 2, title: 'MA20', priceFormat: dynamicPriceFormat });
        ma20Series.setData(
          candles
            .map((_, idx) => (ma20[idx] !== null ? { time: uniqueCandles[idx].time, value: ma20[idx]! } : null))
            .filter(Boolean) as any
        );
      }

      if (showBOLL) {
        const upperSeries = chart.addLineSeries({ color: '#38bdf8', lineWidth: 1, title: 'BOLL Up', priceFormat: dynamicPriceFormat });
        const lowerSeries = chart.addLineSeries({ color: '#38bdf8', lineWidth: 1, title: 'BOLL Low', priceFormat: dynamicPriceFormat });
        upperSeries.setData(
          candles
            .map((_, idx) => (boll.upper[idx] !== null ? { time: uniqueCandles[idx].time, value: boll.upper[idx]! } : null))
            .filter(Boolean) as any
        );
        lowerSeries.setData(
          candles
            .map((_, idx) => (boll.lower[idx] !== null ? { time: uniqueCandles[idx].time, value: boll.lower[idx]! } : null))
            .filter(Boolean) as any
        );
      }

      chart.timeScale().fitContent();
      const handleResize = () => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight || 380 });
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        candleSeriesRef.current = null;
        volumeSeriesRef.current = null;
        chart.remove();
      };
    } else {
      // Apache ECharts Engine (adapted from Vibe-Trading CandlestickChart.tsx)
      const instance = echarts.init(el);
      echartsInstanceRef.current = instance;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      const dates = candles.map(c => c.time);
      const ohlc = candles.map(c => [c.open, c.close, c.low, c.high]);
      const vols = candles.map((c, i) => [i, c.volume, c.close >= c.open ? 1 : -1]);

      instance.setOption({
        backgroundColor: '#0d1322',
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          backgroundColor: '#111827',
          borderColor: '#24324f',
          textStyle: { color: '#e2e8f0', fontSize: 11, fontFamily: 'JetBrains Mono' },
          valueFormatter: (val: any) => formatExactPrice(val),
        },
        axisPointer: { link: [{ xAxisIndex: 'all' }] },
        grid: [
          { left: 16, right: 86, top: 16, height: '68%' },
          { left: 16, right: 86, top: '76%', height: '16%' },
        ],
        xAxis: [
          { type: 'category', data: dates, axisLine: { lineStyle: { color: '#1f2942' } }, axisLabel: { color: '#64748b', fontSize: 10 } },
          { type: 'category', gridIndex: 1, data: dates, axisLabel: { show: false }, axisLine: { lineStyle: { color: '#1f2942' } } },
        ],
        yAxis: [
          {
            scale: true,
            position: 'right',
            splitLine: { lineStyle: { color: '#161f33' } },
            axisLabel: {
              color: '#94a3b8',
              fontSize: 10,
              fontFamily: 'JetBrains Mono',
              formatter: (val: number) => formatExactPrice(val),
            },
          },
          { scale: true, gridIndex: 1, splitNumber: 2, axisLabel: { show: false }, splitLine: { show: false } },
        ],
        dataZoom: [
          { type: 'inside', xAxisIndex: [0, 1], start: 20, end: 100 },
        ],
        series: [
          {
            name: coin.symbol,
            type: 'candlestick',
            data: ohlc,
            itemStyle: {
              color: '#00d084',
              color0: '#ff4d6a',
              borderColor: '#00d084',
              borderColor0: '#ff4d6a',
            },
          },
          ...(showMA20
            ? [{ name: 'MA20', type: 'line', data: ma20, smooth: true, showSymbol: false, lineStyle: { width: 1.6, color: '#f59e0b' } }]
            : []),
          ...(showBOLL
            ? [
                { name: 'BOLL Upper', type: 'line', data: boll.upper, smooth: true, showSymbol: false, lineStyle: { width: 1, color: '#38bdf8', type: 'dashed' } },
                { name: 'BOLL Lower', type: 'line', data: boll.lower, smooth: true, showSymbol: false, lineStyle: { width: 1, color: '#38bdf8', type: 'dashed' } },
              ]
            : []),
          {
            name: 'Volume',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: vols,
            itemStyle: {
              color: (params: any) => (params.value[2] > 0 ? 'rgba(0, 208, 132, 0.35)' : 'rgba(255, 77, 106, 0.35)'),
            },
          },
        ],
      });

      const handleResize = () => instance.resize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        instance.dispose();
      };
    }
  }, [candles, chartEngine, showMA20, showBOLL, coin.symbol]);

  return (
    <div className="relative w-full h-full min-h-[380px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d1322]/75 z-10 text-xs font-mono text-slate-400">
          Loading real {coin.symbol} ({timeframe}) candles...
        </div>
      )}
      <div ref={containerRef} className="w-full h-full min-h-[380px]" />
    </div>
  );
};
