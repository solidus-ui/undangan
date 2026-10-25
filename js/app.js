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
    r.setProperty('--petal', t.petal); r.setProperty('--petal-dark', t.petalDark);
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
  const CHIP = '<svg class="chip" viewBox="0 0 48 36" aria-hidden="true"><rect x="1" y="1" width="46" height="34" rx="6" fill="#e3c27a" stroke="#b8923f"/><path d="M1 12h14M1 24h14M33 12h14M33 24h14M15 1v34M33 1v34M15 18h18" stroke="#b8923f" stroke-width="1.4" fill="none"/></svg>';
  const fmtNum = (n) => String(n).replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  if (C.showGifts !== false && C.gifts && C.gifts.length) {
    $('#giftList').innerHTML = C.gifts.map((g) => `<div class="bank-card">
        <div class="bank-top">${CHIP}${g.logo ? `<img class="bank-logo" src="${esc(g.logo)}" alt="${esc(g.bank)}">` : `<span class="bank-name">${esc(g.bank)}</span>`}</div>
        <p class="bank-num">${esc(fmtNum(g.number))}</p>
        <div class="bank-bottom"><span class="bank-holder">${esc(g.holder)}</span>
          <button class="copy-btn" type="button" data-copy="${esc(String(g.number).replace(/\s/g, ''))}" aria-label="Salin nomor rekening ${esc(g.holder)}">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16h-9V7h9v14Z"/></svg><span>Salin</span></button>
        </div></div>`).join('');
    $('#giftToggle').addEventListener('click', (ev) => {
      const list = $('#giftList'), open = list.hidden;
      list.hidden = !open; ev.currentTarget.setAttribute('aria-expanded', String(open));
      if (open) list.querySelectorAll('.bank-card').forEach((c, i) => { c.style.animationDelay = i * 0.12 + 's'; c.classList.add('pop'); });
    });
    $('#giftList').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-copy]'); if (!b) return;
      const label = b.querySelector('span');
      const done = (t) => { label.textContent = t; setTimeout(() => { label.textContent = 'Salin'; }, 1800); };
      const fallback = () => { const t = document.createElement('textarea'); t.value = b.dataset.copy; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done('Tersalin ✓'); } catch (e) { done(b.dataset.copy); } t.remove(); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(() => done('Tersalin ✓'), fallback); else fallback();
    });
    if (C.giftAddress) { const ga = $('#giftAddress'); ga.hidden = false; ga.innerHTML = `<p class="strong">Kirim Kado</p><p class="small">${esc(C.giftAddress)}</p>`; }
  } else $('#gift').remove();

  /* ---------- Ucapan & RSVP (disimpan ke Google Sheet lewat Apps Script) ---------- */
  const api = (C.appsScriptUrl || '').trim();
  const PAGE = 10; let wishes = [], shown = PAGE;
  const AVATAR = '<span class="avatar" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4.2" fill="currentColor"/><path d="M3.8 21a8.2 8.2 0 0 1 16.4 0Z" fill="currentColor"/></svg></span>';
  function renderWishes() {
    $('#cntHadir').textContent = wishes.filter((w) => w.hadir === 'Hadir').length;
    $('#cntTidak').textContent = wishes.filter((w) => w.hadir === 'Tidak Hadir').length;
    $('#wishList').innerHTML = wishes.length
      ? wishes.slice(0, shown).map((w) => `<li>${AVATAR}<div><p class="who">${esc(w.nama)}${w.hadir ? ` <span class="tag ${w.hadir === 'Hadir' ? 'yes' : 'no'}">${esc(w.hadir)}</span>` : ''}</p><p class="meta">${esc(w.waktu)}</p><p class="msg">${esc(w.ucapan)}</p></div></li>`).join('')
      : '<li class="empty">Belum ada ucapan. Jadilah yang pertama memberikan doa restu.</li>';
    $('#wishMore').hidden = wishes.length <= shown;
  }
  async function loadWishes() {
    if (!api) { renderWishes(); return; }
    try {
      const res = await fetch(api + '?action=wishes', { cache: 'no-store' });
      const data = await res.json();
      wishes = Array.isArray(data.wishes) ? data.wishes : [];
    } catch (e) { /* jaringan gagal: biarkan daftar lama */ }
    renderWishes();
  }
  $('#wishMore').addEventListener('click', () => { shown += PAGE; renderWishes(); });
  $('#rsvpForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const form = ev.target, msg = $('#formMsg');
    const fd = Object.fromEntries(new FormData(form));
    fd.nama = (fd.nama || '').trim(); fd.ucapan = (fd.ucapan || '').trim();
    if (!fd.nama) { msg.textContent = 'Mohon isi nama Anda.'; msg.className = 'form-msg err'; $('#fNama').focus(); return; }
    if (!fd.ucapan) { msg.textContent = 'Mohon tulis ucapan dan doa Anda.'; msg.className = 'form-msg err'; $('#fUcapan').focus(); return; }
    if (!fd.hadir) { msg.textContent = 'Mohon pilih Hadir atau Tidak Hadir.'; msg.className = 'form-msg err'; return; }
    fd.action = 'rsvp'; fd.acara = eventCode || 'semua'; fd.tamuLink = guest; fd.jumlah = 1;
    const btn = form.querySelector('.send'); btn.disabled = true;
    msg.textContent = 'Mengirim…'; msg.className = 'form-msg';
    const now = new Date();
    const entry = { nama: fd.nama, hadir: fd.hadir, ucapan: fd.ucapan,
      waktu: now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') + ' ' + now.toTimeString().slice(0, 5) };
    if (!api) {
      // Belum terhubung ke Google Sheet: tampilkan di layar ini saja (tidak tersimpan permanen).
      wishes.unshift(entry); renderWishes();
      msg.textContent = 'Terima kasih! (Mode uji: ucapan belum tersimpan, appsScriptUrl belum diisi.)'; msg.className = 'form-msg ok';
    } else {
      try {
        // Content-Type text/plain menghindari preflight CORS di Apps Script
        const res = await fetch(api, { method: 'POST', body: JSON.stringify(fd), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
        const out = await res.json().catch(() => ({ ok: true }));
        if (out.error) throw new Error(out.error);
        wishes.unshift(entry); renderWishes();
        msg.textContent = 'Terima kasih atas ucapan dan doa restunya!'; msg.className = 'form-msg ok';
        $('#fUcapan').value = ''; form.querySelectorAll('input[name=hadir]').forEach((r) => { r.checked = false; });
        setTimeout(loadWishes, 1500);
      } catch (e) {
        msg.textContent = (e && e.message && e.message !== 'Failed to fetch') ? e.message : 'Gagal mengirim. Periksa koneksi lalu coba lagi.'; msg.className = 'form-msg err';
      }
    }
    btn.disabled = false;
  });
  loadWishes();
  if (api) setInterval(loadWishes, 60000);

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
  anim('#giftToggle, #rsvpForm, .rsvp-sub, .stats', 'a-up');
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
