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

| Hook             | Dosya                         | Amaç                                                                  |
| ---------------- | ----------------------------- | --------------------------------------------------------------------- |
| `useStocks<T>`   | `src/hooks/useStocks.ts`      | Generic fetch + auto-refresh + loading/error state                    |
| `useStockFilter` | `src/hooks/useStockFilter.ts` | Memoized arama + sektör filtresi; döner `filteredStocks` ve `sectors` |

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

- **Global / Kalıcı:** `useFavoritesStore` (Zustand + `persist` → `localStorage`)
- **Sunucu Cache:** `getDynamicIPOs()` içinde 12 saatlik bellek cache (module-level değişken)
- **Lokal:** `useState` (searchQuery, selectedSector, loading, data vb.)

---

## Stil ve Tasarım Sistemi

- **Material UI (MUI)** ana bileşen kütüphanesi; `src/theme/theme.ts` içinde `PaletteMode` bazlı `ThemeOptions` tanımı.
- **Tailwind CSS** sınıfları layout için hâlâ `layout.tsx`'te kullanılmaktadır (`min-h-screen`, `antialiased` vb.).
- **Framer Motion**: `StockCard` ve `halkaarz` kart animasyonları için MUI `Card` ile birlikte `component={motion.div}` olarak kullanılır.
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
