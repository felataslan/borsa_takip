# Aktif Bağlam (Active Context)

## Son Yapılan Değişiklikler

- **BİST 30 & BİST 100 Sayfaları:** Borsa İstanbul'un ana endeksleri olan BİST 30 ve BİST 100 hisselerinin özel olarak listelendiği, filtrelenebildiği iki yeni sayfa (`/bist30`, `/bist100`) oluşturuldu ve navigasyona eklendi.
- **Filtreleme Özellikleri:** Ana sayfadaki hisse listesi için arama kutusu ve sektör bazlı dropdown filtresi eklendi (MUI tabanlı `TextField` ve `Select`).
- **Material UI Geçişi:** Proje genelinde Tailwind CSS bileşenlerinden, Material UI (`AppBar`, `Card`, `Container`, `Box`, `Typography`, vs.) yapısına geçildi. Karanlık tema (Dark Mode) renk paleti uyumlu şekilde entegre edildi.
- **Sektörel Gruplandırma:** API (sunucu tarafı) artık aldığı tüm BIST sembollerini statik bir JSON sözlüğü üzerinden ait oldukları sektöre atıyor, ardından istemciye dönüyor. Gelen hisse senetleri (arama filtresi uygulandıktan sonra) frontend üzerinde ait oldukları sektör başlığına göre gruplanarak görüntüleniyor.
- **Memory Bank:** Mevcut durumun anlaşılabilmesi adına projeye `memory-bank` klasörü ve detaylı dökümantasyon eklendi.

## Gelecek Planı veya Olası Eklemeler

- Arama kutusunun debounced (gecikmeli/optimize edilmiş) şekilde çalışması eklenebilir.
- Farklı para birimleri (USD, EUR) üzerinden veya hisse senedi teknik grafikleri (grafik/chart API üzerinden) gösterimi eklenebilir.
- Sık yenilenen verilerin optimizasyonu için `SWR` veya `React Query` gibi bir veri çekme (data fetching) kütüphanesi kullanılabilir.
