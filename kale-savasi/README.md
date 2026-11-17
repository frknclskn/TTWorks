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
| 500+ coin | Meteor: rakip birimleri siler, kaleye 1.500 hasar |

- Kale canı 10.000. Biri sıfırlanınca 8 saniye sonra yeni tur başlar.
- Takımlar coin topladıkça çağ atlar: Taş Devri → Orta Çağ (300) → Modern Çağ (1.200) → Fütüristik Çağ (3.000). Çağlar her turda sıfırlanır.
- Kalesi rakipten %25'ten fazla geride kalan takımın NPC'leri daha sık çıkar.
- İzleyici ilk yazdığı takıma kilitlenir.
- Uygunsuz kullanıcı adları ekranda "izleyici" olarak görünür (`YASAK` listesi genişletilmeli).
- Ses: kodla üretilen müzik ve birim sesleri. Sesli okuma (TTS) bilinçli olarak yok.

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
- [ ] Denge testi (hedef tur süresi 5–10 dk)
- [ ] OBS'te 3–4 saatlik dayanıklılık testi
- [ ] Mancınık, Ejderha ve gerçek hediye listesine göre kademeler

## Yayın kurulumu (plan)

Oyun OBS'e Tarayıcı Kaynağı olarak (1080×1920) eklenir, OBS Sanal Kamera ile TikTok LIVE Studio'ya "Kamera" kaynağı olarak verilir. LIVE için hesapta en az 1.000 takipçi ve 18 yaş gerekir.

## Belgeler

- `docs/ilk-tasarim-dokumani.md` — projenin ilk tasarım dokümanı (GDD ve teknik mimari taslağı)
