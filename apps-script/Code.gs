/**
 * GOOGLE APPS SCRIPT — penghubung Google Sheet "THE WEDDING'S" dengan website undangan.
 *
 * Fungsi:
 *  1. Menu "💌 Undangan" di Google Sheet → isi otomatis kolom "Link Undangan" & "Link WhatsApp"
 *     untuk setiap tamu di tab daftar tamu.
 *  2. Endpoint Web App untuk website:
 *       GET  ?action=wishes              → daftar ucapan (publik, untuk ditampilkan di undangan)
 *       GET  ?action=guests&key=RAHASIA  → daftar tamu (khusus halaman admin/generator)
 *       POST {action:"rsvp", ...}        → simpan ucapan & konfirmasi kehadiran ke tab "Ucapan"
 *
 * Cara pasang: lihat PANDUAN.md bagian 3.
 */

// ===================== PENGATURAN — EDIT DI SINI =====================
const SETTINGS = {
  // Alamat website undangan di hosting Anda (tanpa tanda ? di akhir)
  BASE_URL: 'https://solidus-ui.github.io/undangan/',

  // Nama tab yang berisi daftar tamu (sesuai tab di Sheet Anda)
  GUEST_SHEETS: ['List Undangan', 'Undangan Kantor', 'Undangan Taufik'],

  // Tab untuk menyimpan ucapan/RSVP (dibuat otomatis jika belum ada)
  RSVP_SHEET: 'Ucapan',

  // Kunci rahasia untuk halaman admin (ganti dengan kata acak!)
  ADMIN_KEY: 'ganti-dengan-kunci-rahasia-anda',

  // Kode acara default per tab jika kolom "Acara" kosong ('' = tampilkan semua acara)
  DEFAULT_EVENT_BY_SHEET: { 'List Undangan': '', 'Undangan Kantor': '', 'Undangan Taufik': '' },

  // Template pesan WhatsApp. {nama} dan {link} akan diganti otomatis.
  WA_TEMPLATE:
    'Assalamu\'alaikum Wr. Wb.\n\nKepada Yth.\n*{nama}*\n\n' +
    'Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\n' +
    'Info lengkap acara dapat dilihat melalui tautan berikut:\n{link}\n\n' +
    'Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n' +
    'Wassalamu\'alaikum Wr. Wb.\n\nKami yang berbahagia,\n*Niken & Taufik*'
};

// Pola nama kolom yang dikenali (tidak peka huruf besar/kecil)
const COLS = {
  nama:  /^(nama|nama tamu|name|tamu)\b/i,
  wa:    /(wa|whatsapp|no\.?\s*hp|hp|telp|telepon|phone|kontak)/i,
  acara: /^(acara|lokasi|kota|sesi|event)\b/i,
  link:  /^link undangan$/i,
  walink:/^link whatsapp$/i
};

// ===================== MENU DI GOOGLE SHEET =====================
function onOpen() {
  SpreadsheetApp.getUi().createMenu('💌 Undangan')
    .addItem('Buat / perbarui link semua tamu', 'generateLinks')
    .addItem('Siapkan tab Ucapan', 'setupRsvpSheet')
    .addToUi();
}

/** Menulis kolom "Link Undangan" & "Link WhatsApp" di setiap tab tamu. */
function generateLinks() {
  const ss = SpreadsheetApp.getActive();
  let total = 0;
  SETTINGS.GUEST_SHEETS.forEach(function (name) {
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const info = readGuestSheet_(sh);
    if (!info) return;
    let linkCol = info.cols.link, waCol = info.cols.walink;
    const lastCol = sh.getLastColumn();
    if (linkCol == null) { linkCol = lastCol; sh.getRange(info.headerRow + 1, linkCol + 1).setValue('Link Undangan').setFontWeight('bold'); }
    if (waCol == null) { waCol = Math.max(lastCol, linkCol + 1); sh.getRange(info.headerRow + 1, waCol + 1).setValue('Link WhatsApp').setFontWeight('bold'); }
    info.guests.forEach(function (g) {
      const link = buildLink_(g.nama, g.acara || SETTINGS.DEFAULT_EVENT_BY_SHEET[name] || '');
      sh.getRange(g.row, linkCol + 1).setValue(link);
      const msg = SETTINGS.WA_TEMPLATE.replace(/\{nama\}/g, g.nama).replace(/\{link\}/g, link);
      const phone = normalizePhone_(g.wa);
      const wa = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
      sh.getRange(g.row, waCol + 1).setValue(wa);
      total++;
    });
  });
  SpreadsheetApp.getUi().alert('Selesai: ' + total + ' link tamu dibuat/diperbarui.');
}

function setupRsvpSheet() { getRsvpSheet_(); SpreadsheetApp.getUi().alert('Tab "' + SETTINGS.RSVP_SHEET + '" siap.'); }

// ===================== WEB APP =====================
function doGet(e) {
  const action = (e.parameter.action || '').toLowerCase();
  if (action === 'wishes') return json_({ wishes: listWishes_() });
  if (action === 'guests') {
    if (e.parameter.key !== SETTINGS.ADMIN_KEY) return json_({ error: 'Kunci admin salah' });
    return json_({ guests: listAllGuests_(), baseUrl: SETTINGS.BASE_URL, template: SETTINGS.WA_TEMPLATE });
  }
  return json_({ ok: true, info: 'Undangan API aktif' });
}

function doPost(e) {
  let data = {};
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ error: 'Format salah' }); }
  if (data.action !== 'rsvp') return json_({ error: 'Aksi tidak dikenal' });

  const clean = function (s, n) { return String(s || '').replace(/[<>]/g, '').trim().slice(0, n); };
  const nama = clean(data.nama, 60), ucapan = clean(data.ucapan, 500);
  const hadir = ['Hadir', 'Tidak Hadir', 'Masih Ragu'].indexOf(data.hadir) > -1 ? data.hadir : '';
  if (!nama || !ucapan) return json_({ error: 'Nama dan ucapan wajib diisi' });

  // Batasi spam sederhana: maksimal 1 kiriman per nama per 30 detik
  const cache = CacheService.getScriptCache(), ck = 'r_' + nama.toLowerCase();
  if (cache.get(ck)) return json_({ error: 'Terlalu cepat, coba lagi sebentar.' });
  cache.put(ck, '1', 30);

  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    getRsvpSheet_().appendRow([new Date(), nama, hadir, Number(data.jumlah) || 1, ucapan, clean(data.acara, 30), clean(data.tamuLink, 80)]);
  } finally { lock.releaseLock(); }
  return json_({ ok: true });
}

// ===================== FUNGSI BANTU =====================
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }

function buildLink_(nama, acara) {
  let url = SETTINGS.BASE_URL + '?to=' + encodeURIComponent(nama).replace(/%20/g, '+');
  if (acara) url += '&a=' + encodeURIComponent(String(acara).toLowerCase().trim());
  return url;
}

function normalizePhone_(p) {
  let d = String(p || '').replace(/\D/g, '');
  if (d.indexOf('0') === 0) d = '62' + d.slice(1);
  else if (d.indexOf('8') === 0) d = '62' + d;
  return d; // kosong → wa.me akan meminta pilih kontak
}

/** Cari baris judul (yang punya kolom "Nama") di 15 baris pertama, lalu baca tamu. */
function readGuestSheet_(sh) {
  const values = sh.getDataRange().getDisplayValues();
  let headerRow = -1, cols = {};
  for (let r = 0; r < Math.min(15, values.length); r++) {
    const idx = values[r].findIndex(function (v) { return COLS.nama.test(String(v).trim()); });
    if (idx > -1) {
      headerRow = r;
      values[r].forEach(function (v, c) {
        v = String(v).trim();
        if (cols.nama == null && COLS.nama.test(v)) cols.nama = c;
        else if (cols.link == null && COLS.link.test(v)) cols.link = c;
        else if (cols.walink == null && COLS.walink.test(v)) cols.walink = c;
        else if (cols.acara == null && COLS.acara.test(v)) cols.acara = c;
        else if (cols.wa == null && COLS.wa.test(v)) cols.wa = c;
      });
      break;
    }
  }
  if (headerRow < 0) return null;
  const guests = [];
  for (let r = headerRow + 1; r < values.length; r++) {
    const nama = String(values[r][cols.nama] || '').trim();
    if (!nama) continue;
    guests.push({
      row: r + 1, nama: nama,
      wa: cols.wa != null ? values[r][cols.wa] : '',
      acara: cols.acara != null ? String(values[r][cols.acara]).trim().toLowerCase() : ''
    });
  }
  return { headerRow: headerRow, cols: cols, guests: guests };
}

function listAllGuests_() {
  const ss = SpreadsheetApp.getActive(), out = [];
  SETTINGS.GUEST_SHEETS.forEach(function (name) {
    const sh = ss.getSheetByName(name); if (!sh) return;
    const info = readGuestSheet_(sh); if (!info) return;
    info.guests.forEach(function (g) {
      out.push({ kelompok: name, nama: g.nama, wa: normalizePhone_(g.wa), acara: g.acara || SETTINGS.DEFAULT_EVENT_BY_SHEET[name] || '' });
    });
  });
  return out;
}

function getRsvpSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(SETTINGS.RSVP_SHEET);
  if (!sh) {
    sh = ss.insertSheet(SETTINGS.RSVP_SHEET);
    sh.appendRow(['Waktu', 'Nama', 'Kehadiran', 'Jumlah', 'Ucapan', 'Acara', 'Nama di Link']);
    sh.getRange(1, 1, 1, 7).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function listWishes_() {
  const sh = getRsvpSheet_(), n = sh.getLastRow();
  if (n < 2) return [];
  const rows = sh.getRange(2, 1, n - 1, 5).getValues();
  const tz = Session.getScriptTimeZone();
  return rows.reverse().slice(0, 300).map(function (r) {
    return { waktu: Utilities.formatDate(new Date(r[0]), tz, 'dd-MM-yyyy HH:mm'), nama: r[1], hadir: r[2], ucapan: r[4] };
  });
}
