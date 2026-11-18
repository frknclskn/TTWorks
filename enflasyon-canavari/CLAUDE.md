# Proje notları (Claude için)

Kullanıcıyla Türkçe konuş. Ayrıntılar `README.md` içinde.

## Proje

TikTok canlı yayınında oynanan ortak düşman oyunu. Kale savaşının yerine değil yanına yapıldı; kullanıcı TikTok'un durağan içerikten hoşlanmadığını, iki takım yerine herkesin tek bir düşmana karşı birlikte oynamasını istedi.

## Alınmış kararlar

- **İki takım yok.** Herkes aynı tarafta, ortak düşman "Enflasyon Canavarı". Mizahi; gerçek kişi, parti ya da kurum adı kullanılmaz.
- **Sahne hiç durağan kalmamalı:** aşamalar, özel saldırılar, gece-gündüz, uçuşan sayılar, indirim çerçevesi.
- **Herhangi bir yorum** birim çıkarır (komut gerekmez), beğeniler ortak indirim barını doldurur.
- **Sesli okuma (TTS) yok**, kullanıcı adları okunmaz; her olayın kendi efekt sesi var, bilgiler ekranda yazıyla.
- İsimler okunur olmalı: koyu zeminli büyük etiketler, 12 karakter, çakışan gizlenir.
- **Sade yapı, veritabanı yok** (oturum boyunca bellekte). Büyük arka uç kodu ekleme.
- Telifli müzik yok; müzik Web Audio ile kodda üretiliyor.

## Mimari

- `oyun/index.html`: tek dosya, saf HTML/JS + Canvas. `/` panel + oyun, `/?yayin` OBS görünümü. Sunucudan açılınca panel olayları `POST /olay` ile sunucudan geçer.
- `sunucu.mjs`: kale-savasi/sunucu.mjs ile aynı (yalnızca başlık yazısı farklı). Birinde düzeltme yapılırsa diğerine de uygula.
- Gerçek TikTok kütüphanesiyle henüz test edilmedi; sahte modülle uçtan uca test edildi. İlk gerçek yayında sunucunun konsola yazdığı "İlk hediye verisi" ile alan adlarını doğrula.

## Denge değişikliği yaparken

`CFG` bloğunu değiştir, sonra hızlandırılmış testle ölç: `?hiz=30&bot=0`, `bot=0.3`, `bot=1`, her biri birkaç kez. Hedef: NPC modunda seviye 1–3 arasında gidip gelen 2,5–4 dk turlar; izleyiciyle ilerleme hissi; hiçbir senaryoda tek bir seviyede takılıp kalmamak.

## Sıradaki işler

1. Gerçek bir yayında test, hediye alanlarını doğrula.
2. Ses ve görsel cilası: kullanıcı geri bildirimiyle.
3. Profil fotoğrafı moderasyonu (uygunsuz fotoğrafı kapatma seçeneği).
