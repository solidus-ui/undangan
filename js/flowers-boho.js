/* =========================================================================
   GAYA BUNGA "boho" — rangkaian detail ala cat air: pampas, daun palem kering,
   monstera, anthurium, mawar & baby's breath. Warna diambil dari theme:
   petal (peach), petalDark (maroon), cream, leaf.
   Dipakai jika theme.flowerStyle = "boho".
   ========================================================================= */
(function () {
  const R = (n) => Math.round(n * 10) / 10;
  // generator acak dengan seed tetap, supaya bentuk selalu sama
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function hex(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const rad = (d) => (d * Math.PI) / 180;
  const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];

  function defs(c, id) {
    return `<defs>
      <filter id="wc${id}" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d"/>
        <feGaussianBlur in="d" stdDeviation="0.25"/>
      </filter>
      <filter id="sh${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1" dy="2" stdDeviation="2.2" flood-color="${mix(c.petalDark, '#000000', .4)}" flood-opacity=".22"/></filter>
      <radialGradient id="an${id}" cx="35%" cy="40%" r="75%"><stop offset="0" stop-color="${mix(c.cream, '#ffffff', .5)}"/><stop offset=".6" stop-color="${c.cream}"/><stop offset="1" stop-color="${c.petal}"/></radialGradient>
      <radialGradient id="rm${id}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${mix(c.petalDark, '#000000', .25)}"/><stop offset="1" stop-color="${c.petalDark}"/></radialGradient>
      <radialGradient id="rp${id}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${mix(c.petal, c.petalDark, .35)}"/><stop offset="1" stop-color="${c.petal}"/></radialGradient>
      <radialGradient id="rc${id}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${mix(c.cream, c.petal, .45)}"/><stop offset="1" stop-color="${mix(c.cream, '#ffffff', .3)}"/></radialGradient>
      <linearGradient id="mo${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(c.leaf, '#000000', .15)}"/><stop offset="1" stop-color="${mix(c.leaf, '#000000', .45)}"/></linearGradient>
    </defs>`;
  }

  /* Rumput pampas: tangkai melengkung dengan bulu-bulu halus */
  function pampas(x, y, ang, len, c, seed, scale) {
    const r = rng(seed); scale = scale || 1;
    const bend = 18 * scale;
    const [ex, ey] = pt(x, y, len, ang);
    const [mx, my] = pt((x + ex) / 2, (y + ey) / 2, bend, ang - 90);
    let s = `<path d="M${R(x)} ${R(y)} Q${R(mx)} ${R(my)} ${R(ex)} ${R(ey)}" stroke="${mix(c.cream, c.leaf, .45)}" stroke-width="${R(1.4 * scale)}" fill="none"/>`;
    const N = Math.round(78 * scale);
    for (let i = 0; i < N; i++) {
      const t = 0.18 + (i / N) * 0.82;
      const bx = (1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * ex;
      const by = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * ey;
      const side = i % 2 ? 1 : -1;
      const L = (10 + 15 * Math.sin(Math.PI * Math.min(1, t * 1.1))) * scale * (0.7 + r() * 0.6);
      const a = ang + side * (28 + r() * 22);
      const [fx, fy] = pt(bx, by, L, a);
      const [cx2, cy2] = pt(bx, by, L * 0.6, a + side * 12);
      const col = r() < 0.25 ? mix(c.cream, c.petal, .35) : c.cream;
      s += `<path d="M${R(bx)} ${R(by)} Q${R(cx2)} ${R(cy2)} ${R(fx)} ${R(fy)}" stroke="${col}" stroke-width="${R((1.6 + r() * 2.2) * scale)}" stroke-linecap="round" fill="none" opacity="${R(0.45 + r() * 0.4)}"/>`;
    }
    return s;
  }

  /* Daun palem kering berbentuk kipas */
  function palmFan(cx, cy, r, a0, a1, c, seed) {
    const rr = rng(seed), n = 20;
    let s = '';
    for (let i = 0; i < n; i++) {
      const aa = a0 + ((a1 - a0) * i) / n, ab = a0 + ((a1 - a0) * (i + 1)) / n;
      const len = r * (0.82 + rr() * 0.22);
      const [p1x, p1y] = pt(cx, cy, len, aa), [p2x, p2y] = pt(cx, cy, len * (0.9 + rr() * 0.1), ab);
      const [tx, ty] = pt(cx, cy, len * 1.06, (aa + ab) / 2);
      const base = i % 3 === 0 ? mix(c.cream, c.petal, .45) : i % 3 === 1 ? mix(c.cream, '#b89a72', .45) : mix(c.cream, c.leaf, .22);
      s += `<path d="M${R(cx)} ${R(cy)} L${R(p1x)} ${R(p1y)} L${R(tx)} ${R(ty)} L${R(p2x)} ${R(p2y)}Z" fill="${base}"/>`;
      s += `<path d="M${R(cx)} ${R(cy)} L${R(tx)} ${R(ty)}" stroke="${mix(base, c.petalDark, .25)}" stroke-width=".7" opacity=".7"/>`;
    }
    const [sx, sy] = pt(cx, cy, r * 0.5, (a0 + a1) / 2 + 180);
    s += `<path d="M${R(cx)} ${R(cy)} L${R(sx)} ${R(sy)}" stroke="${mix(c.cream, c.leaf, .5)}" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r * 0.08)}" fill="${mix(c.cream, c.leaf, .35)}"/>`;
    return s;
  }

  /* Daun monstera dengan celah khas */
  function monstera(x, y, size, ang, id, n) {
    const mid = `mm${id}_${n}`;
    const w = size * 0.95, h = size;
    const leafPath = `M0 ${R(-h * 0.12)} C ${R(-w * 0.35)} ${R(h * 0.02)}, ${R(-w * 0.95)} ${R(-h * 0.05)}, ${R(-w * 0.8)} ${R(-h * 0.55)} C ${R(-w * 0.62)} ${R(-h * 0.92)}, ${R(-w * 0.2)} ${R(-h * 1.02)}, 0 ${R(-h)} C ${R(w * 0.2)} ${R(-h * 1.02)}, ${R(w * 0.62)} ${R(-h * 0.92)}, ${R(w * 0.8)} ${R(-h * 0.55)} C ${R(w * 0.95)} ${R(-h * 0.05)}, ${R(w * 0.35)} ${R(h * 0.02)}, 0 ${R(-h * 0.12)}Z`;
    let cuts = '';
    for (let i = 0; i < 5; i++) {
      const yy = -h * (0.2 + i * 0.15);
      const sw = R(size * (0.028 + (i % 2) * 0.008));
      cuts += `<path d="M${R(-w)} ${R(yy + h * 0.1)} Q ${R(-w * 0.6)} ${R(yy + h * 0.02)} ${R(-w * 0.28)} ${R(yy)}" stroke="#000" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
      cuts += `<path d="M${R(w)} ${R(yy + h * 0.12)} Q ${R(w * 0.6)} ${R(yy + h * 0.04)} ${R(w * 0.3)} ${R(yy + h * 0.02)}" stroke="#000" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
    }
    cuts += `<ellipse cx="${R(-w * 0.22)}" cy="${R(-h * 0.42)}" rx="${R(size * 0.035)}" ry="${R(size * 0.07)}" fill="#000"/><ellipse cx="${R(w * 0.24)}" cy="${R(-h * 0.6)}" rx="${R(size * 0.03)}" ry="${R(size * 0.06)}" fill="#000"/>`;
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})">
      <mask id="${mid}"><rect x="${R(-w)}" y="${R(-h * 1.1)}" width="${R(w * 2)}" height="${R(h * 1.2)}" fill="#fff"/>${cuts}</mask>
      <path d="${leafPath}" fill="url(#mo${id})" mask="url(#${mid})"/>
      <path d="M0 ${R(size * 0.3)} L0 ${R(-h * 0.12)} Q ${R(size * 0.02)} ${R(-h * 0.5)} 0 ${R(-h * 0.95)}" stroke="rgba(255,255,255,.28)" stroke-width="${R(size * 0.022)}" fill="none"/>
    </g>`;
  }

  /* Anthurium: kelopak hati + tongkol */
  function anthurium(x, y, size, ang, c, id) {
    const s = size;
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})" filter="url(#sh${id})">
      <path d="M0 ${R(s * 0.15)} C ${R(-s * 0.95)} ${R(-s * 0.2)}, ${R(-s * 0.65)} ${R(-s * 1.05)}, 0 ${R(-s * 0.7)} C ${R(s * 0.65)} ${R(-s * 1.05)}, ${R(s * 0.95)} ${R(-s * 0.2)}, 0 ${R(s * 0.15)}Z" fill="url(#an${id})"/>
      <path d="M0 ${R(s * 0.1)} L0 ${R(-s * 0.62)}" stroke="${mix(c.cream, c.petal, .5)}" stroke-width=".8" opacity=".8"/>
      <path d="M0 ${R(-s * 0.62)} Q ${R(s * 0.06)} ${R(-s * 0.3)} ${R(s * 0.22)} ${R(-s * 0.08)}" stroke="${c.petalDark}" stroke-width="${R(s * 0.085)}" stroke-linecap="round" fill="none"/>
      <path d="M0 ${R(-s * 0.58)} Q ${R(s * 0.06)} ${R(-s * 0.3)} ${R(s * 0.2)} ${R(-s * 0.1)}" stroke="${mix(c.petal, c.petalDark, .3)}" stroke-width="${R(s * 0.03)}" stroke-linecap="round" fill="none" opacity=".7"/>
    </g>`;
  }

  /* Mawar berlapis */
  function rose(x, y, r, grad, edge, c, id) {
    let s = `<g transform="translate(${R(x)} ${R(y)})" filter="url(#sh${id})">`;
    for (let i = 0; i < 7; i++) s += `<ellipse cx="0" cy="${R(-r * 0.5)}" rx="${R(r * 0.58)}" ry="${R(r * 0.56)}" fill="url(#${grad}${id})" transform="rotate(${i * 51.4 + 10})"/>`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${R(-r * 0.3)}" rx="${R(r * 0.42)}" ry="${R(r * 0.38)}" fill="url(#${grad}${id})" stroke="${edge}" stroke-width=".6" stroke-opacity=".5" transform="rotate(${i * 72 + 36})"/>`;
    s += `<path d="M${R(-r * 0.32)} ${R(r * 0.05)} A ${R(r * 0.32)} ${R(r * 0.32)} 0 1 1 ${R(r * 0.18)} ${R(r * 0.26)}" stroke="${edge}" stroke-width="${R(r * 0.07)}" fill="none" stroke-linecap="round" opacity=".7"/>`;
    s += `<path d="M${R(-r * 0.12)} 0 A ${R(r * 0.14)} ${R(r * 0.14)} 0 1 1 ${R(r * 0.08)} ${R(r * 0.1)}" stroke="${edge}" stroke-width="${R(r * 0.06)}" fill="none" stroke-linecap="round" opacity=".8"/>`;
    return s + `</g>`;
  }

  function dots(list, c) {
    return list.map(([x, y, r, k]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${k === 'm' ? c.petalDark : k === 'p' ? c.petal : mix(c.cream, '#ffffff', .4)}" ${k === 'c' ? `stroke="${mix(c.cream, c.leaf, .4)}" stroke-width=".5"` : ''}/>`).join('');
  }

  /* ---- elemen halus untuk rangkaian "blossom" ---- */
  function sprigLeaf(x, y, len, ang, c, shade) {
    const col = shade ? mix(c.leaf, c.cream, shade) : c.leaf, w = len * 0.34;
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})"><path d="M0 0 C ${R(len*0.3)} ${R(-w)}, ${R(len*0.78)} ${R(-w*0.7)}, ${R(len)} 0 C ${R(len*0.78)} ${R(w*0.7)}, ${R(len*0.3)} ${R(w)}, 0 0Z" fill="${col}" opacity=".9"/><path d="M0 0 L${R(len*0.85)} 0" stroke="${mix(col, '#ffffff', .35)}" stroke-width=".6" opacity=".7"/></g>`;
  }
  function stem(d, c) { return `<path d="${d}" stroke="${mix(c.leaf, c.cream, .25)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; }
  /* bunga kecil 5 kelopak yang sedang mekar */
  function blossom(x, y, r, col, c, rot) {
    const edge = mix(col, c.petalDark, .3);
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(rot || 0)})">`;
    for (let i = 0; i < 5; i++) s += `<path d="M0 0 C ${R(-r*0.75)} ${R(-r*0.45)}, ${R(-r*0.55)} ${R(-r*1.1)}, 0 ${R(-r)} C ${R(r*0.55)} ${R(-r*1.1)}, ${R(r*0.75)} ${R(-r*0.45)}, 0 0Z" fill="${col}" stroke="${edge}" stroke-width=".5" stroke-opacity=".6" transform="rotate(${i*72})"/>`;
    s += `<circle r="${R(r*0.22)}" fill="${mix(c.accent, c.petalDark, .2)}"/>`;
    for (let i = 0; i < 6; i++) { const [dx, dy] = pt(0, 0, r * 0.32, i * 60); s += `<circle cx="${R(dx)}" cy="${R(dy)}" r="${R(r*0.06)}" fill="${c.petalDark}" opacity=".7"/>`; }
    return s + `</g>`;
  }
  /* kuncup bunga */
  function bud(x, y, len, ang, col, c) {
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})"><path d="M0 0 L${R(len*0.45)} 0" stroke="${mix(c.leaf, c.cream, .2)}" stroke-width="1"/><path d="M${R(len*0.4)} 0 C ${R(len*0.55)} ${R(-len*0.26)}, ${R(len*0.95)} ${R(-len*0.2)}, ${R(len)} 0 C ${R(len*0.95)} ${R(len*0.2)}, ${R(len*0.55)} ${R(len*0.26)}, ${R(len*0.4)} 0Z" fill="${col}"/><path d="M${R(len*0.38)} 0 L${R(len*0.62)} ${R(-len*0.16)} M${R(len*0.38)} 0 L${R(len*0.62)} ${R(len*0.16)}" stroke="${c.leaf}" stroke-width="1.4" stroke-linecap="round"/></g>`;
  }
  /* peony mekar berlapis */
  function peony(x, y, r, grad, edge, id) {
    let s = `<g transform="translate(${R(x)} ${R(y)})" filter="url(#sh${id})">`;
    [[9, 1, 0], [7, .74, 20], [5, .5, 8]].forEach(([n, k, off]) => {
      const rr = r * k;
      for (let i = 0; i < n; i++) s += `<path d="M0 0 C ${R(-rr*0.62)} ${R(-rr*0.3)}, ${R(-rr*0.58)} ${R(-rr*1.02)}, ${R(-rr*0.18)} ${R(-rr*0.96)} Q 0 ${R(-rr*1.1)} ${R(rr*0.18)} ${R(-rr*0.96)} C ${R(rr*0.58)} ${R(-rr*1.02)}, ${R(rr*0.62)} ${R(-rr*0.3)}, 0 0Z" fill="url(#${grad}${id})" stroke="${edge}" stroke-width=".55" stroke-opacity=".45" transform="rotate(${R(i*360/n+off)})"/>`;
    });
    s += `<circle r="${R(r*0.16)}" fill="${edge}" opacity=".55"/>`;
    return s + `</g>`;
  }

  let uid = 0;
  /* Rangkaian pojok (posisi kiri-atas; pojok lain dicerminkan CSS) */
  function corner(c) {
    const id = ++uid;
    const maroon = mix(c.petalDark, '#000000', .35), creamy = mix(c.cream, c.petal, .55);
    let s = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(c, id)}`;
    // latar: pampas tipis
    s += `<g filter="url(#wc${id})" opacity=".75">` + pampas(2, 2, 40, 170, c, 3, 0.5) + pampas(2, 4, 16, 150, c, 5, 0.42) + pampas(4, 2, 68, 150, c, 9, 0.42) + `</g>`;
    // tangkai menjuntai di sepanjang dua sisi
    s += stem('M6 6 C 70 10, 140 18, 228 40', c) + stem('M6 6 C 10 70, 18 140, 40 228', c) + stem('M40 30 C 90 60, 120 90, 150 130', c);
    [[60, 12, 16, -28], [92, 16, 15, 22], [124, 20, 14, -20], [156, 26, 13, 26], [188, 32, 12, -16],
     [12, 60, 16, 118], [16, 92, 15, 68], [20, 124, 14, 112], [26, 156, 13, 64], [32, 188, 12, 108],
     [100, 76, 13, -6], [126, 104, 12, 70], [70, 56, 12, 90]].forEach(([x, y, l, a], i) => { s += sprigLeaf(x, y, l, a, c, i % 3 === 0 ? .3 : 0); });
    // kuncup & bunga kecil di ujung tangkai
    s += bud(196, 33, 18, 12, c.petalDark, c) + bud(218, 38, 14, 18, c.petal, c) + bud(33, 196, 18, 78, c.petalDark, c) + bud(38, 218, 14, 72, c.petal, c) + bud(146, 124, 15, 52, creamy, c);
    s += blossom(140, 23, 9, creamy, c, 10) + blossom(168, 30, 7, c.petal, c, 30);
    s += blossom(23, 140, 9, creamy, c, 20) + blossom(30, 168, 7, c.petal, c, 40);
    s += blossom(112, 84, 8, c.petal, c, 5);
    // gugusan utama di pojok
    s += peony(44, 44, 31, 'rm', maroon, id);
    s += rose(94, 34, 19, 'rp', c.petalDark, c, id);
    s += rose(34, 94, 18, 'rc', mix(c.cream, c.petal, .6), c, id);
    s += peony(82, 80, 15, 'rp', c.petalDark, id);
    s += blossom(118, 50, 10, creamy, c, 15) + blossom(50, 118, 10, creamy, c, 50);
    s += rose(68, 112, 9, 'rm', maroon, c, id) + rose(112, 68, 8, 'rc', mix(c.cream, c.petal, .6), c, id);
    s += dots([[128, 36, 2.2, 'c'], [134, 42, 1.7, 'c'], [36, 128, 2.2, 'c'], [42, 134, 1.7, 'c'], [100, 60, 1.8, 'c'], [60, 100, 1.8, 'c'],
      [152, 40, 1.8, 'm'], [40, 152, 1.8, 'm'], [176, 44, 1.5, 'p'], [44, 176, 1.5, 'p'], [96, 100, 1.6, 'm']], c);
    return s + `</svg>`;
  }

  /* Pembatas horizontal */
  function divider(c) {
    const id = ++uid;
    const maroon = mix(c.petalDark, '#000000', .35), creamy = mix(c.cream, c.petal, .55);
    let s = `<svg viewBox="0 0 300 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(c, id)}`;
    s += stem('M150 36 C 110 30, 70 40, 26 34', c) + stem('M150 36 C 190 30, 230 40, 274 34', c);
    [[124, 33, 12, 200], [104, 34, 11, 160], [84, 37, 11, 205], [64, 37, 10, 160], [176, 33, 12, -20], [196, 34, 11, 20], [216, 37, 11, -25], [236, 37, 10, 20]]
      .forEach(([x, y, l, a]) => { s += sprigLeaf(x, y, l, a, c); });
    s += bud(44, 35, 14, 182, c.petalDark, c) + bud(256, 35, 14, -2, c.petalDark, c);
    s += blossom(96, 32, 7, creamy, c, 0) + blossom(204, 32, 7, creamy, c, 30);
    s += rose(128, 38, 10, 'rp', c.petalDark, c, id) + rose(172, 38, 10, 'rc', mix(c.cream, c.petal, .6), c, id);
    s += peony(150, 34, 15, 'rm', maroon, id);
    s += dots([[112, 26, 1.8, 'c'], [188, 26, 1.8, 'c'], [74, 30, 1.5, 'm'], [226, 30, 1.5, 'm']], c);
    return s + `</svg>`;
  }

  window.BOHO_FLOWERS = { corner, divider };
})();
