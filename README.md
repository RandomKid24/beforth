# <p align="center">BEFORTH</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer_Motion-12.2-FF0055?style=for-the-badge&logo=framer" alt="Framer Motion" />
</p>

<p align="center">
  <strong>We ship banger apps. Bespoke software. Zero BS.</strong><br />
  A high-density, modern digital agency platform built for maximum conversion and premium feel.
</p>

---

## ⚡ Quick Links

| [Live Demo](https://beforth.in) | [Documentation](#-design-system) | [Components Catalog](#-core-components) | [Contact Us](https://beforth.in/contact) |
| :--- | :--- | :--- | :--- |

---

## 🎨 Design System

Our design system is built around the **Golden Ratio** ($\phi \approx 1.618$) for spacing and typography, combined with a brutalist yet refined visual language.

### 🍱 The Palette
Managed via Tailwind CSS variables in `src/index.css` for a high-contrast, professional aesthetic.

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Primary Accent** | `#2563EB` | Active states, primary buttons, brand identity. |
| **Cream (Light)** | `#F8FAFC` | Primary background for light mode sections. |
| **Dark (Slate)** | `#020617` | Contrast sections, footers, and deep backgrounds. |
| **Text Dark** | `#0F172A` | High-readability body text on light backgrounds. |
| **Muted Text** | `#64748B` | Secondary metadata and decorative descriptions. |

### 🖋️ Typography
A fluid typographic scale using three distinct font families to reduce visual clutter.

- **Display:** `Space Grotesk` — Massive, uppercase headings for impact.
- **Sans:** `Inter` — Precision body text for readability.
- **Mono:** `JetBrains Mono` — Metadata, navigation, and technical labels.

---

## 🧩 Core Components

### 🏗️ Global Layout
The project follows a modular architecture where pages are assembled from high-density sections.

- **Navbar:** Smart fixed navigation using `mix-blend-difference` to adapt dynamically to background shifts.
- **Hero Sections:** Massive fluid headings with parallax visual layers.
- **Dark Sections:** Every page concludes with an inverted contrast section to anchor the brand identity before the footer.

### 🛠️ Reusable UI Primitives
Defined in `@layer components` within `src/index.css`:
- `badge`: Pill-shaped metadata labels.
- `card`: Standard containers with 1.618 spacing rhythm.
- `skeuo-btn`: Premium skeuomorphic buttons with depth and tactile response.
- `skeuo-switch`: Architectural toggle switches for settings and modes.

---

## 📄 Page Architecture

- **Home:** Introduces the "We Ship Banger Apps" mantra with a device mockup showcase.
- **Services:** Detailed grid of offerings from Custom ERPs to Native Mobile Apps.
- **About:** Mission statement and core values grid.
- **Team:** Dynamic cards featuring social integrations and profile hover effects.
- **Contact:** Sleek lead capture form and global presence headquarters map.

---

## 🎬 Creative Physics & Animations

We leverage hardware-accelerated animations via `motion/react` and `gsap`.

- **Snappiness:** Transitions use `ease: [0.16, 1, 0.3, 1]` for an immediate yet organic feel.
- **Parallax:** Scroll-triggered transformations that add depth to device mockups and headings.
- **Interactive:** Hover-triggered border expansions and magnetic button effects.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

<p align="center">
  Made with 💙 by <strong>BEFORTH</strong><br />
  <em>Bespoke Software for Visionaries.</em>
</p>
