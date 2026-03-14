# Aktif Bağlam (Active Context)

## Son Yapılan Değişiklikler

- **Tam Refactör (2026-03-07):** Projedeki tüm kaynak kodlar best-practice'e uygun şekilde yeniden yapılandırıldı.
  - **Paylaşımlı Hook'lar** (`src/hooks/`): `useStocks.ts` (fetch + auto-refresh + loading/error) ve `useStockFilter.ts` (memoized arama + sektör filtresi) oluşturuldu; her sayfada tekrar yazılan bu mantık kaldırıldı.
  - **Paylaşımlı Bileşenler** (`src/components/`): `PageHeader`, `LoadingState`, `ErrorState`, `StockGrid`, `BackgroundOrbs`, `IpoTooltip` bileşenleri oluşturuldu.
  - **Tip Sistemi:** `Stock` tipine opsiyonel IPO alanları eklendi; `IPOStock` arayüzü tanımlandı; `halkaarz/page.tsx`'te kopyalanan yerel tipler silindi.
  - **Tema:** `theme.ts`'teki gereksiz `'use client'` direktifi kaldırıldı.
  - **Temizlik:** `test.tsx`, `test2.tsx`, `get_activity_svg.js` silindi.
  - **Favoriler sayfasına arama kutusu eklendi** (önceden yoktu).
  - `npm run build` ve `npm run lint` sıfır hata ile geçiyor.

- **Halka Arzlar Sayfası (`/halkaarz`):** `halkarz.com` scraping ile son 3 aya ait IPO hisselerinin halka arz fiyatına göre toplam getirisi gösterilmektedir. Ayrıca, kullanıcıların girdikleri **"Elimdeki Lot" değerine göre hisse bazlı net ₺ kâr/zarar** dinamik olarak hesaplanmaktadır.
- **Portföy (Hesabım) Sayfası (`/hesabim`):** Kullanıcının varlıklarını (lot, maliyet) ekleyip anlık fiyatlar üzerinden kâr/zarar durumunu ve portföy dağılımını takip edebileceği yeni bir sayfa eklendi. Sıfır maliyetli (bedelsiz) hisse girişi ve virgüllü ondalık sayı formatları desteklenmektedir.
- **Responsive Navigasyon:** `Header.tsx` bileşenine mobil cihazlar için Material UI `Drawer` (Hamburger Menü) eklendi; desktop menüsü CSS breakpointleri ile gizleniyor/gösteriliyor.
- **Performans ve Güvenlik Güncellemesi (2026-03):** 
  - `npm audit fix` ile NPM paketlerindeki (ör. `next`, `undici`) kritik güvenlik açıkları (DoS, hafıza sızıntısı) yamalandı.
  - Sık çağrılan API Endpoint'lerine (`/api/stocks` ve `/api/stocks/[symbol]/history`) API Rate Limit (ban) yememek ve performansı uçurmak için `node-cache` entegre edildi (120 sn ve 300 sn TTL limitleri).
- **Premium UI Modernizasyonu:** Projenin görsel dili güncel fintech uygulamalarına yaklaştırıldı.
  - "Glassmorphism" (cam) görünümü: `backdrop-filter: blur(20px)` ve özel gradient alanlarla kartlar ve modallar tasarlandı.
  - Renk Paleti: Canlı zümrüt yeşili (`#10b981`) ve daha derin bir karanlık mod (`#09090b`) renk uzayı eklendi.
  - `Header` navigasyonu "pill" (hap) tasarımına ve logoya parlama (glow) efekti uygulandı. 
  - `StockCard` bileşenlerinde `framer-motion` ile interaktif 3D hover (kalkış) animasyonu ve hissiyatı güçlendiren arkaplan "glow orb" entegre edildi.
- **Hydration & UI Düzeltmeleri:** MUI v6 Grid `size` prop'u kullanımına geçildi. Ayrıca Next.js SSR ile Zustand localStorage arasındaki hydration hatalarını önlemek için `useMounted` hook'u yazılarak entegre edildi.
- **Dark/Light Mode:** `ThemeProvider` localStorage üzerinden temayı hatırlar ve sistem tercihine göre varsayılan belirler. "Cascading renders" uyarısını düzeltecek şekilde `useEffect` akışı iyileştirildi.

## Gelecek Planı veya Olası Eklemeler

- Arama kutusuna debounce eklenebilir (performans optimizasyonu).
- Hisse detay sayfası: tıklanan hisse için geçmiş fiyat grafiği veya bilanço bilgisi.
- `SWR` veya `React Query` kullanılarak veri önbelleğe alınabilir (şu an vanilla `fetch` + `setInterval` kullanılıyor).
- Vercel'e deploy ve `15 dk gecikmeli` bildiriminin UI'a işlenmesi.
