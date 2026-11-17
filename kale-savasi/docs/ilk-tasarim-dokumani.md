Konuşma boyunca şekillenen fikirlerini, vazgeçilen seçenekleri ve son olarak karar kıldığımız tam otonom TikTok canlı yayın oyununun tüm detaylarını içeren proje tasarım dokümanı (GDD & Teknik Mimari) aşağıdadır:

---

# Proje Dokümanı: Tam Otonom TikTok Canlı Yayın İnteraktif Kale Savaşı

## 1. Süreç Özeti: Ne İstedin ve Neye Karar Verdik?

* **Başlangıç İsteği:** TikTok canlı yayınlarına gelen yorumları ve hediyeleri (bağışları) gerçek zamanlı yakalayıp, bu etkileşimlere göre çalışan interaktif bir oyun geliştirmek.
* **Elenen Seçenekler:**
* Yayıncının kamerada/mikrofonda olduğu veya tek başına oynayıp izleyicilerin engellerle zorlaştırdığı modeller elendi.
* Ülke bayrakları tabanlı yarışma konsepti yerine ilk aşama için daha sade olan takım konseptine geçildi.


* **Nihai Karar:**
* **Sıfır İnsan Müdahalesi (Tam Otonom / AFK Yayın):** Yayıncının ekranda veya seste hiç olmadığı, oyunun kendi kendine sonsuz döngüde aktığı sistem.
* **"Çağlar Boyu Savaş" (Age of War) Konsepti:** Dikey ekranda **Kırmızı** ve **Mavi** olmak üzere iki kalenin birbirine sürekli otomatik NPC asker gönderdiği, yüksek canlı kalelerin yıkılmasına dayalı rekabetçi kapışma oyunu.
* **Kişiselleştirilmiş Bağış Etkisi:** Bağış atan izleyicilerin attığı hediyenin değerine göre sahaya özel birimler veya yetenekler inmesi ve bu birimlerin üzerinde **bağışçının adı ile profil fotoğrafının** görünmesi.
* **Kalıcı Rekabet:** Günlük ve haftalık en iyi oyuncuları ("Günün/Haftanın Elemanı") takip edip ekranda sergileyen liderlik tablosu sistemi.



---

## 2. Oyun Tasarım Kuralları (Game Design)

### A. Ekran Yerleşimi (9:16 Dikey – 1080x1920 Güvenli Alan)

TikTok yayın arayüzünün oyun alanını kapatmaması için sahne 3 yatay bölgeye ayrılır:

1. **Üst %15 (Pasif & Liderlik Alanı):** Gökyüzü/arka plan dokusu ve ekranın üst kısmında sabit duran **Günün Kralı** ile **Haftanın Kralı** rozetleri.
2. **Orta %60 (Ana Savaş Koridoru):**
* **Üst Sınır:** **Kırmızı Kale** (Yüksek HP barı + Kırmızı takım için atılması gereken hediye ikonları).
* **Orta Hat:** Askerlerin karşılıklı yürüyüp çarpıştığı dikey savaş yolu.
* **Alt Sınır:** **Mavi Kale** (Yüksek HP barı + Mavi takım için atılması gereken hediye ikonları).


3. **Alt %25 (TikTok Arayüz Alanı):** Canlı yayında izleyici yorumlarının ve hediye butonlarının kapladığı alan olduğu için buraya aktif savaş mekaniği konulmaz; sadece alttaki kalenin taş temeli ve dekoratif zemin yer alır.

### B. Oynanış ve Birim Hiyerarşisi

| Etkileşim Seviyesi | Tetikleyici | Sahaya İnen Birim / Etki | Görsel Sunum |
| --- | --- | --- | --- |
| **Otomatik Akış (AFK)** | Sistem zamanlayıcısı (Örn: her 3 sn) | **Temel Piyade** (Düşük can ve hasar) | İsimsiz standart NPC asker (Ekranın sürekli canlı kalmasını sağlar). |
| **Ücretsiz Etkileşim** | Chat'e takım komutu (`1`/`2`) veya Beğeni | **Milis / Okçu** (Kişi başı bekleme süreli) | Askerin üzerinde kullanıcının adı küçük fontla yazar. |
| **Mikro Bağış (1–10 Coin)** | Gül / TikTok vb. temel hediyeler | **Şövalye / Süvari** (Hızlı ve güçlü) | Askerin üzerinde **bağışçının profil fotoğrafı ve adı** yer alır. |
| **Orta Bağış (30–100 Coin)** | Orta seviye özel hediyeler | **Dev / Mancınık** (Alan hasarı ve yüksek kale hasarı) | Altın çerçeveli profil fotoğrafı, büyük karakter modeli ve özel ses efekti. |
| **Büyük Bağış (500+ Coin)** | Aslan / Evren vb. yüksek hediyeler | **Özel Yetenek (Meteor / Ejderha)** | Rakip koridordaki tüm birimleri temizler, rakip kaleye yüksek hasar verir, ekran titrer ve büyük anons çıkar. |

### C. Çağ Atlama ve Tur Döngüsü

* **Çağ Atlama:** Bir takım toplamda belirli bir bağış/puan barajına ulaştığında o takımın kalesi ve otomatik çıkan NPC askerleri çağ atlar (*Taş Devri $\rightarrow$ Orta Çağ $\rightarrow$ Modern Çağ $\rightarrow$ Fütüristik Çağ*).
* **Tur Bitişi ve Yeniden Başlama:** Kalelerden birinin canı `0`'a indiğinde kazanan takım için kutlama animasyonu/müziği tetiklenir, kaleye son vuruşu yapan oyuncuya ekstra liderlik puanı yazılır ve 5–10 saniyelik geri sayımın ardından yeni tur otomatik başlar.

### D. Liderlik Tablosu (Günün ve Haftanın Elemanı)

* Veritabanında her izleyicinin **toplam attığı coin**, **verdiği hasar** ve **kale yıkma (son vuruş)** istatistikleri saklanır.
* **Günün Elemanı:** Her gece `00:00`'da sıfırlanır; bir önceki günün birincisi ertesi gün boyunca ekranda sergilenir.
* **Haftanın Elemanı:** Her Pazartesi `00:00`'da sıfırlanır; haftalık en yüksek katkı sağlayan izleyici özel taç ikonuyla sabitlenir.

---

## 3. Teknik Mimari ve Teknoloji Yığını

Sistemin 7/24 kesintisiz, düşük kaynak tüketimiyle ve güncellenebilir şekilde çalışması için **iki katmanlı modüler yapı** planlanmıştır:

### Katman 1: Arka Plan Servisi (.NET 8 Web API / Worker + SignalR)

* **TikTok Bağlantısı:** `TikTokLiveSharp` kütüphanesi ile canlı yayına bağlanır. Seri hediyelerin (`repeatEnd`) mükerrer sayılmasını engeller.
* **Watchdog (Otomatik Yeniden Bağlanma):** Yayın akışı veya internet bağlantısı koptuğunda 3 saniyede bir otomatik tekrar bağlanarak yayının durmasını önler.
* **Veri Kalıcılığı:** Günlük/haftalık liderlik tablosu ve oyuncu istatistikleri için yerel **SQLite** veya **PostgreSQL** kullanır.
* **Test Simülatörü (Mock Panel):** Gerçek yayın açmadan sahte bağış, beğeni ve yorum tetikleyerek oyunu test etmeyi sağlayan geliştirici arayüzü içerir.
* **İletişim:** İşlenen tüm olayları standart JSON formatında (`SpawnUnit`, `CastUltimate`, `UpdateLeaderboard`) **SignalR** üzerinden oyun sahnesine iletir.

### Katman 2: Oyun Sahnesi (Vue 3 + HTML5 Canvas / PixiJS veya Phaser 3)

* **Yayın Çıktısı:** `1080x1920` çözünürlükte çalışır ve OBS Studio veya TikTok Live Studio'ya doğrudan **Browser Source (Tarayıcı Kaynağı)** olarak eklenir.
* **Oyun Mantığı:** Birimler yalnızca dikey (`Y`) ekseninde hareket eder; iki rakip birim arasındaki mesafe saldırı menzilinin altına düştüğünde durup birbirine hasar verir.
* **Bellek ve Ses Yönetimi:** Uzun süreli yayınlarda RAM şişmesini önlemek için elenen oyuncuların profil fotoğrafı dokuları bellekten düzenli temizlenir (LRU Cache). Her bağışta dinamik ses efektleri veya otomatik sesli okuma (TTS) tetiklenerek TikTok'un "etkileşimsiz/durağan yayın" filtresine takılmanın önüne geçilir.

---

### Bir Sonraki Adım

Bu dokümanı referans alarak geliştirmeye hazır olduğunda iki noktadan biriyle başlayabiliriz:

1. **.NET 8 Backend & TikTok Dinleyici:** `TikTokLiveSharp` bağlantısını, `SignalR` hub'ını ve sahte bağış test panelini içeren proje iskeletini oluşturmak.
2. **Oyun Sahnesi Prototipi:** İki kalenin, otomatik NPC akışının ve isim/profil fotoğrafı taşıyan birimlerin çarpıştığı temel 2D sahneyi kodlamak.