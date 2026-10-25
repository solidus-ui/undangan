/* =========================================================================
   KONFIGURASI UNDANGAN — cukup edit file ini untuk mengganti isi undangan.
   Semua teks, foto, lagu, warna, dan gaya bunga diatur di sini.
   Tips: buka  https://domainanda.com/?edit=1  untuk mengatur warna & bunga
   secara langsung, lalu klik "Salin Config" dan tempel di bagian THEME.
   ========================================================================= */
window.INVITATION = {

  /* ---------- MEMPELAI ---------- */
  couple: {
    shortTitle: "Taufik & Niken",          // tampil di cover & penutup
    bride: {
      name: "Niken",                        // nama panggilan
      fullName: "Niken Widowati, S.E.",
      parents: "Anak Bungsu dari Bapak Sunardi (Alm.)\ndan Ibu Roudotus Sa'adah",
      photo: "assets/img/niken.jpg",
      instagram: ""                         // contoh: "https://instagram.com/niken"
    },
    groom: {
      name: "Taufik",
      fullName: "Andi Muh. Taufik Aprinanda, S.E.",
      parents: "Anak Bungsu dari Bapak Drs. H. Andi Muflihuddin Hamid, M.M.\ndan Ibu Hj. Darmaniah Manaf, S.Sos., M.Si.",
      photo: "assets/img/taufik.jpg",
      instagram: ""
    },
    brideFirst: false                       // true = mempelai wanita ditulis duluan
  },

  /* ---------- FOTO ---------- */
  photos: {
    cover: "assets/img/cover.jpg",          // Cover Undangan.jpg (Prambanan)
    hero: "assets/img/hero.jpg",            // 0Y1A0239 (veil, Prambanan)
    closing: "assets/img/penutup.jpg",      // Bugis berdua (Niken duduk, Taufik berdiri)
    gallery: [                              // foto berdua; tambahkan foto Bugis berdua di sini
      "assets/img/galeri-01.jpg",           // 0Y1A0110
      "assets/img/galeri-02.jpg",           // 0Y1A0144
      "assets/img/galeri-03.jpg",           // 0Y1A0167
      "assets/img/galeri-04.jpg",           // 0Y1A0065
      "assets/img/galeri-05.jpg",           // IMG_2881
      "assets/img/galeri-06.jpg",           // IMG_2943
      { src: "assets/img/galeri-07.jpg", pos: "center 30%" }, // Bugis 1 (pos = titik fokus saat dipotong)
      "assets/img/galeri-08.jpg",           // Bugis 3
      "assets/img/galeri-09.jpg",           // Bugis 4
      { src: "assets/img/galeri-10.jpg", pos: "center 28%" }  // Bugis 5
    ]
  },

  /* ---------- LAGU LATAR ---------- */
  music: {
    src: "assets/music/lagu.mp3",           // taruh file mp3 Anda di assets/music/
    title: "Anugerah Terindah (Saxophone Cover) – Dori Wirawan", // sudah dipotong mulai 1:20
    startAt: 0                              // detik ke-berapa lagu mulai
  },

  /* ---------- ACARA ----------
     "id" dipakai untuk memilih acara per tamu (kolom "Acara" di Sheet,
     atau parameter link &a=malang). Tamu tanpa kode acara melihat semuanya. */
  events: [
    {
      id: "malang",
      title: "Akad Nikah",
      date: "2026-11-24T10:00:00+07:00",
      timeText: "Pukul 10.00 WIB",
      venue: "Masjid Al-Huda Griyashanta Malang",
      address: "Jl. Puncak Borobudur, Kota Malang",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Masjid+Al-Huda+Griyashanta+Malang"
    },
    {
      id: "malang",
      title: "Resepsi Malang",
      date: "2026-11-24T16:00:00+07:00",
      timeText: "Pukul 16.00 WIB",
      venue: "Taman Krida Budaya",
      address: "Jl. Soekarno Hatta No. 7, Lowokwaru, Kota Malang",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Taman+Krida+Budaya+Jawa+Timur+Malang"
    },
    {
      id: "makassar",
      title: "Resepsi Makassar",
      date: "2026-12-13T11:00:00+08:00",
      timeText: "Pukul 11.00 WITA",
      venue: "Four Points by Sheraton Makassar",
      address: "Jl. Andi Djemma No. 130, Kota Makassar",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Four+Points+by+Sheraton+Makassar"
    }
  ],
  // Tanggal untuk hitung mundur (kosongkan "" = otomatis acara pertama yang relevan)
  countdownDate: "",

  /* ---------- TEKS ---------- */
  texts: {
    greeting: "Assalamu'alaikum Wr. Wb.",
    intro: "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
    eventsIntro: "yang Insya Allah akan dilaksanakan pada:",
    useAhad: true,                          // tulis "Ahad" untuk hari Minggu
    verse: "“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”",
    verseSource: "QS. Ar-Rum: 21",
    closing: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    farewell: "Wassalamu'alaikum Wr. Wb.",
    signoff: "Hormat kami yang mengundang,",
    families: "Keluarga Besar Bapak Drs. H. Andi Muflihuddin Hamid, M.M.\n& Ibu Hj. Darmaniah Manaf, S.Sos., M.Si.\n\nKeluarga Besar Bapak Sunardi (Alm.)\n& Ibu Roudotus Sa'adah",
    coverQuote: "Love blossomed and found its way home,\nwith you there to witness it bloom",
    guestPrefix: "Kepada Yth. Bapak/Ibu/Saudara/i",
    defaultGuest: "Tamu Undangan"
  },

  /* ---------- KISAH CINTA (hapus isi array untuk menyembunyikan) ---------- */
  loveStory: [
    { title: "Pernyataan Komitmen", date: "25 Juli 2026", text: "Ceritakan awal komitmen kalian di sini." },
    { title: "Lamaran", date: "30 Agustus 2026", text: "Dengan restu kedua keluarga, kami melangkah ke jenjang yang lebih serius." },
    { title: "Pernikahan", date: "24 November 2026", text: "Hari yang kami nantikan, saat dua hati dipersatukan." }
  ],

  /* ---------- AMPLOP DIGITAL (hapus isi array untuk menyembunyikan) ---------- */
  gifts: [
    { bank: "Bank Mandiri", logo: "assets/img/bank-mandiri.png", number: "1740002850261", holder: "M TAUFIK APRINANDA" },
    { bank: "Bank Mandiri", logo: "assets/img/bank-mandiri.png", number: "1190012288351", holder: "NIKEN WIDOWATI" }
  ],
  giftText: "Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.",
  giftAddress: "",                          // kosong = bagian kirim kado ke alamat tidak ditampilkan
  showGifts: true,

  /* ---------- RSVP & UCAPAN (Google Apps Script) ----------
     Tempel URL Web App dari apps-script/Code.gs di sini (lihat PANDUAN.md bagian 3).
     Selama masih kosong, form tetap tampil tetapi ucapan belum tersimpan ke server. */
  appsScriptUrl: "",

  /* ---------- EDITOR → GITHUB ----------
     Tombol "Simpan ke GitHub" di mode ?edit=1 menulis js/overrides.js ke repo ini. */
  editor: { repo: "solidus-ui/undangan", branch: "main", file: "js/overrides.js" },

  /* ---------- TEMA: WARNA & BUNGA ----------
     flowerStyle: "mawar" | "peony" | "melati" | "daun" | "gambar"
     "gambar" = pakai file PNG/WebP Anda sendiri di flowerImages. */
  theme: {
    primary:   "#6b2433",   // maroon (judul, tombol)
    accent:    "#c98b6b",   // peach tua (garis, aksen)
    background:"#f7efe4",   // cream latar
    surface:   "#fffaf3",   // latar kartu
    text:      "#3a2227",   // warna teks
    petal:     "#eab796",   // peach (kelopak)
    petalDark: "#7e2a3a",   // maroon (mawar, tongkol anthurium)
    cream:     "#eee0c8",   // cream (pampas, anthurium, palem)
    leaf:      "#6b7558",   // hijau sage lembut (monstera)
    flowerStyle: "garden",  // "garden" | "boho" | "mawar" | "peony" | "melati" | "daun" | "gambar"
    bloomPink: "#e8a1b0",   // pink peony & mawar (gaya garden)
    leafMauve: "#b8928c",   // daun mauve (gaya garden)
    flowerSize: 1,       // skala ukuran ornamen (0.6 – 1.6)
    flowerSway: false,      // true = bunga bergoyang pelan
    fontTitle: "Pinyon Script",
    fontHeading: "Cormorant Garamond",
    fontBody: "Jost",
    flowerImages: {         // dipakai jika flowerStyle = "gambar"
      corner: "assets/flowers/corner.png",
      divider: "assets/flowers/divider.png"
    }
  }
};
