# Gelişim Durumu (Progress)

## Tamamlanan Özellikler:

- [x] Temel Next.js proje yapısının oluşturulması
- [x] (V3 güncellenmesi dahil) `yahoo-finance2` entegrasyonu ve Next.js API endpoint ile veri alınması
- [x] ~120 hisseden oluşan BİST verisinin sektörlerine (`BIST_SECTORS`) göre ayrıştırılması
- [x] Tamamen özelleştirilmiş, modern "Dark Mode" odaklı bir Material UI (MUI) teması ve bileşen tabanlı altyapı oluşturulması
- [x] MUI Grid yapısına entegre edilmiş, Framer Motion destekli estetik hisse başlıkları (StockCard)
- [x] LocalStorage ve Zustand kullanılarak "Favoriler" sayfası (Bireysel listeye hisse ekleyip çıkarma)
- [x] Ana sayfada kullanıcı arama deneyimini güçlendirmek için kelime ve sektöre göre filtreleme
- [x] BİST 30 ve BİST 100 endekslerine ait listelerin çekilmesi ve menüden kendilerine özel dizinlere (`/bist30`, `/bist100`) yönlendirilmesi.
- [x] Memory Bank dökümantasyonunun oluşturulması

## Bekleyen/İlerleyen Aşamalar (To Do / Backlog):

- [ ] Olası bir detay sayfasına gidilerek hisse içi çizgi grafiklerinin (charts) veya detaylı bilançonun gösterilmesi.
- [ ] Gecikmeli kote edilen (15 dakika) verinin, "Son Güncellenme Saati" gibi uyarı veya bilgi bariyerleriyle kullanıcıya yansıtılması.
- [ ] Uygulamanın performans metriklerinin test edilip Vercel'e (ya da statik hostlara) dağıtılması.
