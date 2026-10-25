# Panduan Undangan Digital Niken & Taufik

Website undangan statis (HTML/CSS/JS) yang bisa di-upload ke hosting apa pun, dengan:
nama tamu otomatis dari link, foto & lagu sendiri, warna & bunga yang bisa diganti,
RSVP + ucapan tersimpan ke Google Sheet, dan halaman admin untuk kirim link via WhatsApp.

```
undangan-digital/
├── index.html            ← halaman undangan
├── css/style.css         ← tampilan (jarang perlu diubah)
├── js/config.js          ← ★ SEMUA ISI UNDANGAN DIATUR DI SINI
├── js/flowers.js         ← ornamen bunga SVG (mawar, peony, melati, daun)
├── js/flowers-boho.js    ← ornamen boho: pampas, palem, monstera, anthurium
├── js/app.js             ← logika undangan
├── js/editor.js          ← panel editor warna/bunga (?edit=1)
├── admin/index.html      ← halaman kirim undangan per tamu
├── apps-script/Code.gs   ← tempel ke Google Sheet (RSVP & link tamu)
├── assets/img/           ← foto (ganti placeholder .svg dengan foto Anda)
├── assets/music/         ← lagu latar (lagu.mp3)
├── assets/flowers/       ← opsional: gambar bunga PNG sendiri
└── .htaccess             ← HTTPS & cache untuk hosting Apache/LiteSpeed
```

---

## 1. Ganti isi undangan (`js/config.js`)

Buka `js/config.js` dengan Notepad / VS Code. Bagian yang perlu diisi:

| Bagian | Isi |
|---|---|
| `couple` | Nama panggilan, nama lengkap, nama orang tua, Instagram |
| `events` | Akad & resepsi: tanggal (format `2026-11-24T08:00:00+07:00`), jam, tempat, link Google Maps |
| `loveStory` | Kisah singkat (hapus isinya → bagian disembunyikan) |
| `gifts` | Rekening amplop digital (hapus isinya → disembunyikan) |
| `appsScriptUrl` | URL Web App dari langkah 3 |
| `theme` | Warna, gaya bunga, font |

> Zona waktu: `+07:00` = WIB (Malang), `+08:00` = WITA (Makassar).

### Foto
1. Siapkan foto JPG/WebP, perkecil ke lebar ±1200 px (pakai squoosh.app) supaya cepat dibuka di HP.
2. Taruh di `assets/img/`, misalnya `cover.jpg`, `niken.jpg`, `taufik.jpg`, `galeri-01.jpg`, …
3. Ubah nama file di `config.js` → `photos` dan `couple.bride.photo` / `couple.groom.photo`.
4. Untuk pratinjau saat link dibagikan di WhatsApp, buat `assets/img/og-image.jpg` (1200×630 px)
   lalu ubah `og:image` di `index.html` menjadi alamat lengkap, mis. `https://undangan.domainanda.com/assets/img/og-image.jpg`.

### Lagu latar
Taruh MP3 (< 5 MB) di `assets/music/lagu.mp3`. Lagu mulai saat tamu menekan **Buka Undangan**
(browser HP tidak mengizinkan musik otomatis sebelum ada sentuhan). Pakai lagu yang Anda punya hak memakainya.

## 2. Ganti desain bunga & warna

**Cara cepat (visual):** buka `index.html?edit=1` (di hosting atau lokal). Muncul panel editor:
pilih preset warna (Peach Maroon Cream, Dusty Rose, Sage Green, Navy & Gold, Terracotta, Lilac, Maroon Klasik),
ubah tiap warna, gaya bunga (`boho`, `mawar`, `peony`, `melati`, `daun`), ukuran, dan font.
Klik **Salin Config**, lalu tempel menggantikan blok `theme: { … }` di `config.js`.

**Pakai gambar bunga sendiri:** taruh PNG transparan di `assets/flowers/corner.png` dan
`divider.png`, lalu set `flowerStyle: "gambar"`. Gambar pojok dibuat untuk posisi kiri-atas;
tiga pojok lainnya dicerminkan otomatis.

**Gaya bunga baru:** tambahkan fungsi di `FLOWER_DRAWERS` dalam `js/flowers.js`.

## 3. Hubungkan Google Sheet (RSVP, ucapan, daftar tamu)

### a. Siapkan tab daftar tamu
Di setiap tab tamu (`List Undangan`, `Undangan Kantor`, `Undangan Taufik`) pastikan ada baris judul dengan kolom:

| Nama | No WA | Acara |
|---|---|---|
| Bapak Ahmad & Keluarga | 081234567890 | malang |
| Ibu Rina | 082233445566 | makassar |

- **Nama** wajib. Judul kolom boleh "Nama", "Nama Tamu".
- **No WA** boleh format 08… / 62… / +62…; judul boleh "WA", "No HP", "Telepon".
- **Acara**: `malang`, `makassar`, atau kosong (= tampilkan semua acara). Nilainya harus sama dengan `id` di `events` config.js.
- Kolom lain boleh ada; script akan mencari baris judul di 15 baris teratas.

### b. Pasang Apps Script
1. Buka Google Sheet → **Extensions → Apps Script**.
2. Hapus isi `Code.gs`, tempel isi `apps-script/Code.gs`.
3. Edit bagian `SETTINGS`: `BASE_URL` (alamat undangan), `GUEST_SHEETS`, `ADMIN_KEY` (kata acak), template WA.
4. Simpan. Klik **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Izinkan akses (Advanced → Go to … → Allow). Salin **Web app URL** (`https://script.google.com/macros/s/…/exec`).
6. Tempel URL itu ke `appsScriptUrl` di `config.js`.
7. Muat ulang Google Sheet → muncul menu **💌 Undangan**.

> Setiap kali `Code.gs` diubah: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**
> (URL tetap sama).

Keamanan: Sheet Anda **tidak perlu** dibuat publik. Website hanya bisa membaca ucapan; daftar tamu
hanya bisa diambil dengan `ADMIN_KEY`.

## 4. Kirim undangan ke masing-masing tamu

Format link: `https://undangan.domainanda.com/?to=Nama+Tamu&a=malang`

**Opsi A — langsung dari Google Sheet:** menu **💌 Undangan → Buat / perbarui link semua tamu**.
Script menambah kolom **Link Undangan** dan **Link WhatsApp** di tiap tab. Klik Link WhatsApp →
WhatsApp terbuka dengan pesan siap kirim ke nomor tamu.

**Opsi B — halaman admin:** buka `https://undangan.domainanda.com/admin/`, isi URL Web App &
kunci admin, klik **Ambil daftar tamu**. Tiap tamu punya tombol **Kirim WA**, **Salin link**,
**Salin pesan**, dan tanda ✓ terkirim (tersimpan di browser itu). Bisa unduh CSV semua link.
Tanpa Apps Script pun bisa: tempel daftar tamu manual dari Sheet.

> Tamu tanpa nomor WA: pakai **Salin pesan** lalu kirim lewat aplikasi lain.
> Kirim bertahap (mis. 30–50/hari) agar nomor WhatsApp tidak dianggap spam.

## 5. Upload ke hosting Anda

### cPanel (Niagahoster lama, Rumahweb, Domainesia, IDCloudHost, dll.)
1. (Disarankan) Buat subdomain: **Domains/Subdomains** → `undangan` → document root `public_html/undangan`.
2. **File Manager** → masuk ke folder tadi → **Upload** file ZIP → klik kanan → **Extract**.
   Pastikan `index.html` berada langsung di folder tersebut (bukan di `undangan-digital/` lagi).
3. Tampilkan file tersembunyi (**Settings → Show Hidden Files**) untuk memastikan `.htaccess` ikut.
4. **SSL/TLS Status** → **Run AutoSSL** agar `https://` aktif (tunggu beberapa menit).
5. Buka `https://undangan.domainanda.com/?to=Tes` untuk mengecek.

### hPanel (Hostinger / Niagahoster baru)
**Websites → Manage → Domains → Subdomains** buat `undangan` → **File Manager** → upload & extract
ke `public_html/undangan` → **Security → SSL** aktifkan.

### Tanpa subdomain
Upload ke `public_html/undangan/` → alamatnya `https://domainanda.com/undangan/`.
Isi `BASE_URL` di Code.gs dengan alamat itu (akhiri dengan `/`).

### Domain di tempat lain (mis. beli domain di registrar berbeda)
Arahkan DNS: buat **A record** `undangan` → IP server hosting (lihat di cPanel “Shared IP”),
atau ganti nameserver domain ke nameserver hosting. Propagasi 1–24 jam.

### Lindungi halaman admin (opsional)
cPanel → **Directory Privacy** → pilih folder `admin` → aktifkan password.

### Setelah mengubah file
Upload ulang file yang berubah (biasanya hanya `js/config.js` atau foto). Jika tamu masih melihat
versi lama, minta mereka refresh; cache JS/CSS hanya 1 jam.

## 6. Cek sebelum disebar
- [ ] Nama tamu tampil benar, termasuk nama dengan “&” (mis. `Bapak Ahmad & Keluarga`)
- [ ] Link `&a=malang` hanya menampilkan acara Malang, `&a=makassar` hanya Makassar
- [ ] Musik berbunyi setelah tekan Buka Undangan (cek di HP)
- [ ] Tombol Lihat Lokasi membuka Google Maps yang benar
- [ ] Kirim satu ucapan percobaan → muncul di tab **Ucapan** dan di undangan, lalu hapus barisnya
- [ ] Pratinjau link di WhatsApp menampilkan foto & judul


## 7. Editor foto & simpan langsung ke GitHub

Buka **https://solidus-ui.github.io/undangan/?edit=1** (tamu tidak melihat editor ini).

- **🎨 Desain**: warna, gaya & ukuran bunga, font.
- **📷 Foto**: klik foto mana pun → atur **zoom** (slider, tombol −/+, atau scroll mouse) dan **seret** foto untuk menggeser posisinya. Untuk foto cover, klik **Tampilkan cover** dulu. **Reset foto ini** mengembalikan posisi awal.
- **💾 Simpan**: isi token GitHub, klik **Simpan ke GitHub**. Hasilnya ditulis ke `js/overrides.js` di repo dan situs diperbarui ±1–2 menit kemudian.

### Membuat token GitHub (sekali saja)
1. Login GitHub sebagai **solidus-ui** → buka https://github.com/settings/personal-access-tokens/new
2. *Token name*: `editor-undangan`, *Expiration*: misalnya 90 hari.
3. *Repository access*: **Only select repositories** → pilih `solidus-ui/undangan`.
4. *Permissions → Repository permissions → Contents*: **Read and write**.
5. Klik **Generate token**, salin token (`github_pat_…`) dan tempel di tab **Simpan** pada editor.
   Centang *Ingat token di perangkat ini* bila HP/laptop pribadi. Jangan bagikan token ke orang lain.

Untuk membatalkan semua hasil editor, ganti isi `js/overrides.js` menjadi `window.INVITATION_OVERRIDES = {};`.
