# BeForth Colour System

The site uses the BeForth brand palette from the business card: a warm near-black, a
cool grey, and three blues taken from the logo "waves". Values live as Tailwind theme
variables in `src/index.css`.

> **RGB vs CMYK** — the hex values in code are RGB (screens emit light). CMYK is a
> subtractive print model and depends on stock, profile and press. The CMYK column is the
> standard mathematical equivalent of each colour: a starting point that still needs a
> proof on your chosen paper.

---

## Palette

| Token | Brand name | Hex | RGB | CMYK (equivalent) | Role |
|---|---|---|---|---|---|
| `paper` | Card Background | `#F2F7F9` | 242, 247, 249 | C3 M1 Y0 K2 | Page canvas |
| `bone` | Light Wave | `#D6E7F1` | 214, 231, 241 | C11 M4 Y0 K5 | Section contrast, tiles, selected rows |
| `ink` | Black / Logo Ink | `#231F20` | 35, 31, 32 | C0 M11 Y9 K86 | Body text, dark fills |
| `ash` | Grey Tagline | `#6D737F` | 109, 115, 127 | C14 M9 Y0 K50 | Secondary text, captions, metadata |
| `signal` | Dark Wave | `#1C75BC` | 28, 117, 188 | C85 M38 Y0 K26 | Primary accent — buttons, active states |
| `wave` | Middle Wave | `#75BAE6` | 117, 186, 230 | C49 M19 Y0 K10 | Accent on dark surfaces |

### Derived shades (not in the brand palette)

| Token / use | Hex | CMYK | Why it exists |
|---|---|---|---|
| `signal-deep` | `#165B93` | C85 M38 Y0 K42 | Hover / pressed state for `signal` buttons — Dark Wave at 80% brightness |
| Chart ramp steps 2–3 | `#213C54`, `#1E5888` | C61 M29 Y0 K67, C78 M35 Y0 K47 | `ModuleViz` needs six ordered shades; these interpolate Black → Dark Wave |

Chart ramp (`ModuleViz.tsx`, dark → light): `#231F20` `#213C54` `#1E5888` `#1C75BC`
`#75BAE6` `#D6E7F1`.

Status colours in the demo UI (emerald / amber / red chips, the `#059669` sparkline) are
semantic and intentionally outside the brand palette.

CMYK formula (naive sRGB): `K = 1 − max(R,G,B)`, `C = (1 − R − K) / (1 − K)`, and likewise
for M and Y.

---

## Usage rules

1. **`paper` is the default canvas.** Every page starts on `paper`.
2. **`bone` marks a section break** — one step darker, same hue family.
3. **`ink` carries primary text.** On dark fills (`bg-ink`) use `paper` for text.
4. **`ash` is secondary text only.** Its contrast on `paper` is about 4.4:1, just under the
   4.5:1 AA threshold for small text — keep it for supporting copy, use `ink` for anything
   the reader must act on, and avoid thin weights below ~14px.
5. **`signal` is used sparingly** — one primary action per view, plus active states.
6. **On dark surfaces use `wave`, not `signal`.** `signal` on `ink` is only ~3.3:1.
7. **Dark sections (`bg-ink`) are contrast bands only.**

---

## Print note

`ink` converts to C0 M11 Y9 K86, which is a thin grey-black. For print, ask the printer
for the brand's native black (typically a rich black such as C60 M50 Y50 K100) rather than
using this conversion directly.
