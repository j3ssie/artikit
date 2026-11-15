/* how this page's tokens line up with the shared tweak palettes */
window.TWEAK_PAGE = {
  key: 'vigolium-text-charts',
  modes: ['dark', 'light'], /* the page ships its own palette for both */
  getMode: () => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  setMode: m => { document.documentElement.dataset.theme = m; try { localStorage.setItem('vg-theme', m); } catch (e) {} },
  /* the page is all mono: a mono font from the dock replaces --mono, a sans one is not applied (it would break the character grid the charts are drawn on) */
  mono: '--mono',
  /* no scale.r: --r reads the dock's --tw-r itself, so corners stay square on "default" and "sharp" and only "round" turns them on */
  chrome: { bg: 'var(--surface)', fg: 'var(--text)', dim: 'var(--muted)', line: 'var(--border)', hover: 'color-mix(in srgb, var(--text) 9%, transparent)', accent: 'var(--accent)' },
  accentOwn: { dark: '#7fd962', light: '#0066a5' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: {
    dark: '1c1b19 1c1b19 272520 141310 2e2b26 2e2b26 3a362f fce8c3 c9b79a 938377 98bc37 f14841 f2c55c 68a8e4 ff5c8f e8943a',
    light: 'f6edda f6edda ede4d1 ede4d1 e4dac5 bbc3c4 a9b3b4 005661 2d6a70 546b6b 007a47 bb4017 896408 00598f a03070 964f08',
  },
  /* surfaces and text follow the theme; the chart series keep the page's checked colours for the mode */
  map: (p, mix) => {
    /* the two chrome hues beside the accent are the palette's blue and orange. Where the theme's primary sits on one of them, the next hue along stands in */
    const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), near = (a, b) => rgb(a).reduce((s, v, i) => s + Math.abs(v - rgb(b)[i]), 0) < 84;
    const far = (list, ...taken) => list.find(c => !taken.some(t => near(c, t))) || list[0];
    const second = far([p.blue, p.magenta, p.green], p.primary), third = far([p.warn, p.yellow, p.magenta, p.green], p.primary, second);
    return {
      '--bg': p.glass ? 'transparent' : p.app, '--surface': p.raised, '--well': p.inset, '--border': p.line2,
      '--text': p.text, '--muted': mix(p.text2, 78, p.dim),
      '--secondary': second, '--tertiary': third, '--success': p.green, '--error': p.red, '--warn': p.yellow,
    };
  },
  accent: c => ({ '--accent': c }),
  /* boxed: the bars keep their full-width rules, so they are padded in instead of narrowed */
  gutter: { own: 'full-width', css: 'html[data-tw-gutter="boxed"] main{padding-inline:max(8px,calc(50% - 640px))}html[data-tw-gutter="boxed"] :is(.hdr,.nav,body>footer){padding-inline:max(16px,calc(50% - 632px))}' },
  glass: 'header, .rt-menu',
};
