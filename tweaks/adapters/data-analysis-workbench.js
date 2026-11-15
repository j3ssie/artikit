/* how this page's tokens line up with the shared tweak palettes */
window.TWEAK_PAGE = {
  key: 'analysis-workbench',
  modes: ['light'], /* the page ships a light palette only; every dark theme comes from map() */
  getMode: () => 'light',
  setMode: () => {},
  sans: '--sans', mono: '--mono', scale: {},
  spacer: false, /* fixed-height app: the page keeps a strip of its own for the dock (see --dock in its CSS) */
  chrome: { bg: 'var(--panel)', fg: 'var(--tx)', dim: 'var(--tx3)', line: 'var(--line2)', hover: 'var(--hover)', accent: 'var(--blue)' },
  accentOwn: { light: '#2d72d2' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass.
     text2 is the page's --tx3, so map() below lands on the page's own three greys */
  own: { light: 'f4f5f7 ffffff ffffff eef0f3 f0f2f5 e0e4e9 cbd1d9 1c2127 5f6b7c 9aa3ae 12855b c23030 d99e0b 2d72d2 e87ba4 eb6834' },
  map: (p, mix) => {
    const dark = p.mode === 'dark', t = p.text, ink = mix(p.app, 45, '#000'), s1 = '#3987e5';
    /* opaque stand-in for a panel (sticky table head, sticky view tabs, rings round chart markers): on glass that is the panel tint over the backdrop, so the patch does not show */
    const solid = p.glass ? mix(p.solid, dark ? 72 : 64, p.app) : p.solid;
    return Object.assign({
      '--bg': p.app, '--panel': p.surf, '--solid': solid, '--line': p.line, '--line2': p.line2,
      '--tx': t, '--tx2': mix(t, 40, p.text2), '--tx3': p.text2, '--tx4': p.dim,
      '--hover': p.hover, '--press': mix(t, 7, p.hover),
      '--ctl': p.raised, '--ctl-h': mix(t, dark ? 7 : 4, solid), '--bare': 'transparent', '--seg': mix(t, 2, p.raised), '--well': mix(t, dark ? 9 : 7),
      '--band': p.inset, '--row-h': mix(t, dark ? 5 : 3), '--dep-h': mix(t, dark ? 9 : 5, solid),
      '--red': p.red, '--star': p.yellow, '--badge': p.text2,
      '--grid': mix(t, 10), '--axis': mix(t, 36), '--edge': mix(t, 30), '--chev': mix(t, 32), '--dot': mix(t, 18), '--thumb': mix(t, 25), '--thumb-h': mix(t, 37),
    }, dark ? {
      /* filled chips and the primary button are light on a dark theme, so their ink turns dark */
      '--on-blue': ink, '--on-c': ink, '--on-warm': ink, '--pos': p.green,
      '--sh-card': 'rgba(0,0,0,.28)', '--sh-ctl': 'rgba(0,0,0,.22)', '--sh-in': 'rgba(0,0,0,.3)', '--sh-pop': 'rgba(0,0,0,.5)', '--sh-tip': 'rgba(0,0,0,.55)', '--scrim': 'rgba(0,0,0,.55)',
      /* a raised tooltip, not an inverted one */
      '--tip-bg': mix(t, 9, p.solid), '--tip-tx': t, '--tip-tx2': p.text2, '--tip-line': mix(t, 16),
      /* the same five hues stepped for a dark surface; the event lane and the heat ramp turn round, so more is lighter */
      '--s1': s1, '--s2': '#d95926', '--s3': '#199e70', '--s4': '#c98500', '--s5': '#d55181',
      '--navy': '#9ec5f4', '--h-lo': mix(s1, 55, solid), '--h-hi': '#b7d3f6',
    } : {
      '--on-blue': '#fff', '--on-c': '#fff', '--on-warm': '#2e1f00', '--pos': mix(p.green, 85, t),
      '--sh-card': mix(t, 5), '--sh-ctl': mix(t, 6), '--sh-in': mix(t, 12), '--sh-pop': mix(t, 16), '--sh-tip': mix(t, 30), '--scrim': mix(t, 35),
      '--tip-bg': mix(t, 70, '#000'), '--tip-tx': p.solid, '--tip-tx2': mix(p.solid, 62, t), '--tip-line': 'transparent',
    });
  },
  /* the accent drives the controls and the selection; the first chart series stays the categorical blue, so an orange accent never meets the orange series */
  accent: (c, mix, mode) => {
    const dark = mode === 'dark', k = dark ? '#fff' : '#000';
    return { '--blue': c, '--blue-d': mix(c, 86, k), '--blue-dd': mix(c, 72, k), '--sel': mix(c, dark ? 20 : 13, 'var(--solid)'), '--mark': mix(c, dark ? 36 : 24) };
  },
  /* boxed: the whole app becomes a centred window with an edge on each side */
  gutter: { own: 'full-width', css: 'html[data-tw-gutter="boxed"] body{max-width:1280px;margin-inline:auto;box-shadow:-1px 0 0 var(--line),1px 0 0 var(--line)}' },
  glass: '.tip,.side,.insp,.rt-menu', /* only boxes that float over other content: blurring in-flow cards and panes over the smooth backdrop looked identical and cost 2.5x GPU time while scrolling */
};
