/* Logika undangan — umumnya tidak perlu diedit. Isi diatur di config.js */
(function () {
  const C = window.INVITATION;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), C);
  const params = new URLSearchParams(location.search);

  /* ---------- Tamu dari link: ?to=Nama+Tamu&a=malang ---------- */
  const guest = (params.get('to') || '').trim().slice(0, 80);
  const eventCode = (params.get('a') || '').trim().toLowerCase();
  const events = C.events.filter((e) => !eventCode || eventCode === 'semua' || e.id === eventCode);
  const shownEvents = events.length ? events : C.events;

  /* ---------- Tema ---------- */
  function applyTheme(t) {
    const r = document.documentElement.style;
    r.setProperty('--primary', t.primary); r.setProperty('--accent', t.accent);
    r.setProperty('--bg', t.background); r.setProperty('--surface', t.surface); r.setProperty('--text', t.text);
    r.setProperty('--f-title', `"${t.fontTitle}", cursive`);
    r.setProperty('--f-head', `"${t.fontHeading}", serif`);
    r.setProperty('--f-body', `"${t.fontBody}", sans-serif`);
    const fam = [t.fontTitle, t.fontHeading + ':ital,wght@0,400;0,600;0,700;1,400', t.fontBody + ':wght@300;400;500;600']
      .map((f) => 'family=' + f.replace(/ /g, '+')).join('&');
    $('#gfonts').href = `https://fonts.googleapis.com/css2?${fam}&display=swap`;
    window.renderFlowers(t);
  }
  window.applyTheme = applyTheme;

  /* ---------- Bunga pojok kiri-bawah & kanan-bawah di setiap bagian ---------- */
  document.querySelectorAll('#main .section').forEach((sec) => {
    ['bl', 'br'].forEach((k) => {
      const d = document.createElement('div');
      d.className = 'flower corner bloom-flower ' + k;
      d.setAttribute('data-flower', 'corner');
      d.setAttribute('aria-hidden', 'true');
      sec.appendChild(d);
    });
  });

  /* ---------- Isi teks & foto ---------- */
  document.querySelectorAll('[data-text]').forEach((el) => { el.textContent = get(el.dataset.text) || ''; });
  document.querySelectorAll('[data-img]').forEach((el) => { el.style.backgroundImage = `url("${C.photos[el.dataset.img]}")`; });
  document.title = `The Wedding of ${C.couple.shortTitle}`;
  $('#guestName').textContent = guest || C.texts.defaultGuest;
  if (guest) $('#fNama').value = guest;

  const fmtDate = (iso, opt) => { const t = new Date(iso).toLocaleDateString('id-ID', Object.assign({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, opt || {})); return C.texts.useAhad ? t.replace(/^Minggu/, 'Ahad') : t; };
  const mainDate = shownEvents[0] ? fmtDate(shownEvents[0].date, { timeZone: tzOf(shownEvents[0].date) }) : '';
  $('#coverDate').textContent = mainDate;
  $('#heroDate').textContent = mainDate;

  function tzOf(iso) { return /\+08:00$/.test(iso) ? 'Asia/Makassar' : /\+09:00$/.test(iso) ? 'Asia/Jayapura' : 'Asia/Jakarta'; }

  /* Mempelai */
  const p = (x) => `<div class="person reveal"><img src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy">
    <h4>${esc(x.name)}</h4><p class="full">${esc(x.fullName)}</p><p class="small">${esc(x.parents)}</p>
    ${x.instagram ? `<a href="${esc(x.instagram)}" target="_blank" rel="noopener">Instagram</a>` : ''}</div>`;
  const [first, second] = C.couple.brideFirst ? [C.couple.bride, C.couple.groom] : [C.couple.groom, C.couple.bride];
  $('#coupleWrap').innerHTML = p(first) + '<div class="amp reveal">&amp;</div>' + p(second);

  /* Kisah */
  if (C.loveStory && C.loveStory.length) {
    $('#storyList').innerHTML = C.loveStory.map((s) => `<div class="item reveal"><p class="date">${esc(s.date)}</p><h4>${esc(s.title)}</h4><p>${esc(s.text)}</p></div>`).join('');
  } else $('#story').remove();

  /* Acara */
  $('#eventList').innerHTML = shownEvents.map((e) => `<div class="card event reveal">
      <h4>${esc(e.title)}</h4>
      <p class="when">${esc(fmtDate(e.date, { timeZone: tzOf(e.date) }))}</p>
      <p>${esc(e.timeText)}</p>
      <p class="venue">${esc(e.venue)}</p><p class="small">${esc(e.address)}</p>
      <a class="btn" href="${esc(e.mapsUrl)}" target="_blank" rel="noopener">Lihat Lokasi</a>
      <a class="btn ghost" href="${calLink(e)}" target="_blank" rel="noopener" style="margin-left:.4rem">Simpan ke Kalender</a>
    </div>`).join('');

  function calLink(e) {
    const s = new Date(e.date), end = new Date(s.getTime() + 3 * 3600e3);
    const f = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(`${e.title} ${C.couple.shortTitle}`)
      + '&dates=' + f(s) + '/' + f(end)
      + '&location=' + encodeURIComponent(`${e.venue}, ${e.address}`);
  }

  /* Hitung mundur */
  const target = new Date(C.countdownDate || (shownEvents[0] && shownEvents[0].date)).getTime();
  function tick() {
    let d = Math.max(0, target - Date.now()) / 1000;
    $('#cdD').textContent = Math.floor(d / 86400); d %= 86400;
    $('#cdH').textContent = Math.floor(d / 3600); d %= 3600;
    $('#cdM').textContent = Math.floor(d / 60);
    $('#cdS').textContent = Math.floor(d % 60);
  }
  if (!isNaN(target)) { tick(); setInterval(tick, 1000); } else $('#countdown').remove();

  /* Galeri + lightbox */
  if (C.photos.gallery && C.photos.gallery.length) {
    $('#galleryGrid').innerHTML = C.photos.gallery.map((g) => { const o = typeof g === 'string' ? { src: g } : g; return `<img src="${esc(o.src)}" alt="Foto galeri" loading="lazy" class="reveal"${o.pos ? ` style="object-position:${esc(o.pos)}"` : ''}>`; }).join('');
    const lb = $('#lightbox');
    $('#galleryGrid').addEventListener('click', (ev) => { if (ev.target.tagName === 'IMG') { lb.querySelector('img').src = ev.target.src; lb.hidden = false; } });
    lb.addEventListener('click', () => { lb.hidden = true; });
  } else $('#gallery').remove();

  /* Amplop digital */
  if (C.showGifts !== false && C.gifts && C.gifts.length) {
    $('#giftList').innerHTML = C.gifts.map((g) => `<div class="card gift reveal"><p class="bank">${esc(g.bank)}</p>
      <p class="num">${esc(g.number)}</p><p class="small">a.n. ${esc(g.holder)}</p>
      <button class="btn ghost" data-copy="${esc(g.number)}" style="margin-top:.6rem">Salin Nomor</button></div>`).join('');
    $('#giftList').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-copy]'); if (!b) return;
      navigator.clipboard.writeText(b.dataset.copy).then(() => { b.textContent = 'Tersalin ✓'; setTimeout(() => (b.textContent = 'Salin Nomor'), 1800); });
    });
    if (C.giftAddress) { const ga = $('#giftAddress'); ga.hidden = false; ga.innerHTML = `<p class="strong">Kirim Kado</p><p class="small">${esc(C.giftAddress)}</p>`; }
  } else $('#gift').remove();

  /* RSVP & ucapan via Google Apps Script */
  const api = C.appsScriptUrl;
  if (!api) { $('#rsvp').remove(); }
  else {
    loadWishes();
    $('#rsvpForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const fd = Object.fromEntries(new FormData(ev.target));
      fd.action = 'rsvp'; fd.acara = eventCode || 'semua'; fd.tamuLink = guest;
      const btn = ev.target.querySelector('button'); btn.disabled = true;
      $('#formMsg').textContent = 'Mengirim…';
      try {
        // text/plain menghindari preflight CORS di Apps Script
        await fetch(api, { method: 'POST', body: JSON.stringify(fd), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        $('#formMsg').textContent = 'Terima kasih atas ucapan dan doanya!';
        ev.target.querySelector('textarea').value = '';
        loadWishes();
      } catch (e) { $('#formMsg').textContent = 'Gagal mengirim, coba lagi.'; }
      btn.disabled = false;
    });
  }
  async function loadWishes() {
    try {
      const res = await fetch(api + '?action=wishes');
      const data = await res.json();
      const list = data.wishes || [];
      const h = list.filter((w) => w.hadir === 'Hadir').length;
      const t = list.filter((w) => w.hadir === 'Tidak Hadir').length;
      $('#rsvpStats').innerHTML = `<span>${h} Hadir</span><span>${t} Tidak Hadir</span>`;
      $('#wishList').innerHTML = list.map((w) => `<li><p class="who">${esc(w.nama)}</p><p class="meta">${esc(w.hadir)} · ${esc(w.waktu)}</p><p>${esc(w.ucapan)}</p></li>`).join('');
    } catch (e) { /* abaikan jika gagal memuat */ }
  }

  /* ---------- Musik ---------- */
  const audio = $('#bgm'), mbtn = $('#musicBtn');
  if (C.music && C.music.src) {
    audio.src = C.music.src;
    mbtn.addEventListener('click', () => { audio.paused ? audio.play() : audio.pause(); });
    audio.addEventListener('play', () => mbtn.classList.add('playing'));
    audio.addEventListener('pause', () => mbtn.classList.remove('playing'));
    audio.volume = 0.85;
    // Coba putar otomatis saat halaman dibuka. Kebanyakan browser HP menolak sebelum ada sentuhan,
    // jadi lagu juga dimulai pada sentuhan/klik pertama di mana saja (termasuk tombol Buka Undangan).
    const startMusic = () => { if (audio.paused && !audio.dataset.userPaused) audio.play().then(() => { mbtn.hidden = false; }).catch(() => {}); };
    audio.preload = 'auto';
    startMusic();
    ['pointerdown', 'touchstart', 'keydown'].forEach((ev) => document.addEventListener(ev, startMusic, { once: true, passive: true }));
    mbtn.addEventListener('click', () => { audio.dataset.userPaused = audio.paused ? '1' : ''; });
  }

  /* ---------- Buka undangan ---------- */
  $('#openBtn').addEventListener('click', () => {
    $('#cover').classList.add('gone');
    document.body.classList.remove('locked');
    if (C.music && C.music.src) {
      mbtn.hidden = false;
      if (audio.paused && !audio.dataset.userPaused) {
        if (!audio.currentTime) { try { audio.currentTime = C.music.startAt || 0; } catch (e) {} }
        audio.play().catch(() => {}); // klik tombol ini dihitung sebagai interaksi pengguna
      }
    }
  });

  /* Animasi muncul saat di-scroll */
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.15 });
  /* Gaya animasi muncul per jenis elemen (sederhana: geser + memudar) */
  const anim = (sel, cls, stagger) => document.querySelectorAll(sel).forEach((el, i) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    if (![...el.classList].some((c) => c.indexOf('a-') === 0)) el.classList.add(cls);
    if (stagger) el.style.transitionDelay = Math.min(i * 0.12, 0.6) + 's';
  });
  anim('.heading, .script-h', 'a-down');
  anim('.lead, .countdown, .hero-text, .closing-text', 'a-up');
  anim('.verse', 'a-fade');
  document.querySelectorAll('.person').forEach((el, i) => el.classList.add(i ? 'a-right' : 'a-left'));
  anim('.amp', 'a-zoom');
  anim('.timeline .item', 'a-left', true);
  anim('.event', 'a-up', true);
  document.querySelectorAll('.gallery img').forEach((el, i) => { el.classList.add('a-zoom'); el.style.transitionDelay = (i % 2) * 0.12 + 's'; });
  anim('.gift, #rsvpForm', 'a-up');
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* Bunga mekar saat bagiannya digulir ke layar */
  const fo = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('bloomed'); fo.unobserve(en.target); } }), { threshold: 0.2 });
  document.querySelectorAll('#main .section').forEach((el) => fo.observe(el));

  applyTheme(C.theme);

  /* Mode editor desain: tambahkan ?edit=1 di link */
  if (params.get('edit') === '1') {
    const s = document.createElement('script'); s.src = 'js/editor.js'; document.body.appendChild(s);
  }
})();
