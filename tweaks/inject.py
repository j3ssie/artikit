#!/usr/bin/env python3
"""inject.py <page.html> <adapter.js>: put the tweaks block (adapter + shared module) right before </head>, replacing a previous one."""
import sys, json, re, os
here = os.path.dirname(os.path.abspath(__file__))
page, adapter = sys.argv[1], sys.argv[2]
mod = open(os.path.join(here, 'module.html')).read()
themes = json.load(open(os.path.join(here, 'themes.json')))
tj = '{\n' + ',\n'.join('  %s: {\n%s\n  }' % (m, ',\n'.join("    %s: '%s'" % (json.dumps(n) if not re.match(r'^[A-Za-z_]\w*$', n) else n, v) for n, v in themes[m].items())) for m in ('dark', 'light')) + '\n}'
assert mod.count('__THEMES__') == 1
mod = mod.replace('__THEMES__', tj)
block = '<!-- tweaks:start -->\n<script>\n' + open(adapter).read().strip() + '\n</script>\n' + mod.strip() + '\n<!-- tweaks:end -->\n'
s = open(page).read()
s, n = re.subn(r'<!-- tweaks:start -->.*?<!-- tweaks:end -->\n', '', s, flags=re.S)
assert s.count('</head>') == 1, 'expected one </head>'
s = s.replace('</head>', block + '</head>')
open(page, 'w').write(s)
print(('replaced' if n else 'inserted'), 'tweaks block in', page, '(%d bytes)' % len(block))
