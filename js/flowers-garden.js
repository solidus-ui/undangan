/* =========================================================================
   GAYA BUNGA "garden" — peony & garden rose mekar penuh (pink, dusty rose,
   maroon), bunga kecil cream bertengah kuning, kuncup, daun mauve.
   Dipakai jika theme.flowerStyle = "garden". Warna diambil dari theme:
   bloomPink, petalDark (maroon), cream, leafMauve (opsional).
   ========================================================================= */
(function () {
  const R = (n) => Math.round(n * 10) / 10;
  function hex(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const rad = (d) => (d * Math.PI) / 180;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  let uid = 0;

  function palette(c) {
    const pink = c.bloomPink || '#e8a1b0', maroon = c.petalDark || '#7e2a3a', cream = c.cream || '#f3e6da';
    return {
      pink, maroon, cream,
      blush: mix(pink, '#ffffff', .45),
      rose: mix(pink, maroon, .25),
      deep: mix(maroon, '#000000', .25),
      mauve: c.leafMauve || mix(mix(pink, '#8a6f68', .6), cream, .15),
      mauveDark: mix(c.leafMauve || mix(pink, '#8a6f68', .6), '#3b2a28', .3),
      yellow: '#f2c94c'
    };
  }

  /* gradient per bunga: pangkal kelopak gelap → ujung terang */
  function grad(id, name, base, tip) {
    return `<linearGradient id="${name}${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${base}"/><stop offset="1" stop-color="${tip}"/></linearGradient>`;
  }

  /* satu kelopak dengan ujung bergelombang */
  function petal(w, h, ruffle) {
    const r = ruffle || 0.06;
    return `M0 0 C ${R(-w * 0.95)} ${R(-h * 0.18)}, ${R(-w * 0.85)} ${R(-h * 0.8)}, ${R(-w * 0.5)} ${R(-h * 0.92)}`
      + ` Q ${R(-w * 0.25)} ${R(-h * (1 + r))} 0 ${R(-h * 0.95)}`
      + ` Q ${R(w * 0.25)} ${R(-h * (1 + r))} ${R(w * 0.5)} ${R(-h * 0.92)}`
      + ` C ${R(w * 0.85)} ${R(-h * 0.8)}, ${R(w * 0.95)} ${R(-h * 0.18)}, 0 0Z`;
  }

  /* garden rose: cangkir berlapis dengan pusat spiral */
  function gardenRose(x, y, r, g, P, id, tilt) {
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(tilt || 0)})" filter="url(#gs${id})">`;
    const rings = [[8, 1, .62, 0], [7, .82, .56, 22], [6, .64, .5, 8], [5, .46, .44, 30]];
    rings.forEach(([n, k, wk, off], ri) => {
      for (let i = 0; i < n; i++) {
        const a = i * 360 / n + off;
        s += `<path d="${petal(r * k * wk * 1.5, r * k, .08)}" fill="url(#${g}${ri}${id})" stroke="${P.deep}" stroke-opacity=".18" stroke-width=".5" transform="rotate(${R(a)})"/>`;
      }
    });
    // pusat spiral
    s += `<circle r="${R(r * 0.3)}" fill="url(#${g}3${id})"/>`;
    s += `<path d="M${R(-r * .22)} ${R(r * .02)} A ${R(r * .22)} ${R(r * .22)} 0 1 1 ${R(r * .14)} ${R(r * .17)}" stroke="${P.deep}" stroke-opacity=".45" stroke-width="${R(r * .05)}" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${R(-r * .1)} 0 A ${R(r * .1)} ${R(r * .1)} 0 1 1 ${R(r * .06)} ${R(r * .07)}" stroke="${P.deep}" stroke-opacity=".55" stroke-width="${R(r * .04)}" fill="none" stroke-linecap="round"/>`;
    return s + `</g>`;
  }

  /* peony: kelopak banyak & bergerigi, sedikit miring (dilihat dari samping) */
  function peony(x, y, r, g, P, id, tilt) {
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(tilt || 0)}) scale(1 .86)" filter="url(#gs${id})">`;
    const rings = [[11, 1, .55, 0], [10, .84, .52, 16], [9, .68, .5, 5], [8, .52, .48, 24], [6, .36, .46, 10]];
    rings.forEach(([n, k, wk, off], ri) => {
      for (let i = 0; i < n; i++) {
        const a = i * 360 / n + off + (i % 2 ? 4 : -4);
        const kk = k * (i % 3 === 0 ? 1.05 : .96);
        s += `<path d="${petal(r * kk * wk * 1.45, r * kk, .14)}" fill="url(#${g}${Math.min(ri, 3)}${id})" stroke="${P.deep}" stroke-opacity=".14" stroke-width=".5" transform="rotate(${R(a)})"/>`;
      }
    });
    s += `<circle r="${R(r * .16)}" fill="${P.yellow}" opacity=".55"/>`;
    return s + `</g>`;
  }

  /* bunga kecil cream bertengah kuning */
  function daisy(x, y, r, P, rot) {
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(rot || 0)})">`;
    for (let i = 0; i < 6; i++) s += `<path d="${petal(r * .75, r, .05)}" fill="${mix(P.cream, '#ffffff', .4)}" stroke="${mix(P.pink, P.cream, .4)}" stroke-width=".6" transform="rotate(${i * 60})"/>`;
    s += `<circle r="${R(r * .3)}" fill="${P.yellow}"/><circle r="${R(r * .3)}" fill="none" stroke="#d9a72f" stroke-width=".6" stroke-dasharray="1 1.2"/>`;
    return s + `</g>`;
  }

  function leaf(x, y, len, ang, col, vein) {
    const w = len * .36;
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})"><path d="M0 0 C ${R(len * .3)} ${R(-w)}, ${R(len * .75)} ${R(-w * .8)}, ${R(len)} 0 C ${R(len * .75)} ${R(w * .8)}, ${R(len * .3)} ${R(w)}, 0 0Z" fill="${col}"/><path d="M0 0 Q ${R(len * .5)} ${R(-w * .12)} ${R(len * .92)} 0" stroke="${vein}" stroke-width=".7" fill="none" opacity=".8"/></g>`;
  }

  function bud(x, y, len, ang, P) {
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})"><path d="M0 0 L${R(len * .5)} 0" stroke="${P.mauveDark}" stroke-width="1.1"/>`
      + `<path d="M${R(len * .42)} 0 C ${R(len * .55)} ${R(-len * .3)}, ${R(len * .98)} ${R(-len * .22)}, ${R(len)} 0 C ${R(len * .98)} ${R(len * .22)}, ${R(len * .55)} ${R(len * .3)}, ${R(len * .42)} 0Z" fill="${P.rose}"/>`
      + `<path d="M${R(len * .4)} 0 Q ${R(len * .6)} ${R(-len * .24)} ${R(len * .78)} ${R(-len * .08)} M${R(len * .4)} 0 Q ${R(len * .6)} ${R(len * .24)} ${R(len * .78)} ${R(len * .08)}" stroke="${P.mauve}" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
  }

  function sprig(x, y, len, ang, P) {
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})"><path d="M0 0 Q ${R(len * .5)} ${R(-len * .08)} ${R(len)} 0" stroke="${P.mauveDark}" stroke-width=".8" fill="none"/>`;
    for (let i = 1; i <= 4; i++) { const t = i / 5; s += `<circle cx="${R(len * t)}" cy="${R(-len * .05 + (i % 2 ? -3 : 3))}" r="1.6" fill="${i % 2 ? P.pink : P.blush}"/>`; }
    return s + `<circle cx="${R(len)}" cy="0" r="2" fill="${P.pink}"/></g>`;
  }

  function defs(P, id) {
    const g = (name, stops) => stops.map(([b, t], i) => grad(id, name + i, b, t)).join('');
    return `<defs>
      <filter id="gs${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx=".6" dy="1.4" stdDeviation="1.6" flood-color="${P.deep}" flood-opacity=".22"/></filter>
      ${g('gp', [[mix(P.pink, P.maroon, .15), P.blush], [mix(P.pink, P.maroon, .22), mix(P.pink, '#ffffff', .3)], [mix(P.pink, P.maroon, .32), P.pink], [mix(P.pink, P.maroon, .5), mix(P.pink, P.maroon, .12)]])}
      ${g('gm', [[P.deep, mix(P.maroon, P.pink, .3)], [mix(P.deep, '#000000', .1), mix(P.maroon, P.pink, .2)], [mix(P.deep, '#000000', .2), P.maroon], [mix(P.deep, '#000000', .3), mix(P.maroon, '#000000', .1)]])}
      ${g('gc', [[mix(P.cream, P.pink, .45), mix(P.cream, '#ffffff', .5)], [mix(P.cream, P.pink, .55), mix(P.cream, '#ffffff', .35)], [mix(P.cream, P.pink, .65), P.cream], [mix(P.cream, P.rose, .7), mix(P.cream, P.pink, .4)]])}
      ${g('gr', [[mix(P.rose, P.maroon, .2), mix(P.pink, '#ffffff', .2)], [mix(P.rose, P.maroon, .3), P.pink], [mix(P.rose, P.maroon, .4), P.rose], [mix(P.rose, P.maroon, .55), mix(P.rose, P.maroon, .25)]])}
    </defs>`;
  }

  /* Rangkaian pojok (posisi kiri-atas; pojok lain dicerminkan CSS) */
  function corner(c) {
    const id = 'g' + (++uid), P = palette(c);
    let s = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(P, id)}`;
    // daun mauve menyebar ke dua arah
    [[70, 20, 34, -18, 0], [110, 26, 30, 14, 1], [150, 30, 26, -10, 0], [20, 70, 34, 108, 1], [26, 110, 30, 76, 0], [30, 150, 26, 100, 1],
     [88, 60, 26, 40, 1], [60, 88, 26, 50, 0], [128, 52, 22, 30, 0], [52, 128, 22, 60, 1]]
      .forEach(([x, y, l, a, d]) => { s += leaf(x, y, l, a, d ? P.mauve : mix(P.mauve, P.cream, .3), mix(P.mauve, '#ffffff', .4)); });
    s += sprig(150, 40, 46, 8, P) + sprig(40, 150, 46, 82, P) + sprig(112, 70, 34, 28, P) + sprig(70, 112, 34, 62, P);
    s += bud(160, 22, 22, 4, P) + bud(22, 160, 22, 86, P) + bud(126, 86, 18, 40, P);
    s += daisy(132, 30, 10, P, 10) + daisy(30, 132, 10, P, 30) + daisy(104, 92, 8, P, 0) + daisy(178, 44, 7, P, 20) + daisy(44, 178, 7, P, 40);
    // daun tambahan di belakang gugusan
    [[58, 14, 30, -40], [14, 58, 30, 130], [96, 66, 28, 20], [66, 96, 28, 70], [118, 18, 24, -30], [18, 118, 24, 120]]
      .forEach(([x, y, l, a2], i) => { s += leaf(x, y, l, a2, i % 2 ? P.mauveDark : P.mauve, mix(P.mauve, '#ffffff', .4)); });
    // bunga utama (rapat & menumpuk)
    s += gardenRose(96, 40, 24, 'gr', P, id, 20);
    s += gardenRose(40, 96, 24, 'gp', P, id, -10);
    s += gardenRose(78, 76, 20, 'gm', P, id, 30);
    s += peony(34, 34, 38, 'gp', P, id, 0);
    s += gardenRose(74, 16, 16, 'gm', P, id, 0);
    s += gardenRose(16, 74, 15, 'gc', P, id, 0);
    s += gardenRose(112, 70, 11, 'gc', P, id, 10);
    s += daisy(118, 48, 8, P, 15) + daisy(48, 118, 8, P, 45) + daisy(96, 96, 7, P, 5);
    return s + `</svg>`;
  }

  /* Pembatas horizontal */
  function divider(c) {
    const id = 'g' + (++uid), P = palette(c);
    let s = `<svg viewBox="0 0 300 76" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(P, id)}`;
    [[118, 40, 30, 196], [182, 40, 30, -16], [96, 36, 24, 170], [204, 36, 24, 10], [74, 40, 20, 194], [226, 40, 20, -14]]
      .forEach(([x, y, l, a], i) => { s += leaf(x, y, l, a, i % 2 ? P.mauve : mix(P.mauve, P.cream, .3), mix(P.mauve, '#ffffff', .4)); });
    s += sprig(72, 38, 36, 190, P) + sprig(228, 38, 36, -10, P);
    s += daisy(98, 30, 7, P, 0) + daisy(202, 30, 7, P, 30);
    s += gardenRose(124, 42, 12, 'gm', P, id, 10) + gardenRose(176, 42, 12, 'gr', P, id, -10);
    s += peony(150, 38, 18, 'gp', P, id, 0);
    return s + `</svg>`;
  }

  window.GARDEN_FLOWERS = { corner, divider };
})();
