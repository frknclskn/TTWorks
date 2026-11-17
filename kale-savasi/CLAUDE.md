# Proje notları (Claude için)

Bu dosya, projeye yeni bir oturumda devam ederken bağlamı aktarmak içindir. Kullanıcıyla Türkçe konuş.

## Proje

TikTok canlı yayınında oynanan, izleyicilerin sohbet/beğeni/hediyeyle yönettiği dikey (1080×1920) kale savaşı oyunu. Ayrıntılar `README.md` içinde, ilk tasarım `docs/ilk-tasarim-dokumani.md` içinde (o dokümandaki bazı kararlar aşağıda değişti).

## Alınmış kararlar

- **Yayın çoğunlukla NPC modunda (AFK) dönecek.** Denge önce izleyicisiz/az izleyicili duruma göre ayarlandı.
- **Meteor kaleye hasar vermez**, sadece rakip birimleri siler.
- **Sesli okuma (TTS) yok.** Kullanıcı yapay ses ve kullanıcı adlarının okunmasını istemedi. Onun yerine her birimin kendi sesi var; bilgiler ekranda yazıyla (ipucu şeridi) veriliyor.
- **İsimler okunur olmalı:** koyu zeminli büyük etiketler, 12 karakter sınırı, çakışan etiketler gizlenir, dev etiketi her zaman görünür.
- **Hediye eşlemesi şimdilik coin değerine göre** (1–29 şövalye, 30–499 dev, 500+ meteor). Gerçek hediye adlarına göre ayar dosyası planlanıyor. Not: Aslan ~29.999, Galaxy ~1.000, Doughnut ~30, Hand Hearts ~100 coin.
- Telifli müzik kullanılmayacak; müzik Web Audio ile kodda üretiliyor.

## Mimari

- `oyun/index.html`: tek dosya, saf HTML/JS + Canvas. Dış olay girişi: `window.oyun.olay({tip, kullanici, takim, coin|metin|adet})`. Test/denge için `oyun.durum()` ve `?hiz=&bot=&can=` URL parametreleri.
- Planlanan köprü: Node.js + TikTok-Live-Connector (zerodytrash) → yerel WebSocket → oyun sayfası. Oyun sayfası OBS'te yerel dosya ya da `localhost` adresi olarak açılacak (claude.ai artifact sayfası dış bağlantıya izin vermiyor).
- Yayın: OBS Tarayıcı Kaynağı → OBS Sanal Kamera → TikTok LIVE Studio'da "Kamera" kaynağı (LIVE Studio'nun kendi Link kaynağı Canvas animasyonlarında takılabiliyor).

## Sıradaki işler

1. Node.js köprü programı + hediye eşleme ayar dosyası (`repeatEnd` ile seri hediyeleri tek say).
2. Gerçek profil fotoğrafları.
3. Kalıcı liderlik tablosu (SQLite), 00:00 ve Pazartesi sıfırlaması.
4. Bilinen küçük görsel sorun: kırmızı kale kapısına dayanan birimlerin profil fotoğrafı kale yazılarının üstüne binebiliyor.

## Denge değişikliği yaparken

Değeri değiştirdikten sonra hızlandırılmış testle ölç: `?hiz=30&bot=0` (sadece NPC), `bot=0.3` ve `bot=1`. Hedef: NPC'de 5–8 dk, izleyiciyle 3–5 dk tur; eşit takımlarda kazananlar yaklaşık yarı yarıya.
