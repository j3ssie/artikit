/* how this page's tokens line up with the shared tweak palettes */
window.TWEAK_PAGE = {
  key: 'prompt-analytics',
  modes: ['light'], /* the page ships one light palette; every dark look comes from map() */
  getMode: () => 'light', setMode: () => {},
  sans: '--sans', mono: '--mono', scale: {},
  chrome: { bg: 'var(--surf)', fg: 'var(--ink)', dim: 'var(--mute)', line: 'var(--hair2)', hover: 'var(--chip)', accent: 'var(--brand)' },
  accentOwn: { light: '#f0641e' },
  /* the page's own colours in palette order (app surf raised inset hover line line2 text text2 dim green red yellow blue magenta warn); used for glass */
  own: { light: 'f5f2ee faf7f3 ffffff f3ede5 efe6da e5ded5 d8d0c6 1b1a18 57524d 8c877f 15803d c2371c c48a12 6f7be0 b0489a e85a12' },

  /* the shared palettes are plain hex, so legibility is computed here instead of guessed per theme */
  rgb: h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)),
  lerp(a, b, k){ const x = this.rgb(a), y = this.rgb(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); },
  lum(h){ const [r, g, b] = this.rgb(h).map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; },
  cr(a, b){ const x = this.lum(a), y = this.lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); },
  /* step c towards `to` until it reaches min:1 on every background given */
  fit(c, to, min, ...on){ for (let k = 0; k < 1; k += .05){ const m = this.lerp(c, to, k); if (on.every(b => this.cr(m, b) >= min)) return m; } return to; },
  hue(h){ const [r, g, b] = this.rgb(h), mx = Math.max(r, g, b), d = mx - Math.min(r, g, b); return !d ? 0 : ((mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60 + 360) % 360; },

  map(p, mix){
    const L = p.mode === 'light', t = p.text, S = p.solid, A = p.app, far = L ? '#000000' : '#ffffff';
    const edge = L ? p.raised : p.line; /* light panels keep the page's bright inner edge, dark ones get a hairline */
    const panels = {
      '--bg': A, '--bg1': A, '--bg2': A, '--bg3': A, '--glow': 'transparent', '--glow0': 'transparent',
      '--glass': p.surf, '--edge': edge, '--tray': p.surf, '--tray-edge': edge, '--ctl': p.surf, '--field': p.surf,
    };
    /* page default + glass: only the panels change, every ink and chart colour stays the page's own */
    if (t === '#1b1a18' && A === '#f5f2ee') return panels;
    const hov = /^#/.test(p.hover) ? p.hover : this.lerp(S, t, .08);
    const sub = this.fit(p.text2, t, 4.5, S, A), mute = this.fit(this.lerp(p.text2, p.dim, .38), t, 4.5, S, A);
    const soft = c => L ? this.lerp(c, S, .22) : c; /* the heat fills are large marks: a step lighter on light surfaces */
    const code = L ? this.lerp(S, t, .05) : this.lerp(S, '#000000', .3);
    return Object.assign(panels, {
      '--ink': t, '--sub': sub, '--mute': mute, '--icon': this.lerp(t, p.text2, .2), '--on-ink': S, '--ink-h': this.lerp(t, S, .14),
      '--hair': p.line, '--hair2': p.line2, '--xh': this.lerp(S, t, .34), '--scroll': p.line2, '--grain': L ? .5 : 0,
      '--surf': S, '--dot-ring': S, '--av': p.hover, '--th': this.lerp(S, t, .04),
      '--lift': L ? p.raised : p.hover, '--lift-h': L ? p.hover : mix(t, 15),
      '--hov': mix(t, L ? 5 : 7), '--row': mix(t, L ? 5 : 7), '--wash': mix(t, 6), '--wash2': mix(t, 11), '--flag-ring': mix(t, 10),
      '--chip': p.hover, '--chip-ink': this.fit(this.lerp(t, p.text2, .4), t, 4.5, hov), '--bar1': p.hover, '--bar2': mix(p.hover, 76),
      '--sh-card': L ? `0 1px 2px ${mix(t, 4)},0 18px 34px -26px ${mix(t, 34)}` : '0 1px 2px rgba(0,0,0,.24),0 18px 34px -26px rgba(0,0,0,.7)',
      '--sh-tab': L ? `0 1px 2px ${mix(t, 8)},0 6px 14px -8px ${mix(t, 24)}` : '0 1px 2px rgba(0,0,0,.3),0 6px 14px -8px rgba(0,0,0,.6)',
      '--sh-seg': L ? `0 1px 2px ${mix(t, 10)}` : '0 1px 2px rgba(0,0,0,.3)', '--sh-knob': L ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.5)',
      /* tooltip, dialog and code block sit on the theme's own surfaces: the page's dark-on-light inversion only suits its own inks */
      '--tip': L ? this.lerp(S, '#ffffff', .5) : this.lerp(S, t, .09), '--tip-ink': t, '--tip-dim': sub, '--tip-edge': p.line2, '--sh-tip': L ? mix(t, 26) : 'rgba(0,0,0,.6)',
      '--dlg': S, '--sh-dlg': L ? mix(t, 40) : 'rgba(0,0,0,.7)', '--scrim': L ? mix(t, 42) : 'rgba(0,0,0,.6)',
      '--code': code, '--code-ink': t, '--code-dim': this.fit(mute, t, 4.5, code),
      /* chart marks */
      '--prev': this.fit(this.lerp(p.text2, S, .3), t, 3, S, A),
      '--cool': this.fit(p.blue, far, 3, S, A), '--warm': this.fit(p.warn, far, 3, S, A),
      '--good': this.fit(p.green, far, 4.5, S, A), '--bad': this.fit(p.red, far, 4.5, S, A),
      '--heat1': soft(p.green), '--heat2': soft(p.yellow), '--heat3': soft(p.warn), '--heat4': soft(p.red),
      '--b1': soft(p.green), '--b2': soft(p.yellow), '--b3': soft(p.warn),
    });
  },

  /* the accent is the page's brand, its first chart series and the one-hue ramp behind the quantiles, the funnel and the heat grid */
  accent(c, mix, mode, p, tokens){
    const own = (k, d) => (tokens && tokens[k]) || d; /* what map() set this pass, else the page's own */
    const L = mode === 'light', S = own('--surf', '#faf7f3'), A = own('--bg', '#f5f2ee'), code = own('--code', '#201e1c'), h = this.hue(c);
    const q1 = this.fit(this.lerp(c, S, L ? .5 : .62), c, 2.1, S, A); /* pale end of the ramp still reads as a mark */
    const top = L ? c : this.fit(c, '#ffffff', 5, S, A); /* a dim accent on a dark surface leaves too little room for four steps: let the bright end go lighter */
    const q = L ? [q1, c, this.lerp(c, '#000000', .26), this.lerp(c, '#000000', .5)] : [q1, this.lerp(q1, top, 1 / 3), this.lerp(q1, top, 2 / 3), top];
    return {
      '--brand': c, '--or': c, '--q0': mix(c, L ? 20 : 18), '--q1': q[0], '--q2': q[1], '--q3': q[2], '--q4': q[3], '--qf': L ? q[0] : q[1],
      /* second series: the palette's orange beside a cool or magenta accent, its blue beside a green or warm one (checked for colour-blind separation) */
      '--peri': h >= 150 && h < 345 ? 'var(--warm)' : 'var(--cool)',
      '--sel': mix(c, L ? 20 : 34), '--focus': mix(c, L ? 14 : 26), '--code-sel': mix(c, 34),
      '--code-em': this.fit(c, this.lum(code) < .2 ? '#ffffff' : '#000000', 4.5, code),
    };
  },

  /* boxed: the wash still fills the window, so the panel is padded in instead of narrowed */
  gutter: { own: 'full-width', css: '@media (min-width:1300px){html[data-tw-gutter="boxed"] .panel{padding-inline:max(40px,calc(50% - 640px))}}' },
  glass: '#tip, .rt-menu', /* only the floating tooltip blurs: on the in-flow cards the blur looked identical over the smooth backdrop and cost GPU time while scrolling */
  clear: '.panel', /* paints the page wash */
};
