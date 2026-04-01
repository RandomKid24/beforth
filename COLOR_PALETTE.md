# 🎨 BEFORTH - Color Architecture

The BEFORTH design system is built on a high-contrast, brutalist-premium aesthetic. We use a restricted palette to ensure visual clarity, industrial precision, and a "banger" brand presence.

---

## 🏗️ Core Palette

| Color | Hex | Tailwind Class | Role |
| :--- | :--- | :--- | :--- |
| <img src="https://via.placeholder.com/15/f8fafc/000000?text=+" /> **Cream** | `#F8FAFC` | `bg-slate-50` | Primary background. The "Paper" layer. |
| <img src="https://via.placeholder.com/15/0f172a/000000?text=+" /> **Slate** | `#0F172A` | `text-slate-900` | Primary text and content blocks. |
| <img src="https://via.placeholder.com/15/020617/000000?text=+" /> **Deep Slate** | `#020617` | `bg-slate-950` | Ultra-contrast sections and footer depth. |
| <img src="https://via.placeholder.com/15/2563eb/000000?text=+" /> **Blue** | `#2563EB` | `bg-primary` | High-energy accent and action states. |
| <img src="https://via.placeholder.com/15/64748b/000000?text=+" /> **Pale** | `#64748B` | `text-slate-500` | Support text, borders, and muted labels. |

---

## 🧪 Functional Variations

### 🧊 Glassmorphism
Used for interactive cards and floating UI elements.
- **Background:** `white/40`
- **Blur:** `backdrop-blur-md`
- **Border:** `slate-200/50`
- **Hover:** `white/80` with `primary/30` border.

### 🕹️ Skeuomorphism
Used for the "Control Center" feel (switches, buttons).
- **Surface:** `linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)`
- **Shadows:** `0 6px 0 #94A3B8` (gives it height).
- **Active State:** `linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)`

### ⚡ Brand Gradient
The "Beforth Pulse" used in hero CTAs.
- **Colors:** `#2563EB` (Blue) → `#4F46E5` (Indigo) → `#7C3AED` (Violet).
- **Behavior:** Animated `300%` background position.

---

## 🏷️ Usage Rules

1. **Hierarchy:** `Cream` is the stage. `Slate` is the actor. `Blue` is the spotlight.
2. **Contrast:** Never use `Pale` text on `Deep Slate` backgrounds; always revert to `Cream` for legibility.
3. **Accents:** Use `Blue` sparingly—it should only lead to an action (Link, Button, Toggle).

---

> [!TIP]
> **Pro Design Tip:** When using the Blue accent, use it with a low-opacity background (e.g., `bg-[#2563EB]/10`) to create "Ghost Badges" that feel premium without being overwhelming.
