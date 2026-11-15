/* how this page's tokens line up with the shared tweak palettes */
window.TWEAK_PAGE = {
  key: 'model-usage',
  modes: ['light', 'dark'], /* the page ships its own palette for both */
  getMode: () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  setMode: m => { document.documentElement.dataset.theme = m; try { localStorage.setItem('md-theme', m); } catch (e) {} },
  sans: '--sans', mono: '--mono', scale: { r: ['--radius'] },
  chrome: { bg: 'var(--surface)', fg: 'var(--ink)', dim: 'var(--ink-3)', line: 'var(--line-2)', hover: 'var(--layer)', accent: 'var(--accent)' },
  accentOwn: { light: '#2f6fe4', dark: '#3b80ee' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: {
    light: 'f6f6f4 ffffff ffffff f1f1ef e9e9e6 e3e3e0 d1d1ce 161616 4b4b48 b4b4b0 157a3a b82d35 c48500 2f6fe4 c94fcf e0641f',
    dark: '101010 161616 1d1d1d 0c0c0c 262626 262626 363636 f2f2f0 b4b4b0 4e4e4b 3fbf6a ef6b6b b7880a 3b80ee c963d0 dd7324',
  },
  map: (p, mix) => ({
    '--bg': p.app, '--surface': p.surf, '--layer': p.mode === 'light' ? p.inset : p.raised, '--layer-2': p.hover,
    '--ink': p.text, '--ink-2': p.text2, '--ink-3': mix(p.text2, 62, p.dim), '--ink-4': p.dim,
    '--line': mix(p.text, 9), '--line-2': mix(p.text, 15), '--line-3': mix(p.text, 24),
    '--grid': mix(p.text, 9, p.solid), '--dot': mix(p.text, 16, p.app),
    '--up': p.green, '--down': p.red, '--up-wash': mix(p.green, 13), '--down-wash': mix(p.red, 13),
  }),
  accent: (c, mix) => ({ '--accent': c, '--accent-wash': mix(c, 14), '--s1': c }),
  gutter: { own: 'boxed', css: 'html[data-tw-gutter="full-width"] .wrap{width:calc(100% - 48px)}@media (max-width:720px){html[data-tw-gutter="full-width"] .wrap{width:calc(100% - 32px)}}' },
  glass: '.tooltip, .rt-menu', /* only boxes that float over other content: blurring in-flow cards over the smooth backdrop looked identical and cost 2.5x GPU time while scrolling */
};
