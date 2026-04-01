# BEFORTH - Design System & UI Guidelines

This document serves as the single source of truth for the BEFORTH design system. It outlines the core visual language (colors, typography, spacing) and provides copy-pasteable recipes for recreating the core UI components using React, Tailwind CSS, and Framer Motion.

---

## 1. Color Palette

The site uses a strict, high-contrast 4-color palette to maintain a clean, brutalist, yet premium feel.

| Color Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Cream (Light)** | `#F8FAFC` | `bg-[#F8FAFC]`, `text-[#F8FAFC]` | Primary background for light sections, text on dark sections. |
| **Slate (Dark)** | `#0F172A` | `bg-[#0F172A]`, `text-[#0F172A]` | Primary text color, background for dark sections/footers. |
| **Deep Slate (Pitch)**| `#020617` | `bg-[#020617]` | Used for ultra-dark contrast sections (like the "Off-the-shelf is broken" section). |
| **Sage / Blue (Accent)**| `#2563EB` | `bg-[#2563EB]`, `text-[#2563EB]` | Primary accent color. Used for hover states, active indicators, borders, and the main CTA section. |
| **Pale (Muted)** | `#64748B` | `text-[#64748B]`, `border-[#64748B]` | Subtle text, secondary descriptions, inactive states, and soft borders. |

---

## 2. Typography

The typography system relies on extreme contrast between massive, impactful display fonts and tiny, precise monospace fonts.

### Fonts
1. **Display:** `Bebas Neue` (`font-display`)
   * **Usage:** Massive section headers, Marquees, Hero text.
   * **Styling:** ALWAYS `uppercase`. Often used with tight line-height (`leading-[1.05]`) and sometimes with text-stroke (`text-transparent [-webkit-text-stroke:1px_#0F172A]`).
2. **Sans-serif:** `Inter` (`font-sans`)
   * **Usage:** Body paragraphs, descriptions, readable content.
   * **Styling:** Usually `font-light` or `font-medium`. Relaxed line-height (`leading-[1.618]`).
3. **Monospace:** `JetBrains Mono` (`font-mono`)
   * **Usage:** Micro-labels, tags, navigation links, sitemap, metadata.
   * **Styling:** ALWAYS `uppercase`, `tracking-widest`, and very small (`text-xs` or `text-[0.75rem]`).

### Font Sizes (Golden Ratio Scale)
We use the Golden Ratio (`1.618`) for scaling typography and spacing.
* **Massive (Hero):** `text-[clamp(3.5rem,14vw,6rem)]` to `text-[clamp(4rem,8.5vw,8rem)]`
* **H2 (Section Headers):** `text-[4.236rem]` to `text-[6.854rem]`
* **H3 (Card Headers):** `text-[2.618rem]`
* **Body:** `text-[1rem]` to `text-[1.2rem]`
* **Micro:** `text-[0.85rem]`, `text-[0.75rem]`, `text-xs`

---

## 3. Spacing & Layout

* **Container:** `max-w-7xl mx-auto px-6 md:px-[10%]`
* **Golden Ratio Spacing:** Instead of standard Tailwind spacing (like `mt-10`), we use specific REM values based on the golden ratio:
  * `0.382rem`, `0.618rem`, `1rem`, `1.618rem`, `2.618rem`, `4.236rem`, `6.854rem`
* **Asymmetric Grids:** `grid-cols-1 md:grid-cols-[1fr_1.618fr]` or `md:grid-cols-[1.618fr_1fr]`

---

## 4. UI Components & Recipes

### A. The "Pill" Tag
Used for categories, tech stack labels, and metadata.

```tsx
<motion.span 
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="px-[1rem] py-[0.618rem] rounded-full border border-[#2563EB]/40 text-[#0F172A] font-mono text-[0.75rem] tracking-widest uppercase bg-[#2563EB]/10 cursor-default hover:bg-[#2563EB]/20 transition-colors duration-300"
>
  REACT NATIVE
</motion.span>
```

### B. Magnetic Button Wrapper
A wrapper component that makes its children pull towards the user's mouse. Requires `framer-motion`.

```tsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function Magnetic({ children }: { children: React.ReactElement }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
```

### C. Animated "Fill" Button (Used in Nav & Hero)
A button where a background color slides up from the bottom on hover.

```tsx
<a href="#" className="relative overflow-hidden px-8 py-4 border border-[#0F172A] rounded-full font-mono text-xs uppercase tracking-widest group inline-flex items-center gap-3 bg-[#0F172A] text-white">
  {/* Text */}
  <span className="relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-[#0F172A]">
    START A PROJECT
  </span>
  {/* Icon */}
  <ArrowRight className="w-4 h-4 relative z-10 transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:text-[#0F172A] group-hover:translate-x-1" />
  {/* Hover Background Fill */}
  <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
</a>
```

### D. Infinite Marquee
Used for background text and section dividers. Requires CSS keyframes.

**CSS (in index.css):**
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 20s linear infinite;
  width: max-content;
}
```

**React Component:**
```tsx
<div className="flex whitespace-nowrap animate-marquee items-center overflow-hidden">
  {[...Array(4)].map((_, i) => (
    <span key={i} className="text-[4.236rem] leading-[1.05] py-4 font-display uppercase text-transparent [-webkit-text-stroke:1px_#FFFFFF] mx-[1.618rem] tracking-wide">
      BUILD <span className="text-[#2563EB] mx-[1rem]">•</span> SCALE <span className="text-[#2563EB] mx-[1rem]">•</span> INNOVATE <span className="text-[#2563EB] mx-[1rem]">•</span>
    </span>
  ))}
</div>
```

### E. The "Giant Circle" CTA Button
The massive gradient button at the bottom of the page.

```tsx
<motion.a
  href="mailto:hello@beforth.in"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  className="relative w-[240px] h-[240px] rounded-full flex flex-col items-center justify-center overflow-hidden shadow-2xl group"
>
  {/* Animated Gradient Background */}
  <motion.div 
    className="absolute inset-0 bg-[linear-gradient(120deg,#2563EB,#4F46E5,#7C3AED,#2563EB)] bg-[length:300%_300%]"
    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
  />
  
  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-white">
    <span className="font-mono text-[1rem] tracking-widest uppercase mb-2">
      START BUILD
    </span>
    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
  </div>
</motion.a>
```

### F. Animated Link Underline
Used in the footer and standard text links.

```tsx
<a href="#" className="relative overflow-hidden group h-6 flex items-center font-mono text-sm tracking-widest uppercase text-[#2563EB]">
  <span className="block group-hover:-translate-y-[150%] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]">
    LINK TEXT
  </span>
  <span className="absolute top-0 left-0 block translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]">
    LINK TEXT
  </span>
</a>
```

### G. Process Accordion Item
Clickable list items that expand to reveal details.

```tsx
const [isOpen, setIsOpen] = useState(false);

<div onClick={() => setIsOpen(!isOpen)} className="group cursor-pointer">
  <div className="flex justify-between items-center mb-[1.618rem]">
    <div className="font-mono text-[0.75rem] tracking-widest text-[#2563EB]">01</div>
    <motion.div 
      animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? '#2563EB' : 'transparent', color: isOpen ? '#fff' : '#2563EB' }}
      className="w-6 h-6 rounded-full flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
    >
      +
    </motion.div>
  </div>
  <h3 className="text-[1.618rem] font-display uppercase">DISCOVERY</h3>
  
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <p className="mt-4 text-sm text-slate-500">Hidden details go here...</p>
      </motion.div>
    )}
  </AnimatePresence>
</div>
```

### H. Glassmorphic Solution Card
Used for service categories and feature grids. Combines backdrop blur with interactive hover states.

```tsx
<motion.div 
  whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
  className="group relative bg-white/40 backdrop-blur-md border border-slate-200/50 p-8 flex flex-col gap-6 hover:bg-white/80 hover:border-[#2563EB]/30 transition-colors duration-500 shadow-[0_0_50px_rgba(0,0,0,0.02)]"
>
  {/* Accent Line (Animated) */}
  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#2563EB] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
  
  {/* Icon Container */}
  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-[#2563EB]/10 group-hover:scale-110 transition-all duration-500">
    <Icon className="w-5 h-5 text-slate-400 group-hover:text-[#2563EB] transition-colors duration-500" />
  </div>
  
  {/* Content */}
  <div className="flex flex-col gap-1">
    <div className="text-3xl font-display uppercase tracking-tight text-slate-900">TITLE</div>
    <div className="font-mono text-[10px] tracking-[0.1em] text-[#2563EB] uppercase font-bold">SUBTITLE</div>
  </div>

  <p className="font-sans text-sm text-slate-500 leading-relaxed transition-colors duration-500 group-hover:text-slate-600">
    Description text goes here...
  </p>

  {/* Reveal Border */}
  <div className="mt-4 flex items-center justify-between pointer-events-none">
    <div className="w-8 h-[1px] bg-slate-200 group-hover:w-full group-hover:bg-[#2563EB]/20 transition-all duration-700" />
  </div>
</motion.div>
```

---

## 5. Layout & Balancing Patterns

To ensure the "premium" feel, we often use **Negative Margins** to lift elements and create overlap, which avoids the "boxy" look of standard grids.

* **Top Lift:** Use `md:-mt-20` or `md:-mt-24` on secondary columns in a grid (e.g., Contact Form, Hero Visuals) to break the horizontal alignment and create vertical rhythm.
* **Scroll-Based Parallax:** Use `Framer Motion`'s `useScroll` and `useTransform` to slightly shift background or side elements (e.g., `y: useTransform(scrollYProgress, [0, 1], [0, -100])`) to give the site a tactile, layered feel.

---

## 6. Brand Voice & Copywriting

BEFORTH uses a direct, energetic ("Banger") voice that balances professional expertise with high-energy language.

* **Tagline Philosophy:** Avoid generic "enterprise" speak.
  * **Bad:** "We provide digital transformation services."
  * **Good:** "Code that slaps. Software that scales."
  * **Good:** "Bespoke systems. Zero BS."
* **Clarity First:** While the voice is energetic, the core service names (HRMS, CRM, POS) must remain factual and clear.

