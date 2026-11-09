# Master Blueprint & Analisis Proyek: AI Trading & Decision Intelligence (`AiTrades`)

Dokumen ini merupakan **Cetak Biru Utama (Master Blueprint)** sekaligus hasil bedah teknis mendalam terhadap repositori referensi di dalam workspace `AiTrades`. 

Seluruh hasil pembelajaran dari folder-folder proyek di dalam repositori ini (tanpa mengubah isi asli dari masing-masing folder tersebut) diterjemahkan dan disatukan untuk membangun produk utama kita yang berpusat di **[`index.html`](file:///Users/erza/Document/project/AiTrades/index.html)**: sebuah **Robot AI Pengambil Keputusan untuk Crypto & Saham**.

---

# BAGIAN I: VISI UTAMA & ARSITEKTUR INTI (`@index.html`)

## 1. Tujuan Utama Sistem (Core Objective)
Inti dari proyek ini adalah menciptakan **Sistem Intelijen Keputusan Finansial (AI Decision-Support & Execution Engine)** yang menjawab pertanyaan paling krusial bagi trader dan investor:
> **"Koin (Crypto) atau Saham (Stocks) mana yang paling bagus untuk DIBELI (Buy/Long), DIJUAL (Sell/Short), atau DIHINDARI (Hold/Wait) saat ini — berapa probabilitas keberhasilannya, berapa ukuran posisi yang aman, dan apa alasan logis di baliknya?"**

Sistem tidak boleh menebak secara acak atau sekadar mengandalkan satu indikator teknikal, melainkan menggabungkan **6 Pilar Data & Kuantitatif** sebelum mengeluarkan rekomendasi atau mengeksekusi transaksi.

---

## 2. Enam Pilar Analisis Robot AI (Crypto & Saham)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     6 PILAR INPUT DATA & INTELIJEN PASAR                         │
├─────────────────────────┬────────────────────────────┬───────────────────────────┤
│ 1. Fundamental &        │ 2. Smart Money &           │ 3. Data Science &         │
│    Laporan Keuangan     │    Wallet Tracking         │    Data Analysis          │
│ • Saham: P/E, ROE, FCF, │ • Crypto: Whale Wallet,    │ • Feature Engineering     │
│   Margin, Debt/Equity,  │   Exchange Inflow/Outflow, │ • Anomaly Detection       │
│   EPS Growth, 8-K/10-Q  │   DEX Smart Traders,       │ • Cross-Asset Correlation │
│ • Crypto: Tokenomics,   │   Accumulation/Distrib.    │ • Orderbook Liquidity &   │
│   TVL, Protocol Revenue,│ • Saham: Insider Trading,  │   Volume Profile Analysis │
│   Active Addresses,     │   Institutional 13F Flow,  │ • News & Social Sentiment │
│   Unlock Schedule       │   Dark Pool & Block Trades │   NLP Scoring             │
├─────────────────────────┴────────────────────────────┴───────────────────────────┤
│ 4. Perhitungan Matematika, Probabilitas & Statistik                              │
│ • Expected Value (EV): E[R] = (P_win × Gain) - (P_loss × Loss)                   │
│ • Bayesian Probability Updating (Update peluang saat ada data/berita baru)       │
│ • Kelly Criterion (Optimal Position Sizing berdasarkan edge & win probability)   │
│ • Z-Score Mean Reversion, Sharpe/Sortino Ratio, Value at Risk (VaR)              │
│ • Spearman Rank IC (Information Coefficient) untuk menguji akurasi sinyal        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 5. Multi-Agent AI Committee (Dewan Analis AI & Quant Pods)                       │
│ • Agen Value & Fundamental (Gaya Buffett, Graham, Munger, Lynch)                 │
│ • Agen Momentum & Makro Inflection (Gaya Druckenmiller)                          │
│ • Agen On-Chain & Smart Money Tracker (Whale & Institutional Flow)               │
│ • Agen Kuantitatif & Event-Driven (PEAD / Earnings Surprise & Volatility Breakout)│
├──────────────────────────────────────────────────────────────────────────────────┤
│ 6. Master Risk Engine & Eksekusi Deterministik (CRO Gatekeeper)                  │
│ • "LLM Never Touches The Trade": AI memberi skor [-1.0 s/d +1.0], Matematika     │
│   yang menghitung ukuran posisi dolar dan membatasi risiko (Hard Clamps).        │
│ • Batas Posisi Maksimal (Max Position %), Batas Leverage, Stop-Loss/Take-Profit. │
│ • Hash-Chained Decision Ledger: Rekam jejak setiap keputusan & tesis AI.         │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Penjabaran 6 Pilar untuk Screening & Pengambilan Keputusan:

1. **Pilar 1: Data Fundamental & Laporan Keuangan**
   - **Untuk Saham (Stocks):** Membaca laporan keuangan (*Income Statement, Balance Sheet, Cash Flow*) secara *point-in-time*. Mengevaluasi kualitas bisnis melalui *Return on Equity (ROE)*, *Gross/Operating/Net Margin*, tren *Free Cash Flow (FCF)*, rasio utang (*Debt-to-Equity*, *Current Ratio*), pertumbuhan laba (*EPS YoY*, *BVPS CAGR*), dan valuasi (*P/E*, *P/B*, *PEG Ratio*).
   - **Untuk Crypto:** Menganalisis fundamental jaringan & tokenomics: *Total Value Locked (TVL)*, pendapatan protokol (*Protocol Fees/Revenue*), rasio *Market Cap to FDV (Fully Diluted Valuation)*, jadwal *Token Unlock* (potensi tekanan jual), serta aktivitas pengguna aktif harian (*Daily Active Addresses*).

2. **Pilar 2: Tracking Wallet & Smart Money Flow**
   - **Untuk Crypto (On-Chain Intelligence):**
     - **Whale & Smart Wallet Tracking:** Memantau dompet institusi, VC, dan *smart DEX traders* yang memiliki rekam jejak *win-rate* tinggi.
     - **Exchange Netflow:** Mendeteksi apakah koin sedang dikirim masuk ke bursa (*Inflow* = indikasi siap dijual/distribusi) atau ditarik keluar ke *cold wallet* (*Outflow* = indikasi akumulasi jangka panjang).
     - **Orderbook & Derivatives Flow:** Membaca *Funding Rate*, *Open Interest (OI)*, dan likuidasi untuk melihat posisi bandar vs ritel.
   - **Untuk Saham (Institutional & Insider Flow):**
     - Melacak transaksi orang dalam (*Corporate Insider Buying/Selling*), akumulasi institusi besar, dan lonjakan volume tidak wajar (*Unusual Volume / Block Trade Accumulation*).

3. **Pilar 3: Data Science & Data Analysis**
   - **Time-Series & Feature Engineering:** Mengolah data harga dan volume mentah menjadi fitur terstruktur (*rolling volatility*, *volume-weighted momentum*, *intraday move bands* terhadap indeks acuan seperti `SPY` atau `BTC`).
   - **Regime Detection:** Mengklasifikasikan kondisi pasar saat ini (apakah sedang *Trending Bullish*, *Trending Bearish*, *Sideways/Mean-Reverting*, atau *High-Volatility Panic*) sehingga strategi yang dipakai sesuai dengan cuaca pasar.
   - **NLP & Sentiment Analysis:** Mengekstrak sentimen dari *headline* berita terbaru dan pengumuman laporan laba (*Earnings Beat/Miss*) secara terukur.

4. **Pilar 4: Matematika, Probabilitas & Statistik Kuantitatif**
   - Setiap rekomendasi **Beli (Buy)** atau **Jual (Sell)** harus didukung oleh angka probabilitas dan matematika risiko:
     - **Skor Keyakinan & Konsensus ($C \in [-1.0, +1.0]$):** Penggabungan suara tertimbang dari seluruh analis AI dan model kuantitatif.
     - **Probabilitas Menang ($P_{\text{win}}$) & Expected Value ($EV$):**
       $$\text{EV} = (P_{\text{win}} \times \text{Target Upside}) - ((1 - P_{\text{win}}) \times \text{Stop Loss Risk})$$
       Hanya aset dengan $\text{EV} > 0$ dan rasio *Risk-to-Reward* asimetris yang lolos seleksi.
     - **Fractional Kelly Criterion (Ukuran Posisi Optimal):**
       $$f^* = k \times \left( \frac{b \cdot p - q}{b} \right)$$
       Di mana $p$ adalah probabilitas menang, $q = 1-p$, $b$ adalah rasio *payoff* (keuntungan dibagi kerugian), dan $k$ adalah faktor pengaman (misal Half-Kelly $0.5$) yang kemudian dipagari oleh *Hard Risk Clamps*.
     - **Z-Score & Rank Correlation (IC):** Mengukur seberapa jauh harga menyimpang dari nilai rata-rata wajarnya (dalam satuan standar deviasi $\sigma$) dan menguji kualitas prediksi analis menggunakan korelasi peringkat *Spearman* (*Information Coefficient*).

---

# BAGIAN II: BEDAH TEKNIS REPOSITORI REFERENSI

---

# 1. `ai-trading-ai-hedge-fund-main` (`aihf` v2.6.2)

## 1.1. Ringkasan Eksekutif & Konsep Dasar
[`ai-trading-ai-hedge-fund-main`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main) adalah implementasi arsitektur **Hedge Fund Berbasis AI Persisten**. 

Berbeda dari skrip AI trading biasa yang hanya meminta LLM menebak harga lalu langsung membeli, proyek ini memisahkan secara ketat antara **Penilaian Analisis (Otak AI / Quant)** dan **Konstruksi Portofolio & Matematika Risiko (Eksekusi Deterministik)**:

```
 FUND "Alpha One"                   → Modal, Mandat, Always-On
  │
  ├─ CIO (Capital Allocator)        → Mengalokasikan porsi modal ke setiap strategi (Pod)
  │
  ├── STRATEGY POD: Deep Value      → Tim analis + alokasi modal sendiri
  │     (Graham 2x + Buffett + Munger) → Portfolio Policy (long_only) → Value Sleeve
  │
  ├── STRATEGY POD: Earnings Drift  → Model kuantitatif murni
  │     (PEAD Model)                → Portfolio Policy (long_short) → Event Sleeve
  │
  └── STRATEGY POD: Inflections     → Pertumbuhan & pembalikan tren
        (Druckenmiller + Lynch)     → Portfolio Policy (long_short) → Momentum Sleeve
              │
    Semua sleeve digabung (netting) ▼
    MASTER RISK (Hard limits) → BROKER EXECUTION → HASH-CHAINED LEDGER → SCORECARD
```

---

## 1.2. Lima Prinsip Rekayasa Utama (Design Philosophy)

1. **LLM Tidak Pernah Menyentuh Order Langsung (*LLM Never Touches The Trade*):**
   LLM hanya bertugas membaca data terstruktur ([`FundamentalsSnapshot`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/features/snapshot.py#L53-L176) & [`IntradayContext`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/features/intraday.py#L49-L78)), menulis tesis investasi, dan mengeluarkan objek [`Signal`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/models.py#L14-L40) dengan nilai keyakinan `value` di rentang `[-1.0, +1.0]`. Penentuan jumlah saham/koin dan eksekusi order dilakukan 100% oleh rumus matematika deterministik.
2. **Batas Risiko Mutlak (*Non-Negotiable Risk Clamps*):**
   Diimplementasikan di [`hedge_fund/risk/limits.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/risk/limits.py#L51-L102). Sekalipun semua agen AI yakin 100% Bullish pada satu aset, kode risiko memotong paksa eksposur maksimal per aset (`max_position_pct`) dan total eksposur portofolio (`max_gross_exposure`). Porsi yang dipotong **wajib disimpan sebagai kas (Cash)**, tidak boleh dialihkan ke aset lain.
3. **Point-in-Time Honesty (Tanpa Bias Masa Depan / Lookahead Bias):**
   Saat mengevaluasi tanggal $T$, sistem memfilter seluruh laporan keuangan berdasarkan `filing_date <= T` (tanggal rilis publik sebenarnya, bukan tanggal periode kuartal). Keputusan yang diambil pada penutupan sesi $T$ baru dieksekusi pada harga penutupan sesi $T+1$.
4. **Satu Mesin untuk Tiga Mode (*One Engine, Three Modes*):**
   Fungsi [`advance()`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/pipeline/session.py#L130-L198) di [`hedge_fund/pipeline/session.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/pipeline/session.py) menjalankan urutan yang identik (`reconcile → execute → mark → assess → record`) untuk **Backtest**, **Paper Trading**, maupun **Live Trading**.
5. **Fitur Anti-Mencontek (*Blind Prompts*):**
   Pada [`FundamentalsSnapshot._render_blind()`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/features/snapshot.py#L139-L175), nama ticker, nama industri, tanggal kalender, dan nominal dolar disembunyikan saat backtest. Periode diubah menjadi `t-0, t-1, ...`, angka per lembar diindeks ke `100`, dan ukuran perusahaan disajikan sebagai persentil *market cap* (`MEBreakpoints`). Ini mencegah LLM "mencontek" ingatan masa depan dari data pelatihannya.

---

## 1.3. Bedah Modul & Rumus Inti di `ai-trading-ai-hedge-fund-main`

### A. Lapisan Data & Feature Engineering (`hedge_fund/features/`)
Sebelum meminta pendapat AI, sistem mengolah data mentah menjadi indikator matang di Python:
- **[`FundamentalsSnapshot`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/features/snapshot.py#L53-L176) (`snapshot.py`)**:
  - Mengambil minimal 4 kuartal (`MIN_PERIODS = 4`, default hingga 20 periode TTM) metrik laporan keuangan.
  - Menghitung fitur agregat secara otomatis:
    - `roe_avg`: Rata-rata Return on Equity lintas periode.
    - `net_margin_avg`: Rata-rata margin laba bersih.
    - `gross_margin_trend`: Selisih Gross Margin terbaru (`t-0`) dikurangi periode terlama (mengukur apakah efisiensi membaik atau memburuk).
    - `bvps_cagr`: Pertumbuhan tahunan majemuk (*Compound Annual Growth Rate*) dari *Book Value per Share*.
    - `eps_growth_yoy`: Pertumbuhan laba per saham tahunan (`t-0` dibanding `t-4`).
  - Menghasilkan `content_hash` (SHA-256 24 karakter tanpa tanggal `as_of`) sebagai kunci cache agar LLM tidak dipanggil ulang jika belum ada laporan keuangan baru.
- **[`IntradayContext`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/features/intraday.py#L49-L78) (`intraday.py`)**:
  - Digunakan untuk sesi trading intraday (per menit/jam).
  - Mengukur pergerakan harga sejak penutupan kemarin (`move_pct`) dibandingkan pergerakan indeks pasar `SPY` (`market_pct`).
  - Mengelompokkan perubahan harga ke dalam pita (*bands*: `<0.5%`, `0.5–1%`, `1–2%`, `2–3%`, `3–5%`, `>5%`) agar pergerakan kecil (noise) tidak memicu pemanggilan ulang LLM.
  - Melampirkan rilis laporan laba terbaru (8-K) dan 10 *headline* berita terkini beserta jam rilisnya.

### B. Dewan Analis AI & Kuantitatif (`hedge_fund/signals/`)
Seluruh analis mewarisi kontrak [`AlphaModel`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/base.py) dan mengeluarkan [`Signal`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/models.py#L14-L40):
$$v = \text{sign}(\text{signal}) \times \frac{\text{confidence}}{100} \in [-1.0, +1.0]$$

| Nama Agen / Model | File Sumber | Pendekatan | Horizon Evaluasi | Fokus Kriteria Analisis (Checklist) |
| :--- | :--- | :--- | :--- | :--- |
| **Warren Buffett** | [`buffett.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/buffett.py) | `long_only` | 252 Hari (1 Thn) | *Economic moat*, ROE tinggi & konsisten, margin stabil/naik, utang rendah, FCF konsisten, harga wajar. |
| **Charlie Munger** | [`munger.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/munger.py) | `long_only` | 252 Hari (1 Thn) | Kualitas bisnis superior, alokasi modal manajemen, daya tahan jangka panjang, menghindari bisnis buruk meski murah. |
| **Benjamin Graham** | [`graham.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/graham.py) | `long_only` | 252 Hari (1 Thn) | *Margin of Safety* ketat, P/E < 15–20, P/B rendah, *Current Ratio* > 1.5, *Debt/Equity* rendah, laba stabil tanpa spekulasi. |
| **Peter Lynch** | [`lynch.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/lynch.py) | `long_only` | 252 Hari (1 Thn) | *GARP (Growth at Reasonable Price)*, membandingkan laju pertumbuhan EPS/Revenue dengan P/E (konsep PEG), kesehatan neraca. |
| **S. Druckenmiller** | [`druckenmiller.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/druckenmiller.py) | `long_short` | 126 Hari (6 Bln) | *Inflection Points*: akselerasi pertumbuhan & margin di kuartal terbaru vs ekspektasi pasar. Berani *Short* jika fundamental memburuk + utang tinggi. |
| **PEAD Quant** | [`pead.py`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/signals/pead.py) | `long_short` | 60 Hari (1 Kuartal) | Murni kuantitatif (*Post-Earnings Announcement Drift*): Sinyal `+1.0` jika rilis 8-K *EPS BEAT*, `-1.0` jika *EPS MISS* dalam 4 hari terakhir. |

### C. Algoritma Penggabungan Sinyal (`hedge_fund/portfolio/construction.py`)
Fungsi [`blend_signals()`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/portfolio/construction.py#L29-L105) menggabungkan opini beberapa analis di dalam satu strategi:
1. Analis yang *abstain* (`metadata.abstained == True`, misalnya karena data kurang atau koneksi LLM gagal) dikeluarkan dari pembagi rata-rata.
2. **Aturan Izin Short (*Short Permission Rule*):**
   - Untuk menghitung konviksi kepemilikan (*long conviction*): semua sinyal analis dihitung rata-rata tertimbangnya.
   - Untuk menghitung penilaian *short* (`short_assessments`): hanya analis berizin `long_short` yang nilai negatifnya dihitung; analis `long_only` yang memberi sinyal negatif dianggap `0.0` pada sisi *short*. Artinya, ketidaksetujuan Buffett/Graham hanya bisa **mengurangi/menjual posisi beli**, tidak akan pernah memicu posisi *short selling*.
3. **Normalisasi ke Target Eksposur (`gross_target`):**
   - Pada mode `long_only` dan `long_short`, bobot tiap ticker dinormalisasi terhadap total skor absolut: $w_i = \frac{s_i}{\sum |s_j|} \times \text{gross\_target}$.
   - Pada mode `dollar_neutral`, separuh modal (`gross_target / 2`) dialokasikan ke sisi Long dan separuh lagi ke sisi Short agar eksposur bersih terhadap pasar = $0$.

### D. Matematika Pembatas Risiko (`hedge_fund/risk/limits.py`)
Fungsi [`apply_limits()`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/risk/limits.py#L51-L102) bekerja dalam 2 tahap deterministik setelah seluruh *strategy sleeves* digabungkan:
1. **Per-Ticker Clamp (`max_position_pct`):** Jika bobot absolut suatu aset $|w_i| > \text{max\_position\_pct}$, maka dipangkas paksa menjadi $\pm \text{max\_position\_pct}$ dan dicatat sebagai [`ClampEvent`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/risk/limits.py#L34-L40).
2. **Portfolio Gross Clamp (`max_gross_exposure`):** Jika jumlah total $\sum |w_i| > \text{max\_gross\_exposure}$, seluruh posisi diperkecil secara proporsional dengan faktor skala $\frac{\text{max\_gross\_exposure}}{\sum |w_i|}$.

### E. Evaluasi Statistik Analis (`hedge_fund/scorecard/analysts.py`)
Fungsi [`score_analysts()`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main/hedge_fund/scorecard/analysts.py#L50-L97) menilai kualitas setiap agen AI ketika masa horizon prediksinya tiba:
1. **Excess Return Hit Rate:** Persentase seberapa sering arah sinyal analis ($\text{value} > 0$ atau $< 0$) terbukti benar mengalahkan return benchmark (`SPY`).
2. **Slugging Ratio (Win/Loss Payoff Ratio):** Rata-rata besaran keuntungan saat analis benar dibagi rata-rata kerugian saat analis salah.
3. **Information Coefficient (IC) & t-stat:** Menghitung korelasi peringkat *Spearman* ($\rho$) antara tingkat keyakinan analis dengan *forward return* aktual lintas aset pada setiap tanggal, beserta nilai *mean*, *standard deviation*, dan *t-statistic* ($t = \frac{\bar{\text{IC}}}{\sigma_{\text{IC}}} \sqrt{N}$) untuk membuktikan secara statistik apakah AI tersebut benar-benar memiliki *skill* (alfa) atau hanya kebetulan.

---

# BAGIAN III: PETA INTEGRASI KE `@index.html` (PRODUK UTAMA)

Berikut adalah terjemahan langsung dari fitur-fitur di atas untuk dibangun dan dikembangkan pada aplikasi utama kita di **[`index.html`](file:///Users/erza/Document/project/AiTrades/index.html)** (dan modul pendamping di luar sub-folder referensi):

## 1. Sistem Skoring Komposit (Multi-Factor Decision Matrix)
Untuk menentukan **Koin Crypto** atau **Saham** mana yang layak **BUY** atau **SELL**, mesin kita di [`index.html`](file:///Users/erza/Document/project/AiTrades/index.html) akan menilai setiap aset menggunakan penggabungan skor dari 5 dimensi utama:

$$\text{Composite Conviction } (S_{\text{total}}) = w_1 S_{\text{Fund}} + w_2 S_{\text{SmartMoney}} + w_3 S_{\text{QuantTech}} + w_4 S_{\text{Sentiment}} + w_5 S_{\text{AICommittee}}$$

| Dimensi Analisis | Indikator pada **CRYPTO** (`BTC`, `ETH`, `SOL`, dll.) | Indikator pada **SAHAM / STOCKS** (`NVDA`, `AAPL`, `BBCA`, dll.) |
| :--- | :--- | :--- |
| **1. Fundamental Score ($S_{\text{Fund}}$)** | TVL Growth, Protocol Revenue, MarketCap/FDV Ratio, Token Unlock Risk, Active Addresses. | ROE, Operating/Net Margin, P/E & PEG Ratio, Debt-to-Equity, Current Ratio, EPS & FCF Growth. |
| **2. Smart Money & Wallet ($S_{\text{SmartMoney}}$)** | Whale Wallet Accumulation, Exchange Netflow (Outflow = Bullish), Smart DEX Trader Flow, Funding Rate. | Institutional 13F Accumulation, Insider Buying/Selling Ratio, Dark Pool / Block Trade Netflow. |
| **3. Data Science & Quant ($S_{\text{QuantTech}}$)** | RSI/MACD Divergence, Volatility Squeeze, Orderbook Imbalance, Z-Score Mean Reversion. | Post-Earnings Announcement Drift (PEAD), Relative Strength vs Index (`SPY`/`IHSG`), Volume Profile. |
| **4.Probabilitas & Matematika** | Win Probability ($P_{\text{win}}$), Expected Value ($EV$), Kelly Criterion Optimal Size ($f^*$), Risk/Reward Ratio. | Win Probability ($P_{\text{win}}$), Expected Value ($EV$), Kelly Criterion Optimal Size ($f^*$), VaR (95%). |
| **5. Komite Persona AI ($S_{\text{AICommittee}}$)** | On-Chain Whale Analyst, Macro/Liquidity Analyst (Druckenmiller), Quant Momentum Agent, Risk Officer. | Warren Buffett, Benjamin Graham, Charlie Munger, Peter Lynch, Stanley Druckenmiller. |

## 2. Modul UI & Engine yang Akan Dikembangkan di `@index.html`
1. **Market Mode Switcher (Crypto & Stocks):**
   - Kemampuan berpindah atau memantau sekaligus daftar **Crypto** dan **Saham** lengkap dengan filter pintar (*Top AI Buy Signals*, *Smart Money Accumulation*, *High Win-Probability*, *Gainers/Losers*).
2. **AI Decision & Signal Scanner Card (Rekomendasi Beli/Jual Terbaik):**
   - Menampilkan kesimpulan tegas: **`STRONG BUY`**, **`BUY`**, **`NEUTRAL / HOLD`**, atau **`SELL / SHORT`**.
   - Menampilkan metrik matematika: **Conviction Score (`-1.0` s/d `+1.0`)**, **Win Probability (`%`)**, **Expected Value (`EV`)**, **Target Take-Profit**, **Stop-Loss**, dan **Recommended Position Size (`%` dari modal setelah dipotong *Risk Clamp*)**.
3. **Smart Money & Fundamental Inspector Panel:**
   - Tab khusus untuk melihat pergerakan **Whale Wallet / Exchange Netflow / Institutional Flow** serta tabel **Laporan Keuangan & Rasio Fundamental** aset yang sedang dipilih di chart.
4. **Dewan Analis AI (AI Committee Votes & Reasoning):**
   - Menampilkan kartu voting dari masing-masing agen AI (Buffett, Graham, Druckenmiller, Whale Tracker, Quant Model) lengkap dengan alasan tertulis (*thesis*) dan skor *Scorecard* akurasi mereka.
5. **Master Risk Clamp & Hash-Chained Ledger:**
   - Pengaturan batas risiko mutlak (`Max Position %`, `Max Exposure`) serta pencatatan histori keputusan dengan *SHA-256 Hash Chain* di dalam tab Logs/Performance.

---

# BAGIAN IV: DAFTAR FOLDER PROYEK REFERENSI LAINNYA (UNTUK DIPELAJARI BERTAHAP)

Selain [`ai-trading-ai-hedge-fund-main`](file:///Users/erza/Document/project/AiTrades/ai-trading-ai-hedge-fund-main) yang sudah selesai dibedah di atas, workspace ini memiliki repositori referensi berikut yang akan kita pelajari secara bertahap untuk memperkaya kemampuan robot AI kita di [`index.html`](file:///Users/erza/Document/project/AiTrades/index.html):

1. ✅ **`ai-trading-ai-hedge-fund-main`** — Arsitektur Hedge Fund AI, Persona Investor Legendaris, Point-in-Time Fundamental Snapshot, Portfolio Blending, Hard Risk Clamps, Hash-Chained Ledger, & Analyst Scorecard *(Selesai Dipelajari)*.
2. ⏳ **`ai-trading-TradingAgents-main`** — Kerangka kerja Multi-Agent debat (Analis Fundamental, Analis Sentimen, Analis Teknikal, Bull vs Bear Researcher, Trader, Risk Manager).
3. ⏳ **`ai-trading-Vibe-Trading-main`** — Agen trading modern & integrasi alur kerja strategi.
4. ⏳ **`ai-trading-FinRobot-master`** — Platform AI Agent untuk analisis laporan keuangan mendalam dan riset ekuitas.
5. ⏳ **`ai-trading-FinGPT-master`** — Financial Large Language Model untuk analisis sentimen berita finansial & prediksi pasar.
6. ⏳ **`ai-trading-FinRL-master`** — Deep Reinforcement Learning (DRL) untuk optimasi keputusan trading kuantitatif.
7. ⏳ **`ai-trading-qlib-main`** — Platform riset kuantitatif AI dari Microsoft (Alpha Faktor, Data Science & Modeling).
8. ⏳ **`ai-trading-LangAlpha-main`** — Analisis finansial berbasis bahasa alami & pencarian sinyal alfa.
9. ⏳ **`ai-trading-day-trader-skill-main`** — Keterampilan dan aturan teknikal untuk *day trading* / intraday.
10. ⏳ **`ai-trading-hummingbot-master`** — Mesin eksekusi algoritma *market-making*, arbitrase, dan konektor bursa crypto.
11. ⏳ **`ai-trading-tradingview-mcp-main`** & **`tradingView-websocket-api-main`** — Integrasi data chart real-time dan indikator teknikal TradingView.
12. ⏳ **`AI-Trading-learnharness-main`** — Kerangka evaluasi dan pembelajaran agen trading.
