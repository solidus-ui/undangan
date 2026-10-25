/* =========================================================================
   ORNAMEN BUNGA (SVG) — digambar dengan kode, jadi warna & gaya bisa diganti
   langsung dari config.js tanpa perlu file gambar.
   Untuk menambah gaya baru: tambahkan fungsi di FLOWER_DRAWERS.
   ========================================================================= */
(function () {
  const r1 = (n) => Math.round(n * 10) / 10;

  function leaf(x, y, len, angle, color, w) {
    w = w || len * 0.38;
    return `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(angle)})">
      <path d="M0 0 C ${r1(len*0.3)} ${r1(-w)}, ${r1(len*0.75)} ${r1(-w*0.8)}, ${r1(len)} 0 C ${r1(len*0.75)} ${r1(w*0.8)}, ${r1(len*0.3)} ${r1(w)}, 0 0Z" fill="${color}"/>
      <path d="M0 0 L ${r1(len*0.92)} 0" stroke="rgba(0,0,0,.18)" stroke-width="${r1(len*0.03)}" fill="none"/>
    </g>`;
  }

  const FLOWER_DRAWERS = {
    mawar(cx, cy, r, c) {
      let s = `<g transform="translate(${r1(cx)} ${r1(cy)})">`;
      s += `<circle r="${r1(r)}" fill="${c.petalDark}"/>`;
      for (let i = 0; i < 6; i++) {
        const a = i * 60;
        s += `<ellipse cx="0" cy="${r1(-r*0.45)}" rx="${r1(r*0.55)}" ry="${r1(r*0.6)}" fill="${c.petal}" transform="rotate(${a})" opacity=".95"/>`;
      }
      s += `<circle r="${r1(r*0.62)}" fill="${c.petalDark}" opacity=".55"/>`;
      s += `<path d="M ${r1(-r*0.45)} 0 A ${r1(r*0.45)} ${r1(r*0.45)} 0 1 1 ${r1(r*0.2)} ${r1(r*0.35)}" stroke="${c.petal}" stroke-width="${r1(r*0.16)}" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M ${r1(-r*0.18)} ${r1(-r*0.05)} A ${r1(r*0.22)} ${r1(r*0.22)} 0 1 1 ${r1(r*0.12)} ${r1(r*0.12)}" stroke="${c.petal}" stroke-width="${r1(r*0.12)}" fill="none" stroke-linecap="round"/>`;
      return s + `</g>`;
    },
    peony(cx, cy, r, c) {
      let s = `<g transform="translate(${r1(cx)} ${r1(cy)})">`;
      for (let ring = 0; ring < 3; ring++) {
        const n = 9 - ring * 2, rr = r * (1 - ring * 0.27);
        for (let i = 0; i < n; i++) {
          const a = (360 / n) * i + ring * 17;
          s += `<path d="M0 0 C ${r1(-rr*0.55)} ${r1(-rr*0.4)}, ${r1(-rr*0.45)} ${r1(-rr)}, 0 ${r1(-rr)} C ${r1(rr*0.45)} ${r1(-rr)}, ${r1(rr*0.55)} ${r1(-rr*0.4)}, 0 0Z" fill="${ring % 2 ? c.petalDark : c.petal}" opacity="${ring ? .9 : .85}" transform="rotate(${r1(a)})"/>`;
        }
      }
      s += `<circle r="${r1(r*0.16)}" fill="${c.accent}"/>`;
      return s + `</g>`;
    },
    melati(cx, cy, r, c) {
      let s = `<g transform="translate(${r1(cx)} ${r1(cy)})">`;
      for (let i = 0; i < 5; i++) {
        s += `<ellipse cx="0" cy="${r1(-r*0.55)}" rx="${r1(r*0.3)}" ry="${r1(r*0.55)}" fill="${c.petal}" stroke="${c.petalDark}" stroke-width="${r1(r*0.04)}" transform="rotate(${i * 72})"/>`;
      }
      s += `<circle r="${r1(r*0.17)}" fill="${c.accent}"/>`;
      return s + `</g>`;
    },
    daun(cx, cy, r, c) {
      // gaya minimalis: gugus daun eucalyptus + buah kecil
      let s = `<g transform="translate(${r1(cx)} ${r1(cy)})">`;
      for (let i = 0; i < 5; i++) {
        const a = i * 72 + 10;
        s += `<g transform="rotate(${a})"><ellipse cx="0" cy="${r1(-r*0.6)}" rx="${r1(r*0.36)}" ry="${r1(r*0.42)}" fill="${c.leaf}" opacity=".85"/></g>`;
      }
      s += `<circle r="${r1(r*0.2)}" fill="${c.petalDark}"/><circle cx="${r1(r*0.3)}" cy="${r1(r*0.15)}" r="${r1(r*0.12)}" fill="${c.petal}"/>`;
      return s + `</g>`;
    }
  };

  function drawFlower(style, cx, cy, r, c) {
    return (FLOWER_DRAWERS[style] || FLOWER_DRAWERS.mawar)(cx, cy, r, c);
  }

  /* Rangkaian sudut (dipakai di 4 pojok, dicerminkan dengan CSS) */
  function corner(c, style) {
    let s = `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    s += `<path d="M2 200 C 40 120, 90 60, 200 10" stroke="${c.leaf}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M10 130 C 40 100, 60 60, 70 8" stroke="${c.leaf}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
    const leaves = [[30,150,38,-150],[52,118,40,-30],[78,92,42,-160],[110,64,40,-20],[140,44,40,-165],[170,24,34,-25],[20,112,30,-110],[44,70,30,-60],[64,34,28,-100]];
    leaves.forEach(l => s += leaf(l[0], l[1], l[2], l[3], c.leaf));
    s += drawFlower(style, 34, 38, 30, c);
    s += drawFlower(style, 88, 30, 18, c);
    s += drawFlower(style, 26, 92, 18, c);
    s += `<circle cx="120" cy="20" r="4" fill="${c.accent}"/><circle cx="12" cy="150" r="3.5" fill="${c.accent}"/><circle cx="140" cy="14" r="2.6" fill="${c.petalDark}"/>`;
    return s + `</svg>`;
  }

  /* Pembatas antar bagian */
  function divider(c, style) {
    let s = `<svg viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    s += `<path d="M20 30 H120 M180 30 H280" stroke="${c.accent}" stroke-width="1.2"/>`;
    s += leaf(150, 30, 46, 185, c.leaf, 12) + leaf(150, 30, 46, -5, c.leaf, 12);
    s += leaf(150, 30, 32, 210, c.leaf, 10) + leaf(150, 30, 32, -30, c.leaf, 10);
    s += drawFlower(style, 150, 30, 15, c);
    s += `<circle cx="20" cy="30" r="2.5" fill="${c.accent}"/><circle cx="280" cy="30" r="2.5" fill="${c.accent}"/>`;
    return s + `</svg>`;
  }

  /* Pasang ornamen ke semua elemen [data-flower] */
  window.renderFlowers = function (theme) {
    const c = theme;
    const style = theme.flowerStyle;
    document.documentElement.style.setProperty('--flower-scale', theme.flowerSize || 1);
    document.body.classList.toggle('no-sway', theme.flowerSway === false);
    document.querySelectorAll('[data-flower]').forEach(el => {
      const kind = el.getAttribute('data-flower');
      if (style === 'boho' && window.BOHO_FLOWERS) {
        const t = Object.assign({ cream: '#efe2cc' }, c);
        el.innerHTML = kind === 'divider' ? window.BOHO_FLOWERS.divider(t) : window.BOHO_FLOWERS.corner(t);
      } else if (style === 'gambar') {
        const src = kind === 'divider' ? theme.flowerImages.divider : theme.flowerImages.corner;
        el.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
      } else {
        el.innerHTML = kind === 'divider' ? divider(c, style) : corner(c, style);
      }
    });
  };
  window.FLOWER_STYLES = ['boho'].concat(Object.keys(FLOWER_DRAWERS), ['gambar']);
})();
