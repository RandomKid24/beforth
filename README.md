# <p align="center">BEFORTH</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.2-FF0055?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

<p align="center">
  <strong>We build custom software — ERP, web platforms &amp; mobile apps.</strong><br />
  Software engineered around how your business actually works, not the other way around.
</p>

---

## ⚡ Quick Links

| [Live Demo](https://beforth.in) | [COLOR_PALETTE.md](COLOR_PALETTE.md) | [Contact](https://beforth.in/contact) |
| :--- | :--- | :--- |

---

## 🎨 Design System — "Signal Ink"

A high-contrast, professional palette in a **Paper / Ink / Deep / Signal / Muted**
family. Every color ships with an exact **CMYK** equivalent in
[`COLOR_PALETTE.md`](COLOR_PALETTE.md) so the site and printed brand documents
always match.

| Color | HEX (RGB) | CMYK | Role |
| :--- | :--- | :--- | :--- |
| **Paper** (Card Background) | `#F2F7F9` | `C 3 M 1 Y 0 K 2` | Main background |
| **Bone** (Light Wave) | `#D6E7F1` | `C 11 M 4 Y 0 K 5` | Section contrast |
| **Ink** (Black / Logo Ink) | `#231F20` | `C 0 M 11 Y 9 K 86` | Primary text, dark sections |
| **Ash** (Grey Tagline) | `#6D737F` | `C 14 M 9 Y 0 K 50` | Secondary text |
| **Signal** (Dark Wave) | `#1C75BC` | `C 85 M 38 Y 0 K 26` | Accent / primary |
| **Wave** (Middle Wave) | `#75BAE6` | `C 49 M 19 Y 0 K 10` | Accent on dark surfaces |

Tokens are defined in `src/index.css` via Tailwind v4 `@theme`.

### Typography
- **Display:** `Bebas Neue` — massive uppercase headings.
- **Sans:** `Inter` — body copy and readability.
- **Mono:** `JetBrains Mono` — metadata, labels, technical text.

---

## 🧩 Site Structure

- **Home** — a clear narrative: what we do (ERP / web / mobile), why custom
  beats off-the-shelf, featured work, the delivery process, and a contact CTA.
- **Services** — the three core offerings plus the modules we deliver
  (ERP, CRM, HRMS, POS, automation) and our security guarantees.
- **About** — who we are, the mission, values, and quick stats.
- **Team** — the founding team behind the builds.
- **Contact** — lead-capture form with live availability + contact channels.

### Reusable UI Primitives (`src/index.css`)
- `badge` · `card` · `icon-box` · `page-container` · `dark-section`
- `eyebrow` / `eyebrow-dot` / `eyebrow-text` — section labels
- `skeuo-btn` / `skeuo-switch` — tactile skeuomorphic controls

---

## 🚀 Getting Started

```bash
npm install        # dependencies
npm run dev        # local dev server (port 3000)
npm run build      # production build
npm run lint       # TypeScript check (tsc --noEmit)
```

---

<p align="center">
  Made with 💙 by <strong>BEFORTH</strong><br />
  <em>Bespoke software for ambitious businesses. Nashik · India · Worldwide.</em>
</p>