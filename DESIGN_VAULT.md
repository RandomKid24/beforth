# BEFORTH - Design Vault & Section Library

This document contains the exact JSX structures and design patterns for every major section of the BEFORTH website. Use this as a reference to recreate or iterate on these designs elsewhere in the application.

---   

## 1. Hero Sections

### Standard Page Hero (e.g., Services, About)
Characterized by a pulsing indicator, a "Our Story/Expertise" label, and massive typography with a light description.

**JSX Structure:**
```tsx
<div className="page-container">
  <section className="min-h-screen snap-start flex flex-col justify-center">
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto w-full"
    >
      {/* Indicator */}
      <div className="flex items-center gap-3 mb-[1.618rem]">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[0.85rem] tracking-widest uppercase text-slate-500">CATEGORY</span>
      </div>

      {/* Heading */}
      <h1 className="hero-heading mb-12">
        <span className="block">LINE ONE</span>
        <span className="block text-transparent [-webkit-text-stroke:1.5px_#0F172A]">LINE TWO.</span>
      </h1>

      {/* Description */}
      <p className="text-[1.2rem] md:text-[1.618rem] font-sans text-slate-500 font-light leading-[1.618] max-w-2xl">
        Brief description text goes here...
      </p>
    </motion.div>
  </section>
</div>
```

---

## 2. Grid Sections

### The "Clean" Service Grid (3-Column Bordered)
A minimalist grid using subtle borders (`border-slate-900/10`) and monochrome-to-color hover states.

**JSX Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-900/10 mb-12">
  {items.map((item) => (
    <motion.div className="group p-8 md:p-12 hover:bg-slate-950 hover:text-white transition-all duration-700 border-slate-900/10 border-l border-t">
       {/* Identity (01, 02) */}
       <div className="font-mono text-[0.75rem] text-primary mb-12 uppercase">{item.id}</div>
       {/* Icon */}
       <Icon className="w-12 h-12 mb-8 text-slate-400 group-hover:text-primary transition-colors" />
       {/* Content */}
       <h3 className="text-2xl font-display uppercase mb-6 group-hover:translate-x-2 transition-transform">{item.title}</h3>
       <p className="font-sans font-light text-slate-500 group-hover:text-slate-300 mb-8">{item.desc}</p>
       {/* Tags */}
       <div className="flex flex-wrap gap-2">
         <span className="px-3 py-1 border border-slate-200 text-[10px] uppercase">{tag}</span>
       </div>
    </motion.div>
  ))}
</div>
```

---

## 3. High-Density Sections

### Glassmorphic "Solutions" Grid (4-Column Floating)
Uses `backdrop-blur-md`, `bg-white/40`, and negative top margins to create a layered, multi-dimensional look.

**JSX Structure:**
```tsx
<section className="relative overflow-hidden">
  {/* Background Glow */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
  
  <div className="max-w-7xl mx-auto w-full relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* SEE: UI_GUIDELINES.md Section H for the Glassmorphic Card Code */}
    </div>
  </div>
</section>
```

---

## 4. Dark Contrast Sections

### "Security First" Style Section
Full-width dark background (`bg-[#020617]`) with outline text and high-contrast labels.

**JSX Structure:**
```tsx
<section className="min-h-screen snap-start flex flex-col justify-center">
  <div className="dark-section w-full py-24 bg-[#020617] text-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
      <div>
        <h2 className="text-4xl md:text-5xl font-display uppercase mb-6 leading-tight">
          HEADER <br />
          <span className="text-transparent [-webkit-text-stroke:1px_white]">OUTLINE TEXT.</span>
        </h2>
        <p className="text-slate-400">Description...</p>
      </div>
      <div className="flex flex-col gap-4">
        {/* Simple Label Cards */}
        <div className="p-6 bg-slate-900/50 border border-white/5 flex items-center justify-between group hover:bg-slate-900">
          <span className="font-mono text-sm uppercase">LABEL</span>
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 5. Forms & Inputs

### Contact Form Strategy
Shadow-heavy, minimalist form with a bold accent line and negative margin lift.

**JSX Structure:**
```tsx
<div className="bg-white p-8 md:p-12 border border-slate-900/10 relative shadow-2xl md:-mt-20">
  {/* Top Accent */}
  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
  
  <form className="flex flex-col gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="flex flex-col gap-2">
          <label className="font-mono text-[10px] tracking-widest uppercase text-slate-500">LABEL</label>
          <input className="bg-slate-50 border border-slate-200 p-4 focus:border-primary outline-none transition-colors" />
       </div>
    </div>
    {/* Button: SEE UI_GUIDELINES.md Section C for Fill Button Code */}
  </form>
</div>
```

---

## 6. Global Elements

### Premium Footer
High-density sitemap, massive tagline, and social indicators.

**Key Ingredients:**
* **Tagline:** `text-[clamp(2.5rem,8vw,5.5rem)] font-display uppercase leading-none`
* **Links:** Animated underlines (Section F in guidelines).
* **Metadata:** Small `font-mono` text with Golden Ratio spacing.

---

## 7. Navigation & Menus

### The "Floating Capsule" Navbar
A responsive navbar that transitions from a centered pill to a full-width mobile menu.

**Key Features:**
- **Glassmorphism:** `bg-white/80 backdrop-blur-xl border border-slate-200/50`.
- **Active Indicator:** Uses Framer Motion's `layoutId` for smooth transitions between links.
- **Magnetic CTA:** The "Let's Talk" button is wrapped in a `<Magnetic />` component.

**JSX Structure (Wrapper):**
```tsx
<motion.div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4">
  <div className="pointer-events-auto flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
    {/* Navigation Links & Buttons */}
  </div>
</motion.div>
```

### Mobile Menu Overlay
A full-screen radial reveal menu with staggered child animations.

**Visual Pattern:**
- **Reveal:** `clipPath: "circle(150% at calc(100% - 40px) 40px)"`.
- **Text Style:** Massive uppercase `font-display` with a ghost-text background (`text-white/[0.02]`).

---

## 8. Signature Backgrounds

### The "System Grid" Background
A layered background involving parallax blobs and a moving grid "scan" effect.

**Layers:**
1. **Depth Blobs:** Absolute-positioned divs with `blur-[120px]` and `bg-primary/5`.
2. **Static Grid:** `bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),...] bg-[size:24px_24px]`.
3. **Animated Scanline:** A second grid with a `linear-gradient` mask that moves using `maskPosition`.

---

## 9. Complex CSS Mockups

### 3D-Feeling Device Containers
Used in the Hero section to show "Enterprise Dashboards" without using images.

**Key Features:**
- **Perspective:** `perspective: '2000px'` on the parent.
- **Transformation:** `rotateY: -15, rotateX: 5` to create depth.
- **Glass Details:** Aspect-ratio-locked divs with `bg-[#F8FAFC]` and `border-[#2563EB]/30`.

**JSX Structure (Base):**
```tsx
<motion.div 
  style={{ transformStyle: 'preserve-3d', perspective: '2000px' }}
  className="relative w-full aspect-square"
>
  <div className="absolute aspect-[1.618/1] bg-[#F8FAFC] border border-[#2563EB]/30 shadow-2xl overflow-hidden" />
</motion.div>
```
