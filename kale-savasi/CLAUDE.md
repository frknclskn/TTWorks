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

- Kullanıcı **sade bir yapı** istiyor: tek küçük Node sunucusu, her şey tek web sayfasından yönetilsin, **veritabanı yok** (veriler oturum boyunca bellekte, sonra silinir). Büyük arka uç kodu ekleme.
- `sunucu.mjs`: tek dosya, tek bağımlılık (`tiktok-live-connector`). Oyunu sunar, TikTok'a bağlanır, olayları Server-Sent Events ile sayfalara iletir; ws paketi kullanılmıyor. 127.0.0.1'e bağlanır.
- `oyun/index.html`: tek dosya, saf HTML/JS + Canvas. `/` = yönetim paneli + oyun, `/?yayin` = OBS görünümü (panelsiz). Sunucudan açılınca panel butonları `POST /olay` ile sunucudan geçer ki OBS sayfası da görsün. Dosya olarak açılınca tek başına çalışır.
- Test/denge için `oyun.durum()` ve `?hiz=&bot=&can=` URL parametreleri.
- Yayın: OBS Tarayıcı Kaynağı → OBS Sanal Kamera → TikTok LIVE Studio'da "Kamera" kaynağı.
- Gerçek TikTok kütüphanesiyle henüz test edilmedi (geliştirme ortamında ağ kapalıydı); sahte bir kütüphaneyle uçtan uca test edildi. Hediye alanları (`giftDetails.diamondCount` vb.) ilk gerçek yayında sunucu konsoluna yazılan veriyle doğrulanmalı.

## Sıradaki işler

1. Gerçek bir yayına bağlanıp hediye/kullanıcı alanlarını doğrula, gerekirse `sunucu.mjs` içindeki `kisi()` ve hediye bölümünü düzelt.
2. Hediye adı → birim eşlemesi (şimdilik coin değerine göre; `GIFT_TEAM` sadece takım için).
3. Bilinen küçük görsel sorun: kırmızı kale kapısına dayanan birimlerin profil fotoğrafı kale yazılarının üstüne binebiliyor.
4. Profil fotoğrafı moderasyonu: uygunsuz fotoğrafları kapatma seçeneği.

## Denge değişikliği yaparken

Değeri değiştirdikten sonra hızlandırılmış testle ölç: `?hiz=30&bot=0` (sadece NPC), `bot=0.3` ve `bot=1`. Hedef: NPC'de 5–8 dk, izleyiciyle 3–5 dk tur; eşit takımlarda kazananlar yaklaşık yarı yarıya.
