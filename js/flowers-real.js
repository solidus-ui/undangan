/* =========================================================================
   GAYA BUNGA "realistis" — lukisan 2D: mawar merah, tulip, ranting & daun.
   Bayangan, kilau tepi kelopak, dan tekstur halus dibuat dengan gradien &
   filter SVG. Dipakai jika theme.flowerStyle = "realistis".
   Warna opsional dari theme: roseRed, tulipColor, leafGreen, twigColor.
   ========================================================================= */
(function () {
  const R = (n) => Math.round(n * 10) / 10;
  function hex(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const rad = (d) => (d * Math.PI) / 180;
  let uid = 0;

  function palette(c) {
    const red = c.roseRed || '#b3121f', tulip = c.tulipColor || '#d4283a', green = c.leafGreen || '#3f6b35', twig = c.twigColor || '#6b4a34';
    return {
      red, redDeep: mix(red, '#1a0003', .55), redMid: mix(red, '#3a0006', .2), redLight: mix(red, '#ff8a8a', .35), redRim: mix(red, '#ffd0cc', .55),
      tulip, tulipDeep: mix(tulip, '#2a0005', .5), tulipLight: mix(tulip, '#ffd6d6', .5),
      blush: '#f2c4c4', blushDeep: '#c7737d', blushLight: '#fff1ee',
      green, greenDeep: mix(green, '#0b1a08', .5), greenLight: mix(green, '#c9e0a8', .45),
      twig, twigDark: mix(twig, '#1a0f08', .45)
    };
  }

  function defs(P, id) {
    return `<defs>
      <filter id="sh${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="1.2" dy="2.4" stdDeviation="2.2" flood-color="#2a0508" flood-opacity=".35"/></filter>
      <filter id="tx${id}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0" result="g"/>
        <feComponentTransfer in="g" result="g2"><feFuncA type="table" tableValues="0 .18"/></feComponentTransfer>
        <feComposite in="g2" in2="SourceGraphic" operator="in" result="t"/>
        <feBlend in="SourceGraphic" in2="t" mode="multiply"/>
      </filter>
      <filter id="soft${id}"><feGaussianBlur stdDeviation=".35"/></filter>
      <linearGradient id="po${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.redDeep}"/><stop offset=".45" stop-color="${P.redMid}"/><stop offset=".85" stop-color="${P.red}"/><stop offset="1" stop-color="${P.redLight}"/></linearGradient>
      <linearGradient id="pm${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.redDeep}"/><stop offset=".5" stop-color="${P.red}"/><stop offset="1" stop-color="${P.redLight}"/></linearGradient>
      <radialGradient id="pc${id}" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="#2b0207"/><stop offset=".6" stop-color="${P.redDeep}"/><stop offset="1" stop-color="${P.redMid}"/></radialGradient>
      <linearGradient id="pf${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.redLight}"/><stop offset=".35" stop-color="${P.red}"/><stop offset="1" stop-color="${P.redDeep}"/></linearGradient>
      <linearGradient id="tr${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.tulipDeep}"/><stop offset=".55" stop-color="${P.tulip}"/><stop offset="1" stop-color="${P.tulipLight}"/></linearGradient>
      <linearGradient id="tb${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${P.blushDeep}"/><stop offset=".55" stop-color="${P.blush}"/><stop offset="1" stop-color="${P.blushLight}"/></linearGradient>
      <linearGradient id="lf${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.greenLight}"/><stop offset=".5" stop-color="${P.green}"/><stop offset="1" stop-color="${P.greenDeep}"/></linearGradient>
      <linearGradient id="lb${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.greenDeep}"/><stop offset=".5" stop-color="${P.green}"/><stop offset="1" stop-color="${P.greenLight}"/></linearGradient>
      <linearGradient id="tw${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.twigDark}"/><stop offset="1" stop-color="${P.twig}"/></linearGradient>
    </defs>`;
  }

  /* kelopak mawar: pangkal sempit, ujung lebar sedikit bergelombang */
  function petalPath(w, h) {
    return `M0 0 C ${R(-w * .55)} ${R(-h * .2)}, ${R(-w)} ${R(-h * .62)}, ${R(-w * .78)} ${R(-h * .9)}`
      + ` Q ${R(-w * .45)} ${R(-h * 1.08)} ${R(-w * .1)} ${R(-h * .98)} Q ${R(w * .12)} ${R(-h * 1.06)} ${R(w * .4)} ${R(-h * .99)}`
      + ` Q ${R(w * .78)} ${R(-h * .95)} ${R(w * .8)} ${R(-h * .7)} C ${R(w * .95)} ${R(-h * .45)}, ${R(w * .5)} ${R(-h * .18)}, 0 0Z`;
  }
  const rimPath = (w, h) => `M${R(-w * .74)} ${R(-h * .88)} Q ${R(-w * .45)} ${R(-h * 1.05)} ${R(-w * .1)} ${R(-h * .96)} Q ${R(w * .12)} ${R(-h * 1.03)} ${R(w * .4)} ${R(-h * .96)} Q ${R(w * .72)} ${R(-h * .92)} ${R(w * .76)} ${R(-h * .7)}`;

  function rose(x, y, r, P, id, tilt) {
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(tilt || 0)}) scale(1 .9)" filter="url(#sh${id})"><g filter="url(#tx${id})">`;
    const ring = (n, k, off, g, rimA) => {
      for (let i = 0; i < n; i++) {
        const a = i * 360 / n + off + (i % 2 ? 6 : -4), w = r * k * .62, h = r * k;
        s += `<g transform="rotate(${R(a)})"><path d="${petalPath(w, h)}" fill="url(#${g}${id})"/>`
          + `<path d="${rimPath(w, h)}" fill="none" stroke="${P.redRim}" stroke-opacity="${rimA}" stroke-width="${R(r * .045)}" stroke-linecap="round" filter="url(#soft${id})"/>`
          + `<path d="M0 ${R(-h * .12)} Q ${R(w * .05)} ${R(-h * .5)} 0 ${R(-h * .82)}" stroke="${P.redDeep}" stroke-opacity=".35" stroke-width="${R(r * .02)}" fill="none"/></g>`;
      }
    };
    ring(6, 1, 0, 'po', .5);
    ring(5, .8, 30, 'pm', .55);
    // cangkir tengah
    s += `<ellipse cx="0" cy="${R(-r * .02)}" rx="${R(r * .5)}" ry="${R(r * .46)}" fill="url(#pc${id})"/>`;
    // kelopak depan yang membungkus pusat
    s += `<path d="M${R(-r * .52)} ${R(r * .02)} Q ${R(-r * .5)} ${R(r * .5)} 0 ${R(r * .5)} Q ${R(r * .5)} ${R(r * .5)} ${R(r * .52)} ${R(r * .02)} Q ${R(r * .2)} ${R(r * .22)} 0 ${R(r * .2)} Q ${R(-r * .22)} ${R(r * .22)} ${R(-r * .52)} ${R(r * .02)}Z" fill="url(#pf${id})"/>`;
    s += `<path d="M${R(-r * .48)} ${R(r * .06)} Q ${R(-r * .2)} ${R(r * .26)} 0 ${R(r * .23)} Q ${R(r * .22)} ${R(r * .26)} ${R(r * .48)} ${R(r * .06)}" fill="none" stroke="${P.redRim}" stroke-opacity=".6" stroke-width="${R(r * .04)}" filter="url(#soft${id})"/>`;
    // spiral kuncup
    s += `<path d="M${R(-r * .32)} ${R(-r * .05)} Q ${R(-r * .3)} ${R(-r * .38)} 0 ${R(-r * .36)} Q ${R(r * .32)} ${R(-r * .34)} ${R(r * .3)} ${R(-r * .02)} Q ${R(r * .28)} ${R(r * .16)} ${R(r * .02)} ${R(r * .14)}" fill="${P.redMid}" stroke="${P.redLight}" stroke-opacity=".55" stroke-width="${R(r * .035)}"/>`;
    s += `<path d="M${R(-r * .16)} ${R(-r * .02)} Q ${R(-r * .14)} ${R(-r * .2)} ${R(r * .04)} ${R(-r * .19)} Q ${R(r * .17)} ${R(-r * .16)} ${R(r * .14)} ${R(r * .02)}" fill="${P.redDeep}" stroke="${P.redLight}" stroke-opacity=".5" stroke-width="${R(r * .03)}"/>`;
    return s + `</g></g>`;
  }

  /* kuncup mawar */
  function roseBud(x, y, r, ang, P, id) {
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})" filter="url(#sh${id})">`
      + `<path d="M0 0 C ${R(r * .3)} ${R(-r * .2)}, ${R(r * .5)} ${R(-r * .1)}, ${R(r * .7)} 0" stroke="${P.greenDeep}" stroke-width="${R(r * .12)}" fill="none"/>`
      + `<path d="M${R(r * .55)} 0 C ${R(r * .6)} ${R(-r * .5)}, ${R(r * 1.4)} ${R(-r * .55)}, ${R(r * 1.55)} 0 C ${R(r * 1.4)} ${R(r * .5)}, ${R(r * .6)} ${R(r * .45)}, ${R(r * .55)} 0Z" fill="url(#pm${id})" transform="rotate(90 ${R(r * 1.05)} 0) translate(0 0)"/>`
      + `<path d="M${R(r * .5)} 0 Q ${R(r * .85)} ${R(-r * .45)} ${R(r * 1.15)} ${R(-r * .18)} M${R(r * .5)} 0 Q ${R(r * .85)} ${R(r * .45)} ${R(r * 1.15)} ${R(r * .18)}" stroke="${P.green}" stroke-width="${R(r * .16)}" fill="none" stroke-linecap="round"/></g>`;
  }

  /* tulip dilihat dari samping: 3 kelopak cekung + tangkai */
  function tulip(x, y, s, ang, P, id, kind) {
    const g = kind === 'blush' ? 'tb' : 'tr', deep = kind === 'blush' ? P.blushDeep : P.tulipDeep, light = kind === 'blush' ? P.blushLight : P.tulipLight;
    const w = s * .5, h = s;
    let o = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})" filter="url(#sh${id})">`;
    o += `<path d="M0 ${R(s * .1)} C ${R(s * .05)} ${R(s * .7)}, ${R(-s * .08)} ${R(s * 1.2)}, ${R(s * .02)} ${R(s * 1.6)}" stroke="url(#lb${id})" stroke-width="${R(s * .09)}" fill="none" stroke-linecap="round"/>`;
    o += `<g filter="url(#tx${id})">`;
    // kelopak belakang
    o += `<path d="M0 0 C ${R(-w * 1.1)} ${R(-h * .1)}, ${R(-w * .9)} ${R(-h * .85)}, 0 ${R(-h)} C ${R(w * .9)} ${R(-h * .85)}, ${R(w * 1.1)} ${R(-h * .1)}, 0 0Z" fill="${deep}"/>`;
    // kelopak kiri & kanan
    o += `<path d="M${R(w * .1)} ${R(h * .02)} C ${R(-w * 1.25)} ${R(-h * .12)}, ${R(-w * 1.05)} ${R(-h * .72)}, ${R(-w * .62)} ${R(-h * 1.04)} C ${R(-w * .5)} ${R(-h * .82)}, ${R(-w * .1)} ${R(-h * .45)}, ${R(w * .1)} ${R(h * .02)}Z" fill="url(#${g}${id})"/>`;
    o += `<path d="M${R(-w * .1)} ${R(h * .02)} C ${R(w * 1.25)} ${R(-h * .12)}, ${R(w * 1.05)} ${R(-h * .72)}, ${R(w * .62)} ${R(-h * 1.04)} C ${R(w * .5)} ${R(-h * .82)}, ${R(w * .1)} ${R(-h * .45)}, ${R(-w * .1)} ${R(h * .02)}Z" fill="url(#${g}${id})"/>`;
    // kelopak depan (ujung runcing)
    o += `<path d="M0 ${R(h * .05)} C ${R(-w * .95)} ${R(-h * .02)}, ${R(-w * .8)} ${R(-h * .55)}, 0 ${R(-h * .98)} C ${R(w * .8)} ${R(-h * .55)}, ${R(w * .95)} ${R(-h * .02)}, 0 ${R(h * .05)}Z" fill="url(#${g}${id})"/>`;
    o += `<path d="M${R(-w * .62)} ${R(-h * 1.04)} L${R(-w * .4)} ${R(-h * .78)} M${R(w * .62)} ${R(-h * 1.04)} L${R(w * .4)} ${R(-h * .78)}" stroke="${deep}" stroke-opacity=".35" stroke-width=".8"/>`;
    o += `<path d="M0 ${R(-h * .05)} Q ${R(w * .08)} ${R(-h * .5)} 0 ${R(-h * .86)}" stroke="${light}" stroke-opacity=".55" stroke-width="${R(s * .04)}" fill="none" filter="url(#soft${id})"/>`;
    o += `<path d="M${R(-w * .45)} ${R(-h * .2)} Q ${R(-w * .5)} ${R(-h * .6)} ${R(-w * .2)} ${R(-h * .85)}" stroke="${light}" stroke-opacity=".35" stroke-width="${R(s * .03)}" fill="none" filter="url(#soft${id})"/>`;
    return o + `</g></g>`;
  }

  /* daun mawar bergerigi dengan urat */
  function leaf(x, y, len, ang, id, P, flip) {
    const w = len * .42, n = 7;
    let top = '', bot = '';
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), wt = Math.sin(Math.PI * t) * w * (1 - t * .25);
      top += ` L${R(len * (t - .04))} ${R(-wt)} L${R(len * t)} ${R(-wt * .86)}`;
      bot = ` L${R(len * t)} ${R(wt * .86)} L${R(len * (t - .04))} ${R(wt)}` + bot;
    }
    let s = `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})${flip ? ' scale(1 -1)' : ''}" filter="url(#sh${id})">`;
    s += `<path d="M0 0${top} L${R(len)} 0${bot} Z" fill="url(#lf${id})" stroke="${P.greenDeep}" stroke-width=".5" stroke-opacity=".5"/>`;
    s += `<path d="M0 0 Q ${R(len * .5)} ${R(-w * .06)} ${R(len * .96)} 0" stroke="${P.greenLight}" stroke-width="${R(len * .025)}" fill="none" opacity=".8"/>`;
    for (let i = 1; i <= 4; i++) {
      const t = i / 5.2;
      s += `<path d="M${R(len * t)} 0 Q ${R(len * (t + .08))} ${R(-w * .3)} ${R(len * (t + .16))} ${R(-w * .55)} M${R(len * t)} 0 Q ${R(len * (t + .08))} ${R(w * .3)} ${R(len * (t + .16))} ${R(w * .55)}" stroke="${P.greenLight}" stroke-width=".55" fill="none" opacity=".55"/>`;
    }
    return s + `</g>`;
  }

  /* daun tulip panjang */
  function blade(x, y, len, ang, id, bend) {
    const b = bend || .2;
    return `<g transform="translate(${R(x)} ${R(y)}) rotate(${R(ang)})" filter="url(#sh${id})"><path d="M0 0 C ${R(len * .3)} ${R(-len * .16)}, ${R(len * .7)} ${R(-len * b)}, ${R(len)} ${R(-len * (b + .05))} C ${R(len * .72)} ${R(-len * (b - .08))}, ${R(len * .35)} ${R(len * .02)}, 0 ${R(len * .08)}Z" fill="url(#lb${id})"/><path d="M${R(len * .05)} ${R(len * .03)} C ${R(len * .4)} ${R(-len * .06)}, ${R(len * .7)} ${R(-len * (b - .02))}, ${R(len * .95)} ${R(-len * (b + .04))}" stroke="#ffffff" stroke-opacity=".18" stroke-width="1" fill="none"/></g>`;
  }

  /* ranting meruncing dengan cabang kecil */
  function twig(d, w, id) {
    return `<path d="${d}" stroke="url(#tw${id})" stroke-width="${w}" fill="none" stroke-linecap="round" filter="url(#sh${id})"/>`;
  }

  /* Rangkaian pojok (posisi kiri-atas; pojok lain dicerminkan CSS) */
  function corner(c) {
    const id = 'r' + (++uid), P = palette(c);
    let s = `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(P, id)}`;
    // ranting
    s += twig('M2 4 C 60 10, 130 14, 214 30', 3.2, id) + twig('M4 2 C 10 60, 14 130, 30 214', 3.2, id);
    s += twig('M120 16 C 140 4, 160 0, 176 -2', 1.6, id) + twig('M16 120 C 4 140, 0 160, -2 176', 1.6, id);
    s += twig('M70 10 C 92 30, 110 46, 128 70', 1.8, id) + twig('M10 70 C 30 92, 46 110, 70 128', 1.8, id);
    s += twig('M170 24 C 186 34, 196 46, 204 58', 1.2, id) + twig('M24 170 C 34 186, 46 196, 58 204', 1.2, id);
    // daun tulip panjang di belakang
    s += blade(10, 20, 120, 18, id, .12) + blade(20, 10, 120, 72, id, -.12);
    // daun mawar
    [[46, 12, 34, -24, 0], [88, 16, 32, 20, 1], [132, 22, 30, -14, 0], [180, 30, 26, 18, 1],
     [12, 46, 34, 114, 1], [16, 88, 32, 70, 0], [22, 132, 30, 104, 1], [30, 180, 26, 72, 0],
     [94, 46, 26, 40, 0], [46, 94, 26, 50, 1], [120, 72, 22, 60, 1], [72, 120, 22, 30, 0]]
      .forEach(([x, y, l, a, f]) => { s += leaf(x, y, l, a, id, P, f); });
    // tulip mengarah keluar
    s += tulip(150, 40, 30, 70, P, id, 'red') + tulip(40, 150, 30, 20, P, id, 'blush');
    s += tulip(196, 46, 22, 78, P, id, 'blush') + tulip(46, 196, 22, 12, P, id, 'red');
    s += tulip(118, 84, 20, 50, P, id, 'red');
    // kuncup mawar
    s += roseBud(204, 26, 12, 8, P, id) + roseBud(26, 204, 12, 82, P, id);
    // mawar merah utama
    s += rose(86, 40, 24, P, id, 15) + rose(40, 86, 23, P, id, -20);
    s += rose(40, 38, 33, P, id, 0);
    s += rose(84, 84, 15, P, id, 40);
    return s + `</svg>`;
  }

  function divider(c) {
    const id = 'r' + (++uid), P = palette(c);
    let s = `<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs(P, id)}`;
    s += twig('M150 44 C 110 36, 70 46, 22 38', 2, id) + twig('M150 44 C 190 36, 230 46, 278 38', 2, id);
    [[118, 42, 24, 196, 0], [182, 42, 24, -16, 1], [94, 40, 20, 170, 1], [206, 40, 20, 10, 0], [70, 42, 18, 196, 0], [230, 42, 18, -16, 1]]
      .forEach(([x, y, l, a, f]) => { s += leaf(x, y, l, a, id, P, f); });
    s += tulip(112, 46, 22, -64, P, id, 'blush') + tulip(188, 46, 22, 64, P, id, 'blush');
    s += roseBud(46, 38, 9, 186, P, id) + roseBud(254, 38, 9, -6, P, id);
    s += rose(150, 42, 19, P, id, 0);
    return s + `</svg>`;
  }

  /* motif latar (ubin) — mawar kecil, tulip, daun, ranting */
  function pattern(c) {
    const id = 'q' + (++uid), P = palette(c);
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">${defs(P, id).replace(/<filter id="sh[\s\S]*?<\/filter>/, '<filter id="sh' + id + '"><feOffset/></filter>')}`;
    s += twig('M10 60 C 40 40, 70 36, 100 20', 1.2, id) + twig('M140 220 C 170 200, 200 196, 230 180', 1.2, id);
    [[30, 50, 18, -30, 0], [64, 34, 16, 200, 1], [160, 206, 18, 150, 0], [196, 190, 16, 20, 1], [116, 110, 14, 10, 0], [20, 170, 14, -70, 1], [210, 70, 14, 110, 0]]
      .forEach(([x, y, l, a, f]) => { s += leaf(x, y, l, a, id, P, f); });
    s += rose(48, 44, 11, P, id, 10) + rose(180, 196, 11, P, id, -20) + rose(214, 54, 7, P, id, 0);
    s += tulip(128, 100, 15, 20, P, id, 'red') + tulip(30, 170, 14, -30, P, id, 'blush') + tulip(100, 220, 12, 40, P, id, 'blush');
    s += roseBud(90, 150, 7, 30, P, id) + roseBud(170, 30, 7, 120, P, id);
    return s + `</svg>`;
  }

  window.REAL_FLOWERS = { corner, divider, pattern };
})();
