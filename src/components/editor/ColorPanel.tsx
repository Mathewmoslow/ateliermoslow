import { useMemo, useState } from 'react'
import './editor.css'

interface HarmonyRule {
  name: string
  colors: string[]
}

interface SwatchGroup {
  name: string
  colors: string[]
  entries?: { name: string; color: string }[]
}

const harmonyRules: HarmonyRule[] = [
  { name: 'Complementary', colors: ['#f72585', '#3a86ff'] },
  { name: 'Split Complementary', colors: ['#ff6b6b', '#ffd166', '#118ab2'] },
  { name: 'Analogous', colors: ['#ff9f1c', '#ffbf69', '#cbf3f0'] },
  { name: 'Triad', colors: ['#ef476f', '#06d6a0', '#118ab2'] },
  { name: 'Tetrad', colors: ['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b'] },
  { name: 'Monochrome', colors: ['#0d1b2a', '#1b263b', '#415a77', '#778da9'] },
]

const swatchGroups: SwatchGroup[] = [
  {
    name: 'Web Colors',
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'],
  },
  {
    name: 'Editorial Core',
    colors: ['#181818', '#262626', '#343434', '#4aa3ff', '#f4e4d4', '#d8c7b5'],
  },
  {
    name: 'Accents',
    colors: ['#f72585', '#3a86ff', '#06d6a0', '#ff9f1c', '#ffd166'],
  },
  {
    name: 'Swatch Group 1',
    colors: [],
    entries: [
      { name: 'C=28 M=100 Y=100 K=0', color: '#a50a0a' },
      { name: 'C=42 M=93 Y=70 K=25', color: '#6d1b2a' },
      { name: 'C=51 M=59 Y=79 K=35', color: '#5b4025' },
      { name: 'C=73 M=5 Y=63 K=18', color: '#2a7f55' },
      { name: 'C=71 M=58 Y=0 K=20', color: '#3a5fa1' },
    ],
  },
  {
    name: 'Swatch Group 2',
    colors: [],
    entries: [
      { name: 'C=28 M=100 Y=100 K=0', color: '#a50a0a' },
      { name: 'C=42 M=93 Y=70 K=25', color: '#6d1b2a' },
      { name: 'C=51 M=59 Y=79 K=35', color: '#5b4025' },
    ],
  },
]

function cmykToHex(c: number, m: number, y: number, k: number) {
  const clamp = (v: number) => Math.min(100, Math.max(0, v))
  const c1 = clamp(c) / 100
  const m1 = clamp(m) / 100
  const y1 = clamp(y) / 100
  const k1 = clamp(k) / 100
  const r = 255 * (1 - c1) * (1 - k1)
  const g = 255 * (1 - m1) * (1 - k1)
  const b = 255 * (1 - y1) * (1 - k1)
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

interface ColorPanelProps {
  current: string
  onSelectColor: (color: string) => void
}

export function ColorPanel({ current, onSelectColor }: ColorPanelProps) {
  const [recent, setRecent] = useState<string[]>([
    '#f72585',
    '#b5179e',
    '#7209b7',
    '#560bad',
    '#480ca8',
    '#4361ee',
    '#4895ef',
    '#4cc9f0',
  ])
  const [cmyk, setCmyk] = useState({ c: 10, m: 40, y: 0, k: 5 })

  const apply = (color: string) => {
    onSelectColor(color)
    setRecent((prev) => {
      const next = [color, ...prev.filter((c) => c !== color)]
      return next.slice(0, 12)
    })
  }

  const cmykHex = useMemo(() => cmykToHex(cmyk.c, cmyk.m, cmyk.y, cmyk.k), [cmyk])

  return (
    <div className="color-panel">
      <div className="color-header">
        <div className="color-chip" style={{ background: current }} aria-label="Current color" />
        <div className="color-meta">
          <div className="color-meta-title">Palette</div>
          <div className="color-meta-sub">Harmony + CMYK controls</div>
        </div>
      </div>

      <div className="color-section">
        <div className="color-label">Recent</div>
        <div className="swatch-row">
          {recent.map((c) => (
            <button
              key={c}
              className={`swatch ${c === current ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => apply(c)}
              aria-label={`Recent color ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-label">Harmony Rules</div>
        <div className="harmony-list">
          {harmonyRules.map((rule) => (
            <button
              key={rule.name}
              className="harmony-row"
              onClick={() => apply(rule.colors[0])}
              title={rule.name}
            >
              <div className="harmony-swatches">
                {rule.colors.map((c) => (
                  <span key={c} className="harmony-chip" style={{ background: c }} />
                ))}
              </div>
              <span className="harmony-name">{rule.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-label">Swatches</div>
        <div className="swatch-groups">
          {swatchGroups.map((group) => (
            <div className="swatch-group" key={group.name}>
              <div className="swatch-group-title">{group.name}</div>
              {group.entries ? (
                <div className="swatch-tiles">
                  {group.entries.map((entry) => (
                    <button
                      key={entry.name}
                      className="swatch-tile"
                      onClick={() => apply(entry.color)}
                      aria-label={entry.name}
                    >
                      <span className="swatch-square" style={{ background: entry.color }} />
                      <span className="swatch-name">{entry.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="swatch-grid">
                  {group.colors.map((c) => (
                    <button
                      key={c + group.name}
                      className={`swatch ${c === current ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => apply(c)}
                      aria-label={`${group.name} ${c}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-label">CMYK Picker</div>
        <div className="cmyk-controls">
          {(['c', 'm', 'y', 'k'] as const).map((key) => (
            <label key={key} className="cmyk-field">
              <span>{key.toUpperCase()}</span>
              <input
                type="number"
                min={0}
                max={100}
                value={cmyk[key]}
                onChange={(e) =>
                  setCmyk((prev) => ({ ...prev, [key]: Number.parseInt(e.target.value || '0', 10) }))
                }
              />
            </label>
          ))}
          <div className="cmyk-preview">
            <span className="cmyk-chip" style={{ background: cmykHex }} />
            <code>{cmykHex}</code>
            <button type="button" className="ghost-button" onClick={() => apply(cmykHex)}>
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="color-section">
        <div className="color-label">Hex</div>
        <input
          type="color"
          value={current}
          onChange={(e) => apply(e.target.value)}
          aria-label="Custom color picker"
        />
      </div>

      <div className="color-section spectrum">
        <div className="color-label">Spectrum</div>
        <div className="spectrum-panel" />
      </div>

      <div className="color-section">
        <div className="color-label">Shades & Tints</div>
        <div className="shade-tint-grid">
          {Array.from({ length: 6 }).map((_, row) => (
            <div className="shade-row" key={row}>
              {Array.from({ length: 10 }).map((__, col) => {
                const factor = (col + 1) / 10
                const tint = (hex: string) => {
                  const num = Number.parseInt(hex.replace('#', ''), 16)
                  const r = (num >> 16) & 255
                  const g = (num >> 8) & 255
                  const b = num & 255
                  const mix = (c: number) => Math.round(c + (255 - c) * factor)
                  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
                }
                return (
                  <button
                    key={`${row}-${col}`}
                    className="shade-cell"
                    style={{ background: tint(current || '#4aa3ff') }}
                    onClick={() => apply(tint(current || '#4aa3ff'))}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
