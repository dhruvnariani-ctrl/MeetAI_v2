// One-off: snap every `fontSize: 'N.NNrem'` to a 4-step scale (12 / 13 / 14 / 16px). Delete after running.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const snap = (v) => (v <= 0.775 ? '0.75rem' : v <= 0.845 ? '0.8125rem' : v <= 0.925 ? '0.875rem' : v <= 0.99 ? '1rem' : null)
let changed = 0

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.jsx?$/.test(name)) {
      const src = readFileSync(path, 'utf8')
      const out = src.replace(/(fontSize: ?')(\d*\.\d+)rem'/g, (m, pre, n) => {
        const t = snap(parseFloat(n))
        if (!t || t === `${n}rem`) return m
        changed++
        return `${pre}${t}'`
      })
      if (out !== src) writeFileSync(path, out)
    }
  }
}
walk('src')
console.log(`changed ${changed} font sizes`)