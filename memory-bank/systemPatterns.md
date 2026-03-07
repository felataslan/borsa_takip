# Sistem Desenleri (System Patterns)

## Mimari

Uygulama **Next.js (App Router)** tabanlı bir tam yığın (Full-stack) mimari kullanmaktadır.

- **Frontend:** React, Material UI (MUI), Framer Motion kombinasyonuyla istemci tarafında render edilen (Client Components - `use client`) sayfalar.
- **Backend (API):** Next.js Route Handlers (`/app/api/...`) aracılığıyla oluşturulan hafif bir middleware. İstemciden gelen istekleri alıp, `yahoo-finance2` üzerinden 3. parti veri kaynağından bilgileri alır, formatlar ve client'a JSON olarak döner.

## Veri Akışı

1. `src/app/page.tsx`, `/bist30` veya `/bist100` sayfaları yüklendiğinde `/api/stocks` endpointine GET isteği atılır.
2. `/api/stocks` sunucu tarafında `getAllBistSymbols()` ve `BIST_100` listelerinin birleşim kümesini (tüm tanımlı sembolleri) çeker.
3. Sunucu, `YahooFinance` (v3) sınıfı üzerinden toplu (batch) istek atarak verileri tek seferde alır.
4. Sunucu `symbolToSector` haritasını kullanarak dönen verilere ait oldukları sektör bilgisini ekler (`Stock` tipi).
5. Frontend tarafı bu JSON verisini `stocks` state'ine kaydeder, kullanıcı arama/sektör filtresi işlemleri veya endeks ayrıştırması frontend tarafında (Client Component'te) gerçekleşir.

## Durum Yönetimi (State Management)

- **Global / Kalıcı Durum:** Kullanıcının favori hisseleri bilgisini tutmak için `Zustand` kullanılmaktadır. Bu durum, `persist` middleware'i ile `localStorage`'a kaydedilir (`useFavoritesStore.ts`).
- **Lokal Durum:** Ana sayfadaki hisse listesi, yükleniyor (loading) mekanizmaları, arama terimi (`searchQuery`) ve seçili sektör (`selectedSector`) React `useState` ile sayfa seviyesinde yönetilir.

## Stil ve Tasarım Sistemleri

- Proje ilk başta **Tailwind CSS** kullanılarak başlatılmış olsa da, daha sonra tamamen **Material UI (MUI)** yapısına geçirilmiştir.
- `src/theme/theme.ts` içerisinde Tailwind'in `gray-900`/`green-500` gibi renk tonlarını taklit eden bir MUI `createTheme` tanımı bulunmaktadır.
- Animasyonlu geçişler için `framer-motion` bileşenleri MUI komponentleriyle entegre edilerek (örn: `<Card component={motion.div} ... />`) kullanılmaktadır.
