# Kale Savaşı — TikTok Canlı Yayın Oyunu

İzleyicilerin sohbet, beğeni ve hediyeleriyle yönettiği, dikey (9:16) ekranda iki kalenin (Kırmızı ve Mavi) birbirine asker gönderdiği bir canlı yayın oyunu.

## Durum

Prototip aşamasında. Oyun tarayıcıda çalışıyor ve test panelindeki sahte izleyicilerle oynanabiliyor. Henüz TikTok'a bağlı değil.

## Çalıştırma

`oyun/index.html` dosyasını Chrome'da açın. Sağdaki test panelinden ya da klavyeden olay gönderebilirsiniz:

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

## Dış olay arayüzü

Arka uç (TikTok dinleyici) her olayı sayfaya şu fonksiyonla iletecek:

```js
oyun.olay({ tip: 'hediye', kullanici: 'ayse', takim: 'red', coin: 1 })
oyun.olay({ tip: 'sohbet', kullanici: 'ali', metin: '2' })
oyun.olay({ tip: 'begeni', kullanici: 'can', adet: 15 })
```

## Yol haritası

- [ ] Node.js köprü programı (TikTok-Live-Connector → yerel WebSocket → oyun)
- [ ] Hediye adı → birim eşleme ayar dosyası, seri hediyelerin (`repeatEnd`) tek sayılması
- [ ] Gerçek profil fotoğrafları
- [ ] Kalıcı liderlik tablosu (SQLite), gece 00:00 ve Pazartesi sıfırlaması
- [x] Denge testi ve ayarı (kuleler, kuşatma, az kişili takım desteği)
- [ ] OBS'te 3–4 saatlik dayanıklılık testi
- [ ] Mancınık, Ejderha ve gerçek hediye listesine göre kademeler

## Yayın kurulumu (plan)

Oyun OBS'e Tarayıcı Kaynağı olarak (1080×1920) eklenir, OBS Sanal Kamera ile TikTok LIVE Studio'ya "Kamera" kaynağı olarak verilir. LIVE için hesapta en az 1.000 takipçi ve 18 yaş gerekir.

## Belgeler

- `docs/ilk-tasarim-dokumani.md` — projenin ilk tasarım dokümanı (GDD ve teknik mimari taslağı)
