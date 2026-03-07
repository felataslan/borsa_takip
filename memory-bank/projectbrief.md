# Proje Özeti (Project Brief)

## Proje Adı

Borsa Takip Uygulaması

## Temel İşlev

Borsa İstanbul (BİST) hisselerini takip etmek, güncel fiyat ve değişim oranlarını sektörlere göre gruplandırarak listelemek ve kullanıcının kişisel favori hisselerini kaydedip izleyebilmesini sağlamak.

## Ana Özellikler

1. **Canlı(ya yakın) Veri:** `yahoo-finance2` kütüphanesi üzerinden BİST hisselerinin (15 dk gecikmeli) güncel fiyat verilerinin çekilmesi.
2. **Sektörel Gruplama:** 120'den fazla önemli BİST hissesinin "Bankacılık", "Holding", "Otomotiv", "Enerji" gibi mantıksal sektör grupları altında gösterilmesi.
3. **Endeks Takibi:** BİST 30 ve BİST 100 endekslerine ait hisselerin kendilerine ait özel sayfalarda direkt listelenebilmesi.
4. **Filtreleme & Arama:**
   - Hisse adı veya sembolü ile metin araması.
   - Belirli bir sektöre göre filtreleme yapabilen açılır menü.
5. **Favori Yönetimi:**
   - İstenilen hisselerin "Yıldız" ikonuna tıklanarak favorilere eklenmesi/çıkarılması.
   - Favorilerin tarayıcı üzerinde (Zustand ve LocalStorage ile) kalıcı olarak saklanması.
6. **Modern Arayüz:** Material UI (MUI) ve Framer Motion kullanılarak geliştirilmiş, animasyonlu, karanlık mod (dark mode) odaklı, şık ve duyarlı tasarım.

## Hedef Kitle

Borsa İstanbul'daki güncel fiyat hareketlerini temiz, reklamsız ve modern bir arayüzden takip etmek isteyen bireysel yatırımcılar.
