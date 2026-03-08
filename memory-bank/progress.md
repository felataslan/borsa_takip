# Gelişim Durumu (Progress)

## Tamamlanan Özellikler:

- [x] Temel Next.js proje yapısının oluşturulması
- [x] `yahoo-finance2` (v3) entegrasyonu ve `/api/stocks` Next.js Route Handler ile veri alınması
- [x] ~120 hisseden oluşan BİST verisinin `BIST_SECTORS` üzerinden sektörlere ayrıştırılması
- [x] Özelleştirilmiş dark/light mode MUI teması (`ThemeProvider`, `getTheme`)
- [x] Framer Motion entegre `StockCard` bileşeni (animasyonlu hover ve giriş efekti)
- [x] Zustand + `persist` middleware ile Favoriler kalıcı durum yönetimi
- [x] Ana sayfada hisse adı/sembolü araması + sektör dropdown filtresi
- [x] BİST 30 ve BİST 100 sayfaları (`/bist30`, `/bist100`)
- [x] Halka Arzlar sayfası (`/halkaarz`): IPO listesi scraping + Recharts bar grafiği
- [x] Halka Arzlar sayfasına "Elimdeki Lot" TextField girişi ve anlık fiyata göre ₺ bazında dinamik kâr/zarar hesaplama özelliği eklendi
- **Tam refactör:** Paylaşımlı hook'lar (`useStocks`, `useStockFilter`) ve UI bileşenleri (`PageHeader`, `LoadingState`, `ErrorState`, `StockGrid`, `BackgroundOrbs`, `IpoTooltip`) oluşturuldu; tüm sayfalardaki kod tekrarı giderildi
- [x] `Stock` ve `IPOStock` TypeScript tip sistemi genişletildi
- [x] `Header.tsx` için Responsive Sidebar (Drawer / Hamburger Menu) eklendi ve TypeScript Link `style`/`sx` hata çakışmaları çözüldü
- [x] `ThemeProvider` cascading renders Effect problemi giderildi
- [x] `npm run build` ve `npm run lint` sıfır hata ile geçmekte

## Bekleyen/İlerleyen Aşamalar (Backlog):

- [ ] Hisse detay sayfası (tıklama ile geçmiş fiyat grafiği veya bilanço bilgisi)
- [ ] Arama kutusuna debounce eklenmesi
- [ ] Veriler için SWR/React Query entegrasyonu (şu an `fetch` + `setInterval`)
- [ ] Uygulamanın Vercel'e deploy edilmesi
- [ ] "15 dk gecikmeli" veri uyarısının UI'da açıkça gösterilmesi
