/* =========================================================================
   EDITOR — aktif hanya jika link memakai ?edit=1 (atau #edit)
   • Desain : warna, gaya & ukuran bunga, font
   • Foto   : klik foto → zoom in/out (slider / scroll) & seret untuk menggeser
   • Simpan : tulis js/overrides.js langsung ke repo GitHub (butuh token)
   Tamu biasa tidak melihat editor ini, dan tanpa token tidak ada yang bisa menyimpan.
   ========================================================================= */
(function () {
  const C = window.INVITATION, T = C.theme;
  const O = window.INVITATION_OVERRIDES || {};
  const E = Object.assign({ repo: '', branch: 'main', file: 'js/overrides.js' }, C.editor || {});
  let themeTouched = !!O.theme, dirty = false;

  const PRESETS = {
    "Pink Garden": { primary: "#6b2433", accent: "#c98b6b", background: "#f7efe4", surface: "#fffaf3", text: "#3a2227", petal: "#eab796", petalDark: "#7e2a3a", cream: "#f3e6da", leaf: "#6b7558", bloomPink: "#e8a1b0", leafMauve: "#b8928c" },
    "Peach Maroon Cream": { primary: "#6b2433", accent: "#c98b6b", background: "#f7efe4", surface: "#fffaf3", text: "#3a2227", petal: "#eab796", petalDark: "#7e2a3a", cream: "#eee0c8", leaf: "#55634a", bloomPink: "#eab796", leafMauve: "#a98f7f" },
    "Dusty Rose": { primary: "#7a5c3e", accent: "#c9a86a", background: "#fbf7f1", surface: "#ffffff", text: "#3d3128", petal: "#e8b4b8", petalDark: "#c47f86", leaf: "#8aa17a", bloomPink: "#e8b4b8", leafMauve: "#b9a39a" },
    "Sage Green": { primary: "#4f6b52", accent: "#b9a77a", background: "#f5f6f0", surface: "#ffffff", text: "#2f3a30", petal: "#f3efe6", petalDark: "#d9cfba", leaf: "#7f9c7e", bloomPink: "#f1e4dc", leafMauve: "#8fa38c" },
    "Navy & Gold": { primary: "#1f2f4f", accent: "#c8a24a", background: "#f7f5ef", surface: "#ffffff", text: "#1e2533", petal: "#f4f1ea", petalDark: "#c9bfa8", leaf: "#6f8a74", bloomPink: "#efe6dc", leafMauve: "#9aa59a" },
    "Maroon Klasik": { primary: "#6d1f2c", accent: "#c6a15b", background: "#faf6f0", surface: "#ffffff", text: "#2f1d20", petal: "#b84a5b", petalDark: "#7d2335", leaf: "#5f7d5a", bloomPink: "#c9667a", leafMauve: "#9b7f78" }
  };
  const COLORS = [["primary", "Utama"], ["accent", "Aksen"], ["background", "Latar"], ["surface", "Kartu"], ["text", "Teks"], ["bloomPink", "Bunga pink"], ["petal", "Peach"], ["petalDark", "Maroon"], ["cream", "Cream"], ["leafMauve", "Daun mauve"], ["leaf", "Daun hijau"]];
  const FONTS_T = ["Pinyon Script", "Great Vibes", "Parisienne", "Alex Brush", "Dancing Script", "Allura"];
  const FONTS_H = ["Cormorant Garamond", "Playfair Display", "Cinzel", "Lora", "Marcellus"];
  const FONTS_B = ["Jost", "Poppins", "Montserrat", "Lato", "Nunito"];

  const css = `#edp{position:fixed;left:12px;top:12px;z-index:200;width:290px;max-height:calc(100vh - 24px);overflow:auto;background:#fff;color:#222;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:13px/1.4 system-ui,sans-serif;padding:12px}
  #edp h5{font-size:14px;margin:0 0 8px;padding-right:24px}#edp .row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:6px 0}
  #edp input[type=color]{width:42px;height:26px;border:0;padding:0;background:none}#edp select{width:150px}#edp input[type=range]{flex:1;min-width:0}
  #edp input[type=text],#edp input[type=password]{width:100%;font:inherit;padding:7px 8px;border:1px solid #ccc;border-radius:7px;box-sizing:border-box}
  #edp label.f{display:block;margin:8px 0 3px;font-weight:600;font-size:12px}
  #edp .btns{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}#edp button{flex:1;border:0;border-radius:8px;padding:8px;background:#222;color:#fff;cursor:pointer}
  #edp button.sec{background:#eee;color:#222}#edp button.go{background:#2e7d32}#edp button:disabled{opacity:.5}
  #edp .min{position:absolute;right:10px;top:8px;background:none;color:#222;flex:none;padding:0 4px;font-size:16px}
  #edp .tabs{display:flex;gap:4px;margin-bottom:8px}#edp .tabs button{padding:6px 4px;background:#f1f1f1;color:#333;font-size:12px}#edp .tabs button.on{background:#222;color:#fff}
  #edp .pane{display:none}#edp .pane.on{display:block}
  #edp.collapsed>*:not(h5):not(.min){display:none}#edp hr{border:0;border-top:1px solid #eee;margin:8px 0}
  #edp .hint{font-size:12px;color:#666;margin:6px 0}#edp .msg{font-size:12px;margin-top:8px;white-space:pre-line}#edp .msg.ok{color:#2e7d32}#edp .msg.err{color:#c62828}
  #edp .sel{font-weight:600;word-break:break-all}#edp .dirty{display:inline-block;background:#ffb300;color:#222;border-radius:999px;padding:0 7px;font-size:11px;margin-left:6px}
  body.ed-photo .ph{outline:2px dashed rgba(255,255,255,.9);outline-offset:-4px;cursor:pointer}
  body.ed-photo .ph.ed-on{outline:3px solid #ffb300;cursor:grab;touch-action:none}
  body.ed-photo .ph.ed-on:active{cursor:grabbing}
  body.ed-photo .hero::after,body.ed-photo .cover-bg::after,body.ed-photo .closing-photo::after{pointer-events:none}
  body.ed-photo .reveal{opacity:1!important;transform:none!important}
  @media (max-width:600px){#edp{left:8px;right:8px;top:auto;bottom:8px;width:auto;max-height:46vh}}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

  const opt = (arr, v) => arr.map((x) => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');
  const el = document.createElement('div'); el.id = 'edp';
  el.innerHTML = `<h5>✏️ Editor Undangan<span class="dirty" id="eDirty" hidden>belum disimpan</span></h5><button class="min" title="Kecilkan">–</button>
    <div class="tabs"><button data-tab="desain" class="on">🎨 Desain</button><button data-tab="foto">📷 Foto</button><button data-tab="simpan">💾 Simpan</button></div>

    <div class="pane on" data-pane="desain">
      <div class="row"><span>Preset warna</span><select id="ePreset"><option value="">— pilih —</option>${Object.keys(PRESETS).map((k) => `<option>${k}</option>`).join('')}</select></div><hr>
      ${COLORS.map(([k, l]) => `<div class="row"><span>${l}</span><input type="color" data-k="${k}" value="${T[k] || '#eee0c8'}"></div>`).join('')}<hr>
      <div class="row"><span>Gaya bunga</span><select id="eStyle">${opt(window.FLOWER_STYLES, T.flowerStyle)}</select></div>
      <div class="row"><span>Ukuran bunga</span><input type="range" id="eSize" min="0.6" max="1.6" step="0.05" value="${T.flowerSize}"></div>
      <div class="row"><span>Bunga bergoyang</span><input type="checkbox" id="eSway" ${T.flowerSway ? 'checked' : ''}></div><hr>
      <div class="row"><span>Font judul</span><select data-f="fontTitle">${opt(FONTS_T, T.fontTitle)}</select></div>
      <div class="row"><span>Font heading</span><select data-f="fontHeading">${opt(FONTS_H, T.fontHeading)}</select></div>
      <div class="row"><span>Font isi</span><select data-f="fontBody">${opt(FONTS_B, T.fontBody)}</select></div>
    </div>

    <div class="pane" data-pane="foto">
      <p class="hint">Klik foto mana pun di undangan. Lalu atur zoom dan <b>seret foto</b> untuk menggeser posisinya. Di komputer bisa juga scroll di atas foto untuk zoom.</p>
      <div class="btns" style="margin-top:4px"><button class="sec" id="eCover">Tampilkan cover</button></div>
      <hr><p class="hint">Foto terpilih: <span class="sel" id="eSel">belum ada</span></p>
      <div class="row"><button class="sec" id="eZo" style="flex:none;width:34px">−</button><input type="range" id="eZoom" min="1" max="3" step="0.01" value="1" disabled><button class="sec" id="eZi" style="flex:none;width:34px">+</button></div>
      <div class="row"><span>Zoom</span><b id="eZv">1.00×</b></div>
      <div class="btns"><button class="sec" id="eReset" disabled>Reset foto ini</button><button class="sec" id="eDone" disabled>Selesai</button></div>
    </div>

    <div class="pane" data-pane="simpan">
      <p class="hint">Menyimpan pengaturan foto${themeTouched ? ' dan desain' : ''} ke <b>${E.file}</b> di GitHub. Situs diperbarui otomatis ±1–2 menit setelah tersimpan.</p>
      <label class="f" for="eRepo">Repo</label><input type="text" id="eRepo" value="${E.repo}">
      <label class="f" for="eBranch">Branch</label><input type="text" id="eBranch" value="${E.branch}">
      <label class="f" for="eTok">Token GitHub (fine-grained, akses Contents: Read & write)</label><input type="password" id="eTok" autocomplete="off" placeholder="github_pat_…">
      <div class="row" style="justify-content:flex-start"><input type="checkbox" id="eRem"><label for="eRem">Ingat token di perangkat ini</label></div>
      <div class="btns"><button class="go" id="eSave">Simpan ke GitHub</button></div>
      <div class="btns"><button class="sec" id="eCopy">Salin isi overrides.js</button><button class="sec" id="eClear">Hapus token</button></div>
      <div class="msg" id="eMsg" role="status"></div>
    </div>`;
  document.body.appendChild(el);
  const $e = (s) => el.querySelector(s);

  const setDirty = () => { dirty = true; $e('#eDirty').hidden = false; };
  window.addEventListener('beforeunload', (ev) => { if (dirty) { ev.preventDefault(); ev.returnValue = ''; } });

  /* ---------- tab ---------- */
  el.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('[data-tab]').forEach((x) => x.classList.toggle('on', x === b));
    el.querySelectorAll('[data-pane]').forEach((p) => p.classList.toggle('on', p.dataset.pane === b.dataset.tab));
    document.body.classList.toggle('ed-photo', b.dataset.tab === 'foto');
    if (b.dataset.tab !== 'foto') select(null);
  }));
  el.querySelector('.min').addEventListener('click', () => el.classList.toggle('collapsed'));

  /* ---------- desain ---------- */
  const refresh = () => { themeTouched = true; setDirty(); window.applyTheme(T); };
  el.querySelectorAll('input[type=color]').forEach((i) => i.addEventListener('input', () => { T[i.dataset.k] = i.value; refresh(); }));
  el.querySelectorAll('select[data-f]').forEach((s) => s.addEventListener('change', () => { T[s.dataset.f] = s.value; refresh(); }));
  $e('#eStyle').addEventListener('change', (e) => { T.flowerStyle = e.target.value; refresh(); });
  $e('#eSize').addEventListener('input', (e) => { T.flowerSize = +e.target.value; refresh(); });
  $e('#eSway').addEventListener('change', (e) => { T.flowerSway = e.target.checked; refresh(); });
  $e('#ePreset').addEventListener('change', (e) => {
    const p = PRESETS[e.target.value]; if (!p) return;
    Object.assign(T, p);
    el.querySelectorAll('input[type=color]').forEach((i) => { i.value = T[i.dataset.k] || '#eee0c8'; });
    refresh();
  });

  /* ---------- foto ---------- */
  const cover = document.getElementById('cover');
  const toggleCover = () => {
    cover.classList.toggle('gone'); document.body.classList.toggle('locked', !cover.classList.contains('gone'));
    $e('#eCover').textContent = cover.classList.contains('gone') ? 'Tampilkan cover' : 'Tutup cover';
  document.getElementById('openBtn').addEventListener('click', () => setTimeout(() => { $e('#eCover').textContent = 'Tampilkan cover'; }, 50));
    setTimeout(window.frameAll, 60);
  };
  $e('#eCover').addEventListener('click', toggleCover);
  $e('#eCover').textContent = cover.classList.contains('gone') ? 'Tampilkan cover' : 'Tutup cover';
  document.getElementById('openBtn').addEventListener('click', () => setTimeout(() => { $e('#eCover').textContent = 'Tampilkan cover'; }, 50));

  let cur = null;
  const label = (ph) => ph.getAttribute('aria-label') || ({ cover: 'Cover', hero: 'Save the Date', closing: 'Penutup' })[ph.dataset.img] || ph.dataset.src.split('/').pop();
  function frameOf(ph) {
    const src = ph.dataset.src;
    if (!C.framing[src]) {
      const cs = getComputedStyle(ph);
      const px = parseFloat(cs.backgroundPositionX), py = parseFloat(cs.backgroundPositionY);
      C.framing[src] = { z: 1, x: isNaN(px) || !/%/.test(cs.backgroundPositionX) ? 50 : px, y: isNaN(py) || !/%/.test(cs.backgroundPositionY) ? 50 : py };
    }
    return C.framing[src];
  }
  const sameSrc = (ph) => document.querySelectorAll('.ph').forEach((x) => { if (x.dataset.src === ph.dataset.src) window.framePhoto(x); });
  function showVals() {
    const f = cur && C.framing[cur.dataset.src];
    $e('#eZoom').value = f ? f.z : 1; $e('#eZv').textContent = (f ? f.z : 1).toFixed(2) + '×';
  }
  function select(ph) {
    if (cur) cur.classList.remove('ed-on');
    cur = ph;
    ['#eZoom', '#eReset', '#eDone'].forEach((s) => { $e(s).disabled = !ph; });
    $e('#eSel').textContent = ph ? label(ph) : 'belum ada';
    if (ph) { ph.classList.add('ed-on'); frameOf(ph); sameSrc(ph); }
    showVals();
  }
  const setZoom = (z) => {
    if (!cur) return;
    const f = frameOf(cur); f.z = Math.min(3, Math.max(1, Math.round(z * 100) / 100));
    sameSrc(cur); showVals(); setDirty();
  };
  $e('#eZoom').addEventListener('input', (e) => setZoom(+e.target.value));
  $e('#eZi').addEventListener('click', () => cur && setZoom(frameOf(cur).z + 0.05));
  $e('#eZo').addEventListener('click', () => cur && setZoom(frameOf(cur).z - 0.05));
  $e('#eDone').addEventListener('click', () => select(null));
  $e('#eReset').addEventListener('click', () => {
    if (!cur) return; delete C.framing[cur.dataset.src];
    const ph = cur; ph.style.backgroundPosition = ''; sameSrc(ph); setDirty(); select(ph);
  });

  // klik untuk memilih (fase capture agar tidak membuka lightbox / link)
  document.addEventListener('click', (ev) => {
    if (!document.body.classList.contains('ed-photo') || el.contains(ev.target)) return;
    const ph = ev.target.closest('.ph'); if (!ph) return;
    ev.preventDefault(); ev.stopPropagation();
    if (ph !== cur) select(ph);
  }, true);

  // seret untuk menggeser
  let drag = null;
  document.addEventListener('pointerdown', (ev) => {
    if (!cur || !document.body.classList.contains('ed-photo')) return;
    const ph = ev.target.closest('.ph'); if (ph !== cur) return;
    const bs = getComputedStyle(cur).backgroundSize.split(' ').map(parseFloat);
    const f = frameOf(cur);
    drag = { x: ev.clientX, y: ev.clientY, fx: f.x, fy: f.y, bw: bs[0], bh: bs[1] || bs[0], w: cur.clientWidth, h: cur.clientHeight };
    if (isNaN(drag.bw)) { window.framePhoto(cur); drag = null; return; }
    cur.setPointerCapture && cur.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  });
  document.addEventListener('pointermove', (ev) => {
    if (!drag || !cur) return;
    const f = frameOf(cur), ox = drag.bw - drag.w, oy = drag.bh - drag.h;
    if (ox > 1) f.x = Math.min(100, Math.max(0, drag.fx - (ev.clientX - drag.x) / ox * 100));
    if (oy > 1) f.y = Math.min(100, Math.max(0, drag.fy - (ev.clientY - drag.y) / oy * 100));
    f.x = Math.round(f.x * 10) / 10; f.y = Math.round(f.y * 10) / 10;
    sameSrc(cur); setDirty();
  });
  const endDrag = () => { drag = null; };
  document.addEventListener('pointerup', endDrag); document.addEventListener('pointercancel', endDrag);
  document.addEventListener('wheel', (ev) => {
    if (!cur || !document.body.classList.contains('ed-photo') || ev.target.closest('.ph') !== cur) return;
    ev.preventDefault(); setZoom(frameOf(cur).z - Math.sign(ev.deltaY) * 0.05);
  }, { passive: false });

  /* ---------- simpan ke GitHub ---------- */
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
  const saved = store.get('inv_gh_token'); if (saved) { $e('#eTok').value = saved; $e('#eRem').checked = true; }
  const msg = (t, cls) => { const m = $e('#eMsg'); m.textContent = t; m.className = 'msg ' + (cls || ''); };

  function buildFile() {
    const framing = {};
    Object.keys(C.framing).sort().forEach((k) => { const f = C.framing[k]; if (f) framing[k] = { z: f.z, x: f.x, y: f.y }; });
    const out = { framing };
    if (themeTouched) out.theme = Object.assign({}, T, { flowerImages: undefined });
    return '/* Dibuat otomatis oleh Editor (?edit=1 → Simpan ke GitHub) pada ' + new Date().toLocaleString('id-ID') + '.\n'
      + '   Boleh diganti dengan  window.INVITATION_OVERRIDES = {};  untuk kembali ke pengaturan js/config.js. */\n'
      + 'window.INVITATION_OVERRIDES = ' + JSON.stringify(out, null, 2) + ';\n';
  }
  const b64 = (s) => btoa(unescape(encodeURIComponent(s)));

  $e('#eCopy').addEventListener('click', () => {
    const t = buildFile();
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => msg('Isi file tersalin. Tempel ke ' + E.file + ' di GitHub bila perlu.', 'ok'), () => msg(t));
  });
  $e('#eClear').addEventListener('click', () => { store.set('inv_gh_token', null); $e('#eTok').value = ''; $e('#eRem').checked = false; msg('Token dihapus dari perangkat ini.', 'ok'); });

  $e('#eSave').addEventListener('click', async () => {
    const repo = $e('#eRepo').value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const branch = $e('#eBranch').value.trim() || 'main';
    const tok = $e('#eTok').value.trim();
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return msg('Format repo harus pemilik/nama-repo, misalnya solidus-ui/undangan.', 'err');
    if (!tok) return msg('Isi token GitHub dulu. Cara membuatnya ada di PANDUAN.md bagian 7.', 'err');
    store.set('inv_gh_token', $e('#eRem').checked ? tok : null);
    const btn = $e('#eSave'); btn.disabled = true; msg('Menyimpan ke GitHub…');
    const api = `https://api.github.com/repos/${repo}/contents/${E.file}`;
    const headers = { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    try {
      let sha;
      const g = await fetch(api + '?ref=' + encodeURIComponent(branch), { headers, cache: 'no-store' });
      if (g.status === 401) throw new Error('Token tidak valid atau sudah kedaluwarsa.');
      if (g.status === 403) throw new Error('Token tidak punya izin ke repo ini. Pastikan akses "Contents: Read and write" untuk ' + repo + '.');
      if (g.ok) sha = (await g.json()).sha;
      else if (g.status !== 404) throw new Error('GitHub menjawab ' + g.status + ' saat membaca file.');
      const p = await fetch(api, { method: 'PUT', headers, body: JSON.stringify({ message: 'Editor: perbarui foto' + (themeTouched ? ' & desain' : '') + ' undangan', content: b64(buildFile()), branch, sha }) });
      const res = await p.json().catch(() => ({}));
      if (p.status === 409) throw new Error('File berubah di GitHub sejak halaman dibuka. Muat ulang halaman lalu simpan lagi.');
      if (p.status === 404) throw new Error('Repo atau branch tidak ditemukan, atau token tidak bisa mengaksesnya.');
      if (!p.ok) throw new Error((res && res.message) || ('Gagal menyimpan (kode ' + p.status + ').'));
      dirty = false; $e('#eDirty').hidden = true;
      msg('Tersimpan ✓ (commit ' + String(res.commit && res.commit.sha || '').slice(0, 7) + ').\nSitus GitHub Pages akan menampilkan perubahan dalam ±1–2 menit.', 'ok');
    } catch (e) {
      msg((e && e.message && e.message !== 'Failed to fetch') ? e.message : 'Tidak bisa menghubungi GitHub dari halaman ini. Buka editor dari situs GitHub Pages (…github.io/undangan/?edit=1), atau pakai "Salin isi overrides.js".', 'err');
    }
    btn.disabled = false;
  });
})();
