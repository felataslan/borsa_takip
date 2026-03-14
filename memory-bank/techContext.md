# Teknik Bağlam (Tech Context)

## Kullanılan Teknolojiler

| **Kütüphane**         | Versiyon | Kullanım Amacı                                                |
| --------------------- | -------- | ------------------------------------------------------------- |
| **Next.js**           | 16.1.2   | App Router, Route Handlers, SSR/CSR                           |
| **React**             | 19.2.3   | UI temeli                                                     |
| **Material-UI (MUI)** | ^7       | Bileşen kütüphanesi ve tema sistemi                           |
| **yahoo-finance2**    | ^3.13    | BİST hisse fiyatlarını çekmek için (sunucu tarafı)            |
| **node-cache**        | ^5.1.2   | API Rate Limit koruması için sunucu önbellekleme (Server Cache)|
| **Zustand**           | ^5       | Favoriler için kalıcı global state (`persist` middleware ile) |
| **Framer Motion**     | ^12      | Kart animasyonları (3D Lift / Glow efektleri)                 |
| **Recharts**          | ^3       | Halka Arzlar sayfasındaki bar grafiği ve hisse geçmiş grafiği |
| **Lucide React**      | ^0.577   | SVG ikon seti                                                 |
| **Cheerio**           | —        | `halkarz.com`'dan IPO verisi scraping                         |
| **TypeScript**        | ^5       | Tip güvenliği                                                 |
| **Tailwind CSS**      | ^4       | Layout yardımcı sınıfları (layout.tsx)                        |

---

## Klasör Yapısı

```
src/
├── app/
│   ├── api/stocks/     → Route Handler (veri çekme + sektör eşleştirme)
│   │   ├── route.ts                    → Ana hisse listesi (node-cache ile cache'li)
│   │   ├── top-gainers/route.ts        → En Çok Yükselenler API'si
│   │   ├── [symbol]/history/route.ts   → Geçmiş fiyat grafiği (node-cache'li)
│   │   └── [symbol]/news/route.ts      → TradingView haberleri
│   ├── bist30/         → BİST 30 sayfası
│   ├── bist100/        → BİST 100 sayfası
│   ├── hesabim/        → Portföy ve yatırım takibi (Kâr/Zarar) sayfası
│   ├── halkaarz/       → Halka Arzlar sayfası (IPO + Recharts)
│   ├── layout.tsx      → Root layout (Header, ThemeProvider)
│   └── page.tsx        → Ana sayfa (sektörel gruplama ve En Çok Yükselenler)
├── components/
│   ├── Header.tsx           → Navigasyon AppBar + theme toggle (Pill design)
│   ├── StockCard.tsx        → Hisse kartı (Premium Glassmorphism & Hover animasyon)
│   ├── StockGrid.tsx        → Arama + grid + boş durum
│   ├── StockDetailModal.tsx → Cam etkili zenginleştirilmiş UI
│   ├── TopGainersList.tsx   → Periyot tabanlı En Çok Yükselenler vitrini
│   ├── DailyTopGainers.tsx  → Günlük En Çok Yükselen 10 hisse vitrini
│   ├── PageHeader.tsx       → Sayfa başlığı
│   ├── LoadingState.tsx     → CircularProgress
│   ├── ErrorState.tsx       → Hata alert
│   ├── BackgroundOrbs.tsx   → Dekor efektleri
│   └── IpoTooltip.tsx       → Recharts tooltip (paylaşımlı)
├── hooks/
│   ├── useStocks.ts         → Generic fetch + auto-refresh hook
│   ├── useStockFilter.ts    → Memoized filtre hook'u
│   └── useMounted.ts        → SSR hydration önleyici hook
├── store/
│   ├── useFavoritesStore.ts → Zustand favoriler store
│   └── usePortfolioStore.ts → Zustand portföy/yatırım store'u
├── types/
│   └── stock.types.ts       → Stock, IPOStock arayüzleri
├── theme/
│   ├── ThemeProvider.tsx    → Dark/light mod context ve MUI ThemeProvider
│   └── theme.ts             → MUI ThemeOptions builder (saf config, 'use client' yok)
├── data/
│   ├── bist-indexes.ts      → BIST_30, BIST_100 sembolleri
│   └── bist-sectors.ts      → BIST_SECTORS haritası + getAllBistSymbols()
└── utils/
    └── ipo-scraper.ts       → getDynamicIPOs() (cheerio scraper, 12s cache)
```

---

## Geliştirme Ortamı & Kurulum

1. `npm install` — bağımlılıkları kur
2. `npm run dev` — `http://localhost:3000` adresinde geliştirme sunucusu
3. `npm run build` — production build (TypeScript + lint kontrollü)
4. `npm run lint` — ESLint (Next.js + TypeScript kuralları)

> Dış API anahtarına gerek yoktur. Yahoo Finance community API scraping ile otomatik çalışır.
