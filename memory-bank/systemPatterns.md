# Sistem Desenleri (System Patterns)

## Mimari

Uygulama **Next.js 16 (App Router)** tabanlı full-stack bir mimari kullanmaktadır.

- **Frontend:** React 19, Material UI (MUI), Framer Motion. Tüm sayfa bileşenleri `'use client'` direktifi ile istemci tarafında çalışır.
- **Backend:** Next.js Route Handler (`/api/stocks`) — `yahoo-finance2` ile veri çekme, sektör eşleştirme ve halkaarz scraping işlemleri burada gerçekleşir.

---

## Veri Akışı

```
Sayfa yüklenir
  → useStocks('/api/stocks') hook'u fetch atar
  → /api/stocks Route Handler:
      1. getDynamicIPOs() scraper (12 saatlik bellek cache'i ile)
      2. getAllBistSymbols() + BIST_100 + IPO sembollerinin birleşim kümesi
      3. yahooFinance.quote(allSymbols) toplu istek
      4. symbolToSector haritası ile sektör bilgisi eklenir
      5. JSON formatında client'a döner
  → Client, useStockFilter hook'u ile arama / sektör filtrelemesi yapar
  → StockCard / StockGrid bileşenleri render eder
  → setInterval ile 5 dakikada bir otomatik yenileme
```

---

## Hook Mimarisi (Paylaşımlı Mantık)

| Hook             | Dosya                         | Amaç                                                                   |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `useStocks<T>`   | `src/hooks/useStocks.ts`      | Generic fetch + auto-refresh + loading/error state                     |
| `useStockFilter` | `src/hooks/useStockFilter.ts` | Memoized arama + sektör filtresi; döner `filteredStocks` ve `sectors`  |
| `useMounted`     | `src/hooks/useMounted.ts`     | Next.js SSR hydration sorunlarını çözmek için (client'te mount bekler) |

---

## Bileşen Mimarisi (Paylaşımlı UI)

| Bileşen          | Amaç                                                         |
| ---------------- | ------------------------------------------------------------ |
| `PageHeader`     | Sayfa başlığı + altyazı bloğu                                |
| `LoadingState`   | Merkezi `CircularProgress`                                   |
| `ErrorState`     | Merkezi hata `Alert`                                         |
| `StockGrid`      | Arama alanı + esnek grid + boş durum                         |
| `BackgroundOrbs` | Sabit dekor efektleri                                        |
| `IpoTooltip`     | Recharts bar grafiği tooltip (stable referans için dışarıda) |
| `StockCard`      | Tek hisse kartı (Framer Motion, favori toggle)               |
| `Header`         | Navigasyon AppBar + dark/light mode toggle                   |

---

## Durum Yönetimi

- **Global / Kalıcı:** `useFavoritesStore` (Zustand + `persist` → `localStorage`) ile favori hisseler
- **Portföy / Yatırım:** `usePortfolioStore` (Zustand + `persist` → `localStorage`) ile lot/maliyet takibi
- **Sunucu Cache (Rate Limit Koruması):** `node-cache` kullanılarak `/api/stocks` (120 sn) ve `/api/stocks/[symbol]/history` (300 sn) rote'larında server-side caching.
- **Scraper Cache:** `getDynamicIPOs()` içinde 12 saatlik bellek cache (module-level değişken)
- **Lokal:** `useState` (searchQuery, selectedSector, activeMetric, loading, data vb.)

---

## UI Desenleri

- **Two-Column Layout (Sidebar):** `SectorsTab` bileşeninde ana içerik solda, yardımcı araçlar ve performans listeleri (yükselenler) sağda `sticky` bir sidebar içinde sunulur.
- **Metric Toggle:** Grafikler ve listeler için `Tabs` bileşeni kullanılarak farklı veri setleri (ör. Toplam Getiri vs Günlük Değişim) arasında geçiş sağlanır.

---

## Stil ve Tasarım Sistemi

- **Material UI (MUI)** ve **Tailwind CSS**: MUI ana bileşen motoru iken (`theme.ts` üzerinden), global layout işlemleri Tailwind sınıfları ile yapılmaktadır. Uygulama güncel fintech tarzı **Premium Glassmorphism** tasarım dilini kullanır (`backdrop-filter: blur`, 20px~24px border radius, saydam opak kenarlıklar).
- **Renk Paleti**: Özellikle Dark Mode için çok koyu arduvaz (`#09090b`) arkaplanlar ve canlı zümrüt yeşili (`#10b981`) kontrast renkleri vurgulanmıştır.
- **Framer Motion**: `StockCard` hover animasyonlarında (yukarı kalkma, derinleşen gölge ve arka plan ışılması) ve liste giriş efekti işlemlerinde MUI `Card` bileşeniyle entegre kullanılmıştır.
- **Lucide React**: Tüm ikonlar için tek kaynak.

---

## Tip Sistemi

```typescript
// src/types/stock.types.ts
interface Stock {
  symbol;
  shortName;
  price;
  changePercent;
  change;
  currency;
  sector?;
  ipoPrice?;
  ipoDate?;
  ipoName?;
}
interface IPOStock extends Stock {
  ipoPrice;
  ipoDate;
  ipoName(required);
  totalReturnPercent;
}
```
