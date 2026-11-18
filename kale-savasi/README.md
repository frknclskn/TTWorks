# Kale Savaşı — TikTok Canlı Yayın Oyunu

İzleyicilerin sohbet, beğeni ve hediyeleriyle yönettiği, dikey (9:16) ekranda iki kalenin (Kırmızı ve Mavi) birbirine asker gönderdiği bir canlı yayın oyunu.

## Durum

Prototip aşamasında. Oyun tarayıcıda çalışıyor ve test panelindeki sahte izleyicilerle oynanabiliyor. Henüz TikTok'a bağlı değil.

## Çalıştırma

**Gerekli:** [Node.js](https://nodejs.org) 18 veya üstü (LTS sürümü).

1. Windows'ta `baslat.bat` dosyasına çift tıklayın. İlk seferde paketleri kurar, sonra sunucuyu başlatıp yönetim panelini açar.
   (Diğer sistemlerde: `npm install`, sonra `npm start`.)
2. Tarayıcıda açılan **http://localhost:8080** yönetim paneli. "TikTok bağlantısı" kutusuna yayıncının kullanıcı adını yazıp **Bağlan**'a basın.
3. OBS'e **Tarayıcı Kaynağı** ekleyin: adres `http://localhost:8080/?yayin`, genişlik 1080, yükseklik 1920. Bu görünümde panel yok, sadece oyun var.

Paneldeki test butonları da sunucu üzerinden gider, yani OBS'teki oyunda da görünür. Sahte izleyiciler sunucu modunda varsayılan olarak kapalıdır.

Euler API anahtarı isteğe bağlıdır ama önerilir (ücretsiz, [eulerstream.com](https://www.eulerstream.com)); anahtarsız bağlantı sık sınırlanır. Panelden girilebilir ya da `EULER_KEY` ortam değişkeniyle verilebilir.

Veritabanı yok: puanlar ve liderlik tablosu sayfa açık kaldıkça bellekte durur, sayfa ya da sunucu kapanınca silinir.

`oyun/index.html` doğrudan dosya olarak da açılabilir; o zaman TikTok bağlantısı olmadan, sadece test paneli ve sahte izleyicilerle çalışır.

### Klavye kısayolları (panelde)

| Tuş | Olay |
| --- | --- |
| Q / A | Kırmızı / Mavi için sohbete "1" / "2" yaz (okçu) |
| W / S | 1 coin hediye (şövalye) |
| E / D | 30 coin hediye (dev) |
| R / F | 500 coin hediye (meteor) |
| L | 10 beğeni |
| M | Sesi başlat |

## Oyun kuralları (şu anki hali)

| Tetikleyici | Birim |
| --- | --- |
| Zamanlayıcı (3 sn) | Piyade (isimsiz NPC) |
| Sohbete "1" / "2" (kişi başı 5 sn bekleme) | Okçu |
| Her 20 beğeni | Okçu |
| 1–29 coin | Şövalye (her 10 coin'e +1, en fazla 5) |
| 30–499 coin | Dev |
| 500+ coin | Meteor: rakibin sahadaki tüm birimlerini siler, **kaleye hasar vermez** |

- **Kale canı:** izleyici yokken 20.000. Tur başında aktif izleyici sayısına göre en fazla 3 katına (60.000) çıkar, kalabalık yayında turlar kısalmasın diye.
- **Kale kuleleri:** her kale, kapısına 320 px'ten yakın düşmana saniyede bir ok atar. Kapıya yığılıp kaleyi hızla yıkmayı (kartopu etkisi) engeller.
- **Kuşatma:** tur 4 dakikayı geçince kale hasarı her dakika %50 artar, kuleler yavaşlar. Turlar sonsuza uzamaz.
- **Az kişili takıma destek:** son 2 dakikada aktif izleyici sayısı az olan takımın NPC'leri daha sık çıkar (en fazla 2 kat), izleyici birimleri daha güçlü olur (oranın karekökü kadar). Takım seçmemiş izleyicinin beğenileri az kişili takıma gider.
- **Geride kalana destek:** kalesi rakipten %25'ten fazla geride olan takımın NPC'leri daha sık çıkar.
- Takımlar coin topladıkça çağ atlar: Taş Devri → Orta Çağ (300) → Modern Çağ (1.200) → Fütüristik Çağ (3.000). Çağlar her turda sıfırlanır.
- İzleyici ilk yazdığı takıma kilitlenir.
- Uygunsuz kullanıcı adları ekranda "izleyici" olarak görünür (`YASAK` listesi genişletilmeli).
- Ses: kodla üretilen müzik ve birim sesleri. Sesli okuma (TTS) bilinçli olarak yok.

Ayar değerleri `oyun/index.html` içinde `/* --- Denge ayarları --- */` bölümünde.

## Denge testi

Oyun adresine parametre eklenerek hızlandırılmış test yapılabilir:

- `?hiz=30` oyunu 30 kat hızlı oynatır
- `&bot=0.3` sahte izleyici yoğunluğu (0 = sadece NPC, 1 = çok hareketli yayın)
- `&can=20000` temel kale canı

Tarayıcı konsolunda `oyun.durum()` turların sürelerini ve kazananları verir.

Son ölçüm (17 Kasım 2026, 30x hızla):

| Senaryo | Ortanca tur süresi | Kazananlar |
| --- | --- | --- |
| Sadece NPC (4 deneme, 28 tur) | ~7 dk | Kırmızı 16 – Mavi 12 |
| Az izleyici (bot=0.3) | ~4 dk | takım sayıları dengesizken de iki taraf kazanabiliyor |
| Çok izleyici (bot=1) | ~3 dk | 8'e 7 takımda başa baş; 9'a 6 takımda büyük takım hafif önde |

## Mimari

```
TikTok canlı yayın
   ↓  tiktok-live-connector (+ Euler imza servisi)
sunucu.mjs  — tek dosya, http://localhost:8080
   ↓  Server-Sent Events (/olaylar)
oyun/index.html — panel (/) ve OBS görünümü (/?yayin)
```

Sunucu uç noktaları: `GET /` oyun, `GET /olaylar` olay akışı, `POST /baglan {kullanici, anahtar}`, `POST /kes`, `POST /olay` (test olayı ya da komut; tüm açık sayfalara iletilir). Sunucu yalnızca bu bilgisayardan (127.0.0.1) erişilebilir.

Olay biçimi:

```js
oyun.olay({ tip: 'hediye', kullanici: 'ayse', hediye: 'Rose', coin: 1, foto: 'https://…' })
oyun.olay({ tip: 'sohbet', kullanici: 'ali', metin: '2' })
oyun.olay({ tip: 'begeni', kullanici: 'can', adet: 15 })
oyun.olay({ tip: 'komut', ad: 'turu-bitir' })   // ya da 'gunu-sifirla'
```

Hediyenin takımı: izleyicinin kilitli takımı → yoksa hediye adı (`GIFT_TEAM`: Rose → Kırmızı, TikTok → Mavi) → yoksa az kişili takım. Seri hediyeler (`repeatEnd`) bitince bir kez, toplam adetle sayılır.

## Yol haritası

- [x] Node.js köprü sunucusu (`sunucu.mjs`) ve tek sayfadan yönetim
- [ ] Gerçek bir yayında test: hediye verisindeki alan adlarını doğrula (sunucu ilk hediyeyi konsola yazar)
- [x] Seri hediyelerin (`repeatEnd`) tek sayılması
- [x] Gerçek profil fotoğrafları (gelen adresten yüklenir, yoksa baş harfler)
- [x] Denge testi ve ayarı (kuleler, kuşatma, az kişili takım desteği)
- [ ] OBS'te 3–4 saatlik dayanıklılık testi
- [ ] Mancınık, Ejderha ve gerçek hediye listesine göre kademeler

## Yayın kurulumu (plan)

Oyun OBS'e `http://localhost:8080/?yayin` adresiyle Tarayıcı Kaynağı olarak (1080×1920) eklenir, OBS Sanal Kamera ile TikTok LIVE Studio'ya "Kamera" kaynağı olarak verilir. LIVE için hesapta en az 1.000 takipçi ve 18 yaş gerekir.

## Belgeler

- `docs/ilk-tasarim-dokumani.md` — projenin ilk tasarım dokümanı (GDD ve teknik mimari taslağı)
