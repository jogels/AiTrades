# Analisis Mendalam Proyek AI Trades

Dokumen ini berisi bedah teknis, arsitektur, dan panduan fitur dari setiap repositori trading AI yang ada di dalam workspace `AiTrades`.

---

# 1. ai-trading-ai-hedge-fund-main (`aihf`)

## 1.1. Ringkasan Eksekutif & Konsep Dasar
`ai-trading-ai-hedge-fund` (CLI/Package: `aihf` v2.6.2) adalah implementasi arsitektur **Hedge Fund Berbasis AI Persisten**. 

Mayoritas proyek AI trading pada umumnya hanya berupa skrip sekali jalan (*one-shot script*: prompt AI -> dapatkan sinyal beli/jual -> selesai). Sebaliknya, project ini dirancang layaknya institusi hedge fund nyata dengan struktur organisasi formal, *point-in-time honesty* (tanpa bias masa depan/lookahead), serta pemisahan tegas antara **penilaian analisis AI** dan **eksekusi matematika risiko**:

```
 FUND "Alpha One"                   → Modal, Mandat, Always-On
  │
  ├─ CIO (Capital Allocator)        → Mengalokasikan porsi modal ke setiap strategi
  │
  ├── STRATEGY POD: Value           → Tim analis + alokasi modal sendiri
  │     (Buffett + Munger + Graham) → Portfolio Policy → Sleeve Value
  │
  ├── STRATEGY POD: Earnings Drift  → Model kuantitatif murni
  │     (PEAD Model)                → Event Sleeve
  │
  └── STRATEGY POD: Inflections     → Pertumbuhan & pembalikan tren
        (Druckenmiller + Lynch)     → Momentum Sleeve
              │
    Semua sleeve digabung (netting) ▼
    MASTER RISK (Hard limits) → BROKER EXECUTION → HASH-CHAINED LEDGER
```

---

## 1.2. Prinsip Rekayasa (Design Philosophy)

1. **LLM Tidak Pernah Mengeksekusi Order Langsung (*LLM never touches the trade*):**
   Model bahasa (LLM) hanya bertindak sebagai analis: membaca laporan keuangan (*FundamentalsSnapshot*), merumuskan tesis investasi, dan mengeluarkan sinyal keyakinan (*conviction*) bernilai `[-1.0, +1.0]`. Penentuan ukuran posisi (*sizing*), alokasi dolar, dan pengiriman order dilakukan secara deterministik oleh algoritma matematika.
2. **Batas Risiko Mutlak (*Non-negotiable Risk Clamps*):**
   *Chief Risk Officer* diimplementasikan dalam bentuk kode deterministik (`hedge_fund/risk/limits.py`). Jika analis AI sangat yakin 100% pada satu saham, aturan risiko membatasi eksposur maksimal (misal: maks 15% per posisi, batasan gross leverage). Kelebihan bobot yang dipangkas diubah menjadi kas tunai (*cash*), bukan dipindahkan ke saham lain.
3. **Point-in-Time Honesty (Bebas Bias Masa Depan):**
   Saat simulasi tanggal T, sistem hanya boleh membaca data yang benar-benar sudah dirilis ke publik pada tanggal T tersebut. Transaksi yang diputuskan pada penutupan sesi T baru dieksekusi pada harga penutupan sesi T+1.
4. **Satu Mesin, Tiga Mode (*One Engine, Three Modes*):**
   Fungsi inti `advance()` digunakan sama persis untuk:
   - **Backtest:** Jam historis + Simulated Broker + State di memori.
   - **Paper Trading:** Jam riil + Paper Broker + State di Hash-Chained Ledger.
   - **Live Trading:** Jam riil + Broker nyata (Alpaca/Interactive Brokers) + Ledger.
5. **Fitur Anti-Mencontek (*Blind Prompts*):**
   Saat backtesting, prompt LLM dapat disamarkan: nama ticker saham, nama industri, tanggal kalender, dan nilai nominal dolar disembunyikan. Tujuannya mencegah LLM "mengingat" lonjakan harga historis dari data pelatihannya (menghilangkan *memorization bias*).

---

## 1.3. Fitur-Fitur Utama

### A. Analis AI (LLM Investor Personas & Kuantitatif)
Terletak pada folder `hedge_fund/signals/`:
- **Warren Buffett (`buffett.py`):** Fokus pada parit ekonomi (*economic moats*), ROIC konsisten, margin laba dapat diprediksi, dan utang rendah.
- **Charlie Munger (`munger.py`):** Menilai kualitas manajemen, integritas, model mental bisnis, dan keunggulan kompetitif jangka panjang.
- **Benjamin Graham (`graham.py`):** Analisis nilai intrinsik ketat (*deep value*), margin keamanan (*margin of safety*), rasio P/E dan P/B rendah, aset lancar bersih.
- **Peter Lynch (`lynch.py`):** Mencari rasio PEG yang menarik, pertumbuhan laba terjangkau (*Growth at Reasonable Price / GARP*), dan cerita ekspansi produk.
- **Stanley Druckenmiller (`druckenmiller.py`):** Makroekonomi, akselerasi pertumbuhan, siklus likuiditas, dan katalis perubahan fundamental.
- **PEAD Model (`pead.py`):** Model kuantitatif murni tanpa AI, memanfaatkan anomali *Post-Earnings Announcement Drift* (keterlambatan reaksi pasar terhadap kejutan laba perusahaan).

### B. Strategi Bawaan (Strategy Pods)
Terletak pada `hedge_fund/strategies/*.yaml`:
- **Deep Value:** Graham memimpin (bobot 2.0x), didukung Buffett dan Munger. Mode: *long_only*.
- **Fundamental L/S:** Portofolio *dollar-neutral* (bobot seimbang antara long dan short). Menggabungkan pandangan seluruh 5 investor legendaris.
- **Earnings Drift:** Kuantitatif murni, mengeksploitasi momentum setelah rilis laporan laba.
- **Inflections:** Druckenmiller dan Lynch mencari saham dengan akselerasi fundamental sebelum dihargai oleh pasar umum.

### C. Hash-Chained Ledger (Buku Kas Kriptografis)
Terletak di `hedge_fund/paper/ledger.py`:
- Setiap sesi trading menghasilkan `SessionRecord` dalam format JSON.
- Setiap catatan menyertakan hash SHA dari catatan sebelumnya (mirip rantai blok / blockchain sederhana).
- Jika ada file yang diedit manual, dipindah, atau tertinggal, sistem akan menolak eksekusi demi menjamin integritas rekam jejak (*track record*).
- Memiliki fitur *Kill Switch* (`control.json`) untuk menghentikan transaksi darurat (`halt` dan `resume`).

### D. Terminal User Interface (TUI)
Menggunakan library modern Python `Textual` (`hedge_fund/tui/`):
- Antarmuka visual penuh di terminal dengan dashboard berwarna.
- Menampilkan grafik *equity curve* backtesting vs benchmark (S&P 500).
- Mode persetujuan (*human-in-the-loop approval*): melihat keputusan AI sebelum dieksekusi pada sesi berikutnya.
- Scorecard kinerja masing-masing analis AI.

---

## 1.4. Peta Struktur Folder & Modul

```
ai-trading-ai-hedge-fund-main/
├── pyproject.toml              # Konfigurasi dependensi (Poetry) & entry-point CLI `aihf`
├── README.md & VISION.md       # Dokumentasi visi dan arsitektur fund
├── hedge_fund/
│   ├── run.py                  # Entrypoint utama CLI `aihf`
│   ├── models.py               # Data types dasar (Signal, Order, Book, Position)
│   ├── data/                   # Client data pasar, fundamentals & bar cache
│   ├── features/               # Ekstraksi snapshot fundamental point-in-time
│   ├── llm/                    # Client multi-LLM (Anthropic, OpenAI, Gemini, dll) & prompt caching
│   ├── signals/                # Implementasi analis AI (Buffett, Graham, dll.) & quant
│   ├── strategies/             # Definisi strategi portofolio dalam file YAML
│   ├── portfolio/              # Algoritma blending signal & pembobotan portofolio
│   ├── risk/                   # Mesin pembatas risiko mutlak (max position, leverage)
│   ├── pipeline/               # Mesin advance() sesi T (penilaian) dan T+1 (eksekusi)
│   ├── brokers/                # Protokol broker (Simulated broker, Paper broker)
│   ├── paper/                  # Runner paper trading & hash-chained ledger
│   ├── backtesting/            # Simulator backtesting historis
│   ├── scorecard/              # Evaluasi dan atribusi performa per analis
│   └── tui/                    # Aplikasi dashboard terminal berbasis Textual
```

---

## 1.5. Kebutuhan API & Penyedia Model

Sistem membaca konfigurasi dari `~/.hedge-fund/.env` atau environment variabel:
1. **Data Pasar & Fundamental:** [Financial Datasets](https://financialdatasets.ai) API key (`FINANCIAL_DATASETS_API_KEY`).
2. **Model LLM:** Mendukung:
   - Google Gemini (`GOOGLE_API_KEY`)
   - Anthropic Claude (`ANTHROPIC_API_KEY`)
   - OpenAI (`OPENAI_API_KEY`)
   - DeepSeek (`DEEPSEEK_API_KEY`)
   - xAI Grok (`XAI_API_KEY`)

*Catatan:* Seluruh respon API pasar dan LLM dicache ke folder lokal `~/.hedge-fund/cache/`. Setelah data pernah diunduh sekali, eksekusi ulang berjalan instan, hemat kuota token, dan dapat berjalan offline.

---

## 1.6. Panduan Menjalankan Sistem

```bash
# 1. Pindah ke direktori
cd ai-trading-ai-hedge-fund-main

# 2. Instalasi dependensi menggunakan Poetry
poetry install

# 3. Menjalankan Dashboard Terminal Interaktif (TUI)
poetry run aihf

# 4. Menjalankan Backtest Mandat tertentu via CLI
poetry run aihf backtest hedge_fund/fund/example.yaml \
    --universe AAPL,MSFT,NVDA,GOOGL \
    --start 2024-01-02 \
    --end 2024-06-28

# 5. Menjalankan Paper Trading
poetry run aihf paper create my-fund --mandate hedge_fund/fund/example.yaml --universe AAPL,MSFT
poetry run aihf paper tick my-fund

# 6. Menjalankan Unit Tests Lengkap
poetry run pytest hedge_fund/
```

---

## 1.7. Kesimpulan & Nilai untuk Developer
Proyek ini merupakan referensi berstandar institusional terbaik di dalam koleksi `AiTrades` untuk:
1. Mempelajari cara menggabungkan LLM dengan aturan matematika finansial tanpa risiko halusinasi.
2. Memahami desain *Point-in-Time* data agar hasil backtest valid di dunia nyata.
3. Mengembangkan agen analis kustom dengan filosofi investasi baru.
