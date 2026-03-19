# BEFORTH - UI Design & Component Documentation

Welcome to the BEFORTH frontend documentation. This project is built using React, Tailwind CSS, and Framer Motion, focusing on a modern, high-contrast, and dynamic aesthetic.

## 🎨 Design System

Our design system is built around the "golden ratio" for spacing and typography, combined with a brutalist yet refined visual language.

### Color Palette
- **Primary Accent:** Blue (`#2563EB`) - Used for active states, primary buttons, and subtle highlights.
- **Background (Light):** Off-White (`#F8FAFC`) - The primary background color for most pages.
- **Background (Dark):** Slate (`#0F172A`) - Used for contrast sections and the footer.
- **Text (Dark):** Slate (`#0F172A`) - Primary text color on light backgrounds.
- **Text (Light):** White (`#FFFFFF`) - Primary text color on dark backgrounds.
- **Muted Text:** Slate/Gray (`#64748B` or `#0F172A`/60) - Used for secondary information and descriptions.

### Typography
- **Display Font:** `font-display` (e.g., Space Grotesk or similar) - Used for massive, uppercase headings.
- **Sans Font:** `font-sans` (e.g., Inter) - Used for body text and general reading.
- **Mono Font:** `font-mono` (e.g., JetBrains Mono) - Used for metadata, tags, small labels, and navigation links.

### Key Visual Effects
- **Stroke Text:** `[-webkit-text-stroke:1.5px_#0F172A]` - Used on large display headings to create a hollow, outlined text effect.
- **Mix-Blend-Difference:** Used on the Navbar to ensure text is visible regardless of the background color it scrolls over.
- **Golden Ratio Spacing:** Values like `0.618rem`, `1.618rem`, `2.618rem`, and `4.236rem` are used for margins and padding to create natural rhythm.
- **Subtle Borders:** `border-[#0F172A]/5` or `border-[#0F172A]/10` are used to define cards and sections without heavy shadows.

---

## 🧩 Core Components

### 1. Navbar (`src/App.tsx`)
- **Description:** A fixed, top-aligned navigation bar.
- **Features:**
  - Uses `mix-blend-difference` to adapt to underlying content colors.
  - Desktop view includes mono-spaced links with a growing underline hover effect.
  - Mobile view features a hamburger menu that triggers a full-screen overlay with staggered link animations.
- **Usage:** Rendered at the root level in `App.tsx` to persist across all routes.

### 2. Footer (`src/App.tsx`)
- **Description:** A dark, comprehensive footer section.
- **Features:**
  - Contains a massive "BEFORTH" display text that scales with the viewport.
  - Includes grid layouts for navigation links, social links, and legal information.
- **Usage:** Rendered at the root level in `App.tsx` below the main routing outlet.

### 3. Page Layouts
All pages follow a consistent structural pattern:
1. **Hero Section:** Large display heading (often split into multiple lines with one line using the stroke text effect), a subtitle, and a brief description.
2. **Content Grid:** The main content (services, team members, values) is displayed in responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-x`).
3. **Dark Contrast Section:** Every page ends with a dark (`bg-[#0F172A]`) section to provide visual contrast before the footer. This section typically highlights a key value proposition (e.g., Security, Hiring, Global Presence).

---

## 📄 Pages

### Home Page (`src/pages/Home.tsx` or `App.tsx` default route)
- **Purpose:** The landing page introducing the agency.
- **Key Elements:** Massive "WE SHIP BANGER APPS" hero text, a marquee of technologies, and a showcase of featured work.

### Services Page (`src/pages/Services.tsx`)
- **Purpose:** Details the specific offerings of the agency.
- **Key Elements:** "OUR SERVICES" hero, a grid of service cards with icons, a detailed breakdown of "Live System" metrics, and an "Enterprise-Grade Security" dark section.

### About Page (`src/pages/About.tsx`)
- **Purpose:** Explains the company's mission and values.
- **Key Elements:** "ABOUT US" hero, a mission statement block, a grid of core values with icons, and a "Ready to Innovate?" dark section.

### Team Page (`src/pages/Team.tsx`)
- **Purpose:** Introduces the key members of the agency.
- **Key Elements:** "OUR TEAM" hero, a grid of team member cards featuring image hover effects and social links, and a "Join the Collective" dark section highlighting open roles.

### Contact Page (`src/pages/Contact.tsx`)
- **Purpose:** Provides ways for potential clients to get in touch.
- **Key Elements:** "CONTACT US" hero, direct contact information (email, phone, office), a sleek contact form, and a "Global Presence" dark section.

---

## 🎬 Animations

We heavily rely on `framer-motion` for fluid, hardware-accelerated animations.

- **Easing:** We frequently use a custom cubic-bezier easing: `ease: [0.16, 1, 0.3, 1]` for a snappy yet smooth feel.
- **Entrance Animations:** Elements typically fade in (`opacity: 0` to `1`) and slide up (`y: 20` to `0`) as they enter the viewport using `whileInView`.
- **Hover States:** 
  - Buttons and cards often scale up slightly (`scale: 1.05`).
  - Decorative lines (like the blue top border on cards) expand from `scale-x-0` to `scale-x-100` on hover.
  - Icons within cards may scale up or change color.

## 🛠 Dependencies
- `react` & `react-dom`
- `react-router-dom` (Routing)
- `motion/react` (Animations)
- `lucide-react` (Icons)
- `tailwindcss` (Styling)
