// Kale Savaşı köprü sunucusu
// TikTok canlı yayınını dinler, olayları oyun sayfasına iletir. Veritabanı yok, her şey bellekte.
// Çalıştırma: npm install (bir kez), sonra npm start → http://localhost:8080
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TikTokLiveConnection, WebcastEvent, ControlEvent } from 'tiktok-live-connector';

const KLASOR = path.dirname(fileURLToPath(import.meta.url));
const PORT = +process.env.PORT || 8080;
const istemciler = new Set();          // sayfaya açık olay akışları (Server-Sent Events)
const durum = { baglanti: 'kapali', kullanici: '', olay: 0, mesaj: '' };
let conn = null, istenen = null, anahtar = process.env.EULER_KEY || '', tekrarZaman = null, ilkHediye = true;

function yayinla(o) {
  const s = `data: ${JSON.stringify(o)}\n\n`;
  for (const r of istemciler) r.write(s);
}
function guncelle(p) {
  Object.assign(durum, p);
  yayinla({ tip: 'durum', ...durum });
  if (p.mesaj) console.log(`[${new Date().toLocaleTimeString('tr-TR')}] ${p.mesaj}`);
}
// Kullanıcı adı ve profil fotoğrafı; kütüphane sürümleri arasında alan adları değişebildiği için birkaç yere bakıyoruz
function kisi(d) {
  const u = d.user || d;
  return {
    kullanici: u.uniqueId || u.nickname || 'izleyici',
    foto: u.profilePicture?.url?.[0] ?? u.profilePicture?.urls?.[0] ?? u.profilePictureUrl ?? u.avatarThumb?.urlList?.[0] ?? null,
  };
}

async function baglan() {
  clearTimeout(tekrarZaman);
  if (!istenen) return;
  if (conn) { try { conn.disconnect(); } catch {} conn = null; }
  guncelle({ baglanti: 'baglaniyor', kullanici: istenen, mesaj: `@${istenen} yayınına bağlanılıyor…` });
  const c = new TikTokLiveConnection(istenen, { signApiKey: anahtar || undefined, enableExtendedGiftInfo: true });
  conn = c;

  c.on(WebcastEvent.CHAT, d => { durum.olay++; yayinla({ tip: 'sohbet', ...kisi(d), metin: String(d.comment || '') }); });
  c.on(WebcastEvent.LIKE, d => { durum.olay++; yayinla({ tip: 'begeni', ...kisi(d), adet: d.likeCount || 1 }); });
  c.on(WebcastEvent.GIFT, d => {
    const det = d.giftDetails || {};
    if (det.giftType === 1 && !d.repeatEnd) return; // seri hediye sürüyor; bittiğinde toplamı bir kez say
    if (ilkHediye) { ilkHediye = false; console.log('İlk hediye verisi (alan adlarını kontrol için):', JSON.stringify(d).slice(0, 1500)); }
    const elmas = det.diamondCount ?? d.diamondCount ?? d.extendedGiftInfo?.diamond_count ?? 1;
    durum.olay++;
    yayinla({ tip: 'hediye', ...kisi(d), hediye: det.giftName || d.giftName || 'hediye', coin: elmas * (d.repeatCount || 1) });
  });
  c.on(WebcastEvent.STREAM_END, () => {
    c.bitti = true;
    guncelle({ baglanti: 'yayin-yok', mesaj: 'Yayın bitti. 15 sn sonra tekrar denenecek.' });
    tekrar(15000);
  });
  c.on(ControlEvent.DISCONNECTED, () => {
    if (conn !== c || !istenen || c.bitti) return;
    guncelle({ baglanti: 'koptu', mesaj: 'Bağlantı koptu, 3 sn sonra yeniden bağlanılıyor.' });
    tekrar(3000);
  });

  try {
    const st = await c.connect();
    if (conn !== c) return;
    guncelle({ baglanti: 'bagli', mesaj: `@${istenen} yayınına bağlandı (oda ${st.roomId}).` });
  } catch (e) {
    if (conn !== c) return;
    const kapali = /offline/i.test(`${e?.name} ${e?.message}`);
    guncelle({
      baglanti: kapali ? 'yayin-yok' : 'hata',
      mesaj: kapali ? `@${istenen} şu an yayında değil. 15 sn sonra tekrar denenecek.`
                    : `Bağlanamadı: ${e?.message || e}. 10 sn sonra tekrar denenecek.`,
    });
    tekrar(kapali ? 15000 : 10000);
  }
}
function tekrar(ms) { clearTimeout(tekrarZaman); if (istenen) tekrarZaman = setTimeout(baglan, ms); }
function kes() {
  istenen = null; clearTimeout(tekrarZaman);
  if (conn) { try { conn.disconnect(); } catch {} conn = null; }
  guncelle({ baglanti: 'kapali', mesaj: 'Bağlantı kapatıldı.' });
}

const govde = req => new Promise(r => {
  let b = '';
  req.on('data', c => { b += c; if (b.length > 1e5) req.destroy(); });
  req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch { r({}); } });
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(await readFile(path.join(KLASOR, 'oyun', 'index.html')));
  } else if (url.pathname === '/olaylar') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`data: ${JSON.stringify({ tip: 'durum', ...durum })}\n\n`);
    istemciler.add(res);
    req.on('close', () => istemciler.delete(res));
  } else if (req.method === 'POST' && url.pathname === '/baglan') {
    const b = await govde(req);
    istenen = String(b.kullanici || '').trim().replace(/^@/, '') || null;
    if (b.anahtar) anahtar = String(b.anahtar).trim();
    ilkHediye = true; baglan(); res.end('{}');
  } else if (req.method === 'POST' && url.pathname === '/kes') {
    kes(); res.end('{}');
  } else if (req.method === 'POST' && url.pathname === '/olay') {
    yayinla(await govde(req)); res.end('{}');   // test paneli ve komutlar: tüm açık sayfalara ilet
  } else { res.writeHead(404); res.end(); }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Kale Savaşı hazır.\n  Yönetim paneli: http://localhost:${PORT}\n  OBS adresi:     http://localhost:${PORT}/?yayin`);
});

// Bağlantıları canlı tut ve olay sayacını panele gönder
setInterval(() => yayinla({ tip: 'durum', ...durum }), 2000);
