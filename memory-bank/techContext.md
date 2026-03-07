# Teknik Bağlam (Tech Context)

## Kullanılan Teknolojiler (Dependency List)

1. **[Next.js](https://nextjs.org/) (v16.1.2):** App Router ile uygulamanın temel frontend ve serverless routing yapısını barındırır.
2. **[React](https://react.dev/) (v19.2.3):** Temel kullanıcı arayüzü kütüphanesi.
3. **[Material-UI (MUI)](https://mui.com/):** (`@mui/material`, `@emotion/react`, vb.) Bileşen kütüphanesi ve tema yönetimi.
4. **[yahoo-finance2](https://github.com/gadicc/yahoo-finance2) (v3+):** Borsa verilerini çekmek için kullanılan açık kaynaklı sunucu tabanlı kütüphane. V3 olduğu için sınıf (`new YahooFinance()`) başlatılarak çağırılır.
5. **[Zustand](https://zustand-demo.pmnd.rs/):** Sayfalar arası ve yerel persist(kalıcı) durumu yöneten hafif durum yönetimi.
6. **[Framer Motion](https://www.framer.com/motion/):** Hisse senedi kartlarındaki zarif hover ve sayfa yüklenme animasyonları için kullanılır.
7. **[Lucide React](https://lucide.dev/):** SVG ikonların modern ve performanslı bir kütüphanesi.
8. **[TypeScript](https://www.typescriptlang.org/):** Proje tip güvenliğini (Type safety) sağlamak amacıyla oluşturulmuştur, API dönüş tipleri vs. statik olarak kontrol altındadır.

## Klasör Yapısı (Folder Structure)

- `/src/app/` : Next.js App Router sayfaları ve API yolları bulundurur.
- `/src/components/` : Tekrar kullanılabilir React bileşenleri (UI) barındırır. (`Header`, `StockCard` vs.)
- `/src/store/` : Zustand store ve kalıcı state mantığı yönetimi.
- `/src/types/` : TypeScript Interface ve Type tanımları (örn: `Stock`).
- `/src/theme/` : UI özelleştirme ve standart MUI Theme ayarları barındırır.
- `/src/data/` : Sabit veriler, listeler (Örn: BIST Sektör listesinin tamamı `bist-sectors.ts`).
- `/memory-bank/` : Proje dokümantasyonu, genel yapı özetleri.

## Geliştirme Ortamı & Kurulum

1. `npm install` komutu ile bağımlılıklar kurulur.
2. `npm run dev` ile proje yerel geliştirme ortamında başlatılabilir `localhost:3000`.
3. Proje dış bir API key'e ihtiyaç duymaz (Yahoo Finance community API scrape ederek çalışır, bu süreç otomatik ilerler).
