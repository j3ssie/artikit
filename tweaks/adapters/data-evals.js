/* how this page's tokens line up with the shared tweak palettes */
window.TWEAK_PAGE = (() => {
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  const own = {
    light: 'e8e6dc faf9f5 ffffff f1efe7 ebe9df e3e1d6 d3d1c5 3d3d3a 5e5d59 a4a398 4ea87b 8a312b e3a82f 3f73d3 7e76c8 d9623c',
    dark: '1a1918 262624 30302e 201f1e 363533 363533 4a4946 e8e5db b8b5aa 474640 21925e 8d4259 ac8f08 506fca 867ce0 cb5118',
  };
  /* --c1..--c6 and --c6d as the page ships them */
  const series = { light: ['#7e76c8', '#8a312b', '#d9623c', '#e3a82f', '#4ea87b', '#3f73d3', '#2b56a4'], dark: ['#867ce0', '#8d4259', '#cb5118', '#ac8f08', '#21925e', '#506fca', '#8ea4ea'] };
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const lum = c => c.reduce((s, v, i) => s + [.2126, .7152, .0722][i] * ((v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4), 0);
  const ratio = (a, b) => { const x = lum(a) + .05, y = lum(b) + .05; return Math.max(x, y) / Math.min(x, y); };
  const blend = (a, b, pct) => a.map((v, i) => v + (b[i] - v) * pct / 100);
  /* the colour a card really shows: under glass it is the surface at 64% (light) or 72% (dark) over the backdrop */
  const face = p => p.glass ? blend(rgb(p.app), rgb(p.solid), p.mode === 'light' ? 64 : 72) : rgb(p.solid);
  /* the matrix prints figures on a tint of the accent: --wash is the strongest tint that leaves them 4.5:1 on the card (12% at the least) */
  const wash = (c, text, card) => { for (let a = 50; a > 12; a--) if (ratio(blend(card, rgb(c), a), rgb(text)) >= 4.5) return a; return 12; };
  /* the series keep the page's colours; one is moved towards the text colour only where a theme's surface would leave it fainter than on the page's own card */
  const lift = p => {
    const S = face(p), T = rgb(p.text), O = rgb('#' + own[p.mode].split(' ')[1]), out = {};
    series[p.mode].forEach((h, i) => {
      const c = rgb(h), want = Math.min(3, ratio(c, O)) - .05; let k = 0;
      while (k < 60 && ratio(blend(c, T, k), S) < want) k += 4;
      if (k) out[i < 6 ? '--c' + (i + 1) : '--c6d'] = hex(blend(c, T, k));
    });
    return out;
  };
  return {
    key: 'evals',
    modes: ['light', 'dark'], /* the page ships both, through light-dark() tokens */
    /* no data-theme yet means the page is following the system */
    getMode: () => { const t = document.documentElement.getAttribute('data-theme'); return t === 'dark' || t === 'light' ? t : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; },
    setMode: m => { document.documentElement.setAttribute('data-theme', m); try { localStorage.setItem('loam-theme', m); } catch (e) {} },
    sans: '--sans', mono: null, scale: { r: ['--r-card'] },
    chrome: { bg: 'var(--raised)', fg: 'var(--ink)', dim: 'var(--ink-3)', line: 'var(--ring)', hover: 'color-mix(in srgb, var(--ink) 9%, transparent)', accent: 'var(--accent)' },
    /* the page has no accent hue of its own: the selected suite, the brand mark and the matrix wash are ink */
    accentOwn: { light: '#3d3d3a', dark: '#e8e5db' },
    own,
    map: (p, mix) => {
      const light = p.mode === 'light';
      return {
        '--frame': p.app, '--card': p.surf, '--paper': p.solid, '--raised': p.glass ? mix(p.solid, 86) : p.raised, '--edge': p.line,
        '--ink': p.text, '--ink-2': p.text2, '--ink-3': mix(p.text2, 70, p.dim),
        '--grid': mix(p.text, light ? 9 : 10), '--axis': mix(p.text2, 75, p.dim), '--rule': p.line,
        '--ring': mix(p.text, light ? 10 : 12), '--shade': light ? mix(p.text, 25) : 'rgba(0,0,0,.6)',
        '--wash': mix(p.text, wash(p.text, p.text, face(p))), /* ink, as on the page; accent() replaces it when a theme or the dock brings a hue */
        ...lift(p),
      };
    },
    accent: (c, mix, mode, p) => {
      p = p || { text: '#' + own[mode].split(' ')[7], solid: '#' + own[mode].split(' ')[1] }; /* no map() this pass: the page's own solid card */
      return { '--accent': c, '--focus': c, '--sel': c, '--wash': mix(c, wash(c, p.text, face(p))) };
    },
    gutter: { own: 'full-width', css: 'html[data-tw-gutter="boxed"] .page{max-width:1280px;margin-inline:auto}' },
    glass: '.tip, .rt-menu', /* only boxes that float over other content: blurring in-flow cards over the smooth backdrop looked identical and cost 2.5x GPU time while scrolling */
  };
})();
