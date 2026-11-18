# Enflasyon Canavarı — TikTok Canlı Yayın Oyunu

Bütün izleyicilerin aynı tarafta olduğu, dikey (9:16) ekranda oynanan ortak düşman oyunu. Tepedeki dev canavar zam etiketi ve fatura askerleri gönderip **Halkın Kumbarası**'nı boşaltmaya çalışır; izleyiciler yorum, beğeni ve hediyeyle canavarı yenmeye çalışır.

## Çalıştırma

**Gerekli:** [Node.js](https://nodejs.org) 18 veya üstü (LTS sürümü).

1. Windows'ta `baslat.bat` dosyasına çift tıklayın. İlk seferde paketleri kurar, sonra sunucuyu başlatıp yönetim panelini açar. (Diğer sistemlerde: `npm install`, sonra `npm start`.)
2. **http://localhost:8080** yönetim paneli. "TikTok bağlantısı" kutusuna yayıncının kullanıcı adını yazıp **Bağlan**'a basın.
3. OBS'e **Tarayıcı Kaynağı** ekleyin: `http://localhost:8080/?yayin`, 1080 × 1920. Bu görünümde panel yok.

Paneldeki test butonları sunucu üzerinden gider, OBS'teki oyunda da görünür. Panel ve OBS sayfası oyunu ayrı ayrı çalıştırır; aynı olayları alırlar ama rastgelelik yüzünden sayılar biraz farklı olabilir. Yayına çıkan OBS sayfasıdır, panel önizlemedir.

Euler API anahtarı isteğe bağlıdır ama önerilir (ücretsiz, [eulerstream.com](https://www.eulerstream.com)).

Veritabanı yok: puanlar ve liderlik tablosu sayfa açık kaldıkça bellekte durur.

`oyun/index.html` doğrudan dosya olarak da açılabilir; o zaman sadece test paneli ve sahte izleyicilerle çalışır.

## Oyun kuralları

| İzleyici ne yapar | Ne olur |
| --- | --- |
| Herhangi bir yorum (kişi başı 5 sn bekleme) | İzleyicinin adıyla bir **vatandaş** canavara koşar |
| Beğeni | Ortak **İNDİRİM barını** doldurur; 200 beğenide 15 sn **BÜYÜK İNDİRİM**: tüm hasar 2 kat |
| 1–29 coin | **Esnaf** (her 10 coin'e +1, en fazla 5), profil fotoğrafıyla |
| 30–99 coin | **Market arabası**: dayanıklı, alan hasarı |
| 100–999 coin | **Faiz topu**: kumbaradan canavara 5 gülle, canavar canının ~%6'sı |
| 1.000–9.999 coin | **Maaş zammı**: tüm zam etiketleri silinir, canavar canının %15'i, 10 sn indirim |
| 10.000+ coin | **Büyük ikramiye**: canavar canının %30'u, kumbara tamamen dolar, 20 sn indirim |

Her hediye ayrıca kumbaraya coin × 10 para ekler.

**Canavar tarafı**

- Sürekli **zam etiketi** ve **fatura** askerleri gönderir; kumbaraya ulaşan asker kumbarayı boşaltır.
- **Zam oranı** her dakika %10 artar; canavarın askerleri o oranda güçlenir.
- Dibine gelen birimleri **ısırır** (alan hasarı).
- Canı %66 ve %33'e inince **öfkelenir / çıldırır**: büyür, parlar, askerleri sıklaşır.
- 22–36 saniyede bir **özel saldırı** yapar, 2 saniye önceden uyarır: **Zam Yağmuru** (gökten etiket düşer), **Fatura Dalgası** (6 asker birden), **Kur Şoku** (ordumuz 8 sn yavaşlar).

**Bizim taraf**

- NPC vatandaşlar 2,4 saniyede bir kendiliğinden çıkar (izleyicisiz yayın için).
- **Kumbara** yaklaşan düşmana bozuk para atar.
- Sökülen her zam etiketi canavara da hasar verir; yani sokakta savaşmak da canavarı eritir.

**Seviyeler:** Canavar yenilirse sonraki seviyede daha güçlü (%20) yeni bir canavar gelir: Zam Canavarı → Fatura Ejderi → Kira Devi → Market Fiyatı Golemi → Akaryakıt Ahtapotu → Hiperenflasyon → (başa döner). Kumbara boşalırsa **İFLAS** olur ve bir seviye geri düşülür. Canavarın canı tur başındaki aktif izleyici sayısıyla en fazla 2,5 katına çıkar.

**Liderlik:** puan = coin × 10 + verilen hasar / 10 + son vuruş × 500. Ekranda "Günün Kahramanı" ve "Haftanın Kahramanı".

**Sahne hiç durmaz:** gece-gündüz döngüsü (~4 dk), yanıp sönen şehir pencereleri, uçuşan hasar rakamları, canavarın göbeğinde yükselen fiyat, gözleriyle birimleri izlemesi, öfke aşamalarında kırmızı kenar ve buhar, indirimde altın çerçeve.

Ayar değerleri `oyun/index.html` içinde `/* --- Denge ayarları --- */` bölümünde (`CFG`).

## Denge testi

`?hiz=30` (30 kat hız), `&bot=0.3` (sahte izleyici yoğunluğu, 0 = sadece NPC), `&can=18000` (1. seviye canavar canı). Konsolda `oyun.durum()` seviyeleri, süreleri ve sonuçları verir.

Son ölçüm (18 Kasım 2026, 30x hızla):

| Senaryo | Tur süresi | Ne oluyor |
| --- | --- | --- |
| Sadece NPC | ~2,5–3 dk | Seviye 1–3 arasında gidip geliyor; zafer ve iflas karışık, kumbara çoğu zaman %5–40 ile bitiyor |
| Az izleyici (bot=0.3) | ~3–4 dk | Seviye 1–4 arasında |
| Çok izleyici (bot=1) | ~2–5 dk | Seviye 7–8'e kadar çıkıyor |

## Mimari

Kale savaşıyla aynı: `sunucu.mjs` (tek dosya, tek bağımlılık `tiktok-live-connector`) oyunu sunar, TikTok olaylarını Server-Sent Events ile sayfaya iletir.

```js
oyun.olay({ tip: 'sohbet', kullanici: 'ali', metin: 'merhaba' })
oyun.olay({ tip: 'begeni', kullanici: 'can', adet: 15 })
oyun.olay({ tip: 'hediye', kullanici: 'ayse', hediye: 'Rose', coin: 1, foto: 'https://…' })
oyun.olay({ tip: 'komut', ad: 'kazan' })   // 'iflas', 'gunu-sifirla'
```

## Klavye kısayolları (panelde)

Q yorum · L 10 beğeni · W 1 coin · E 30 coin · R 100 coin · T 1.000 coin · Y 10.000 coin · M ses
