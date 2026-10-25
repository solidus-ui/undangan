/* Panel editor desain — aktif hanya jika link memakai ?edit=1
   Ubah warna/bunga/font, lihat hasilnya langsung, lalu "Salin Config"
   dan tempelkan ke bagian theme di js/config.js. */
(function () {
  const T = window.INVITATION.theme;
  const PRESETS = {
    "Peach Maroon Cream": { primary: "#6b2433", accent: "#c98b6b", background: "#f7efe4", surface: "#fffaf3", text: "#3a2227", petal: "#eab796", petalDark: "#7e2a3a", cream: "#eee0c8", leaf: "#55634a" },
    "Dusty Rose": { primary: "#7a5c3e", accent: "#c9a86a", background: "#fbf7f1", surface: "#ffffff", text: "#3d3128", petal: "#e8b4b8", petalDark: "#c47f86", leaf: "#8aa17a" },
    "Sage Green": { primary: "#4f6b52", accent: "#b9a77a", background: "#f5f6f0", surface: "#ffffff", text: "#2f3a30", petal: "#f3efe6", petalDark: "#d9cfba", leaf: "#7f9c7e" },
    "Navy & Gold": { primary: "#1f2f4f", accent: "#c8a24a", background: "#f7f5ef", surface: "#ffffff", text: "#1e2533", petal: "#f4f1ea", petalDark: "#c9bfa8", leaf: "#6f8a74" },
    "Terracotta": { primary: "#9a4a2f", accent: "#d39b5b", background: "#fbf3ec", surface: "#fffaf6", text: "#3b2a22", petal: "#e9a77f", petalDark: "#c26a45", leaf: "#8b8d5a" },
    "Lilac": { primary: "#5d4a7a", accent: "#b8a1cf", background: "#f8f5fb", surface: "#ffffff", text: "#2e2638", petal: "#d8c6ec", petalDark: "#a88cc9", leaf: "#8aa48e" },
    "Maroon Klasik": { primary: "#6d1f2c", accent: "#c6a15b", background: "#faf6f0", surface: "#ffffff", text: "#2f1d20", petal: "#b84a5b", petalDark: "#7d2335", leaf: "#5f7d5a" }
  };
  const COLORS = [["primary", "Utama"], ["accent", "Aksen"], ["background", "Latar"], ["surface", "Kartu"], ["text", "Teks"], ["petal", "Kelopak"], ["petalDark", "Kelopak gelap"], ["cream", "Cream (pampas)"], ["leaf", "Daun"]];
  const FONTS_T = ["Pinyon Script", "Great Vibes", "Parisienne", "Alex Brush", "Dancing Script", "Allura"];
  const FONTS_H = ["Cormorant Garamond", "Playfair Display", "Cinzel", "Lora", "Marcellus"];
  const FONTS_B = ["Jost", "Poppins", "Montserrat", "Lato", "Nunito"];

  const css = `#edp{position:fixed;left:12px;top:12px;z-index:200;width:270px;max-height:calc(100vh - 24px);overflow:auto;background:#fff;color:#222;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.25);font:13px/1.4 system-ui,sans-serif;padding:12px}
  #edp h5{font-size:14px;margin:0 0 8px}#edp .row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0}
  #edp input[type=color]{width:42px;height:26px;border:0;padding:0;background:none}#edp select,#edp input[type=range]{width:140px}
  #edp .btns{display:flex;gap:6px;margin-top:10px}#edp button{flex:1;border:0;border-radius:8px;padding:8px;background:#222;color:#fff}
  #edp .min{position:absolute;right:10px;top:8px;background:none;color:#222;flex:none;padding:0 4px;font-size:16px}
  #edp.collapsed>*:not(h5):not(.min){display:none}#edp hr{border:0;border-top:1px solid #eee;margin:8px 0}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

  const opt = (arr, v) => arr.map((x) => `<option ${x === v ? 'selected' : ''}>${x}</option>`).join('');
  const el = document.createElement('div'); el.id = 'edp';
  el.innerHTML = `<h5>🎨 Editor Desain</h5><button class="min" title="Kecilkan">–</button>
    <div class="row"><span>Preset warna</span><select id="ePreset"><option value="">— pilih —</option>${Object.keys(PRESETS).map((k) => `<option>${k}</option>`).join('')}</select></div><hr>
    ${COLORS.map(([k, l]) => `<div class="row"><span>${l}</span><input type="color" data-k="${k}" value="${T[k] || '#eee0c8'}"></div>`).join('')}<hr>
    <div class="row"><span>Gaya bunga</span><select id="eStyle">${opt(window.FLOWER_STYLES, T.flowerStyle)}</select></div>
    <div class="row"><span>Ukuran bunga</span><input type="range" id="eSize" min="0.6" max="1.6" step="0.05" value="${T.flowerSize}"></div>
    <div class="row"><span>Bunga bergoyang</span><input type="checkbox" id="eSway" ${T.flowerSway !== false ? 'checked' : ''}></div><hr>
    <div class="row"><span>Font judul</span><select data-f="fontTitle">${opt(FONTS_T, T.fontTitle)}</select></div>
    <div class="row"><span>Font heading</span><select data-f="fontHeading">${opt(FONTS_H, T.fontHeading)}</select></div>
    <div class="row"><span>Font isi</span><select data-f="fontBody">${opt(FONTS_B, T.fontBody)}</select></div>
    <div class="btns"><button id="eCopy">Salin Config</button><button id="eClose" style="background:#888">Lihat Cover</button></div>`;
  document.body.appendChild(el);

  const refresh = () => window.applyTheme(T);
  el.querySelectorAll('input[type=color]').forEach((i) => i.addEventListener('input', () => { T[i.dataset.k] = i.value; refresh(); }));
  el.querySelectorAll('select[data-f]').forEach((s) => s.addEventListener('change', () => { T[s.dataset.f] = s.value; refresh(); }));
  el.querySelector('#eStyle').addEventListener('change', (e) => { T.flowerStyle = e.target.value; refresh(); });
  el.querySelector('#eSize').addEventListener('input', (e) => { T.flowerSize = +e.target.value; refresh(); });
  el.querySelector('#eSway').addEventListener('change', (e) => { T.flowerSway = e.target.checked; refresh(); });
  el.querySelector('#ePreset').addEventListener('change', (e) => {
    const p = PRESETS[e.target.value]; if (!p) return;
    Object.assign(T, p);
    el.querySelectorAll('input[type=color]').forEach((i) => { i.value = T[i.dataset.k]; });
    refresh();
  });
  el.querySelector('#eCopy').addEventListener('click', (e) => {
    const txt = 'theme: ' + JSON.stringify(T, null, 2);
    navigator.clipboard.writeText(txt).then(() => { e.target.textContent = 'Tersalin ✓'; setTimeout(() => (e.target.textContent = 'Salin Config'), 1800); });
  });
  el.querySelector('#eClose').addEventListener('click', () => {
    const c = document.getElementById('cover'); c.classList.toggle('gone'); document.body.classList.toggle('locked', !c.classList.contains('gone'));
  });
  el.querySelector('.min').addEventListener('click', () => el.classList.toggle('collapsed'));
})();
