# NOVA — Premium AI Workspace (Frontend)

A cinematic, award-style marketing + authentication frontend for a fictional
AI productivity SaaS. Three fully polished, responsive experiences:

- **Landing** (`/`) — floating navbar, cinematic hero with a live HTML/CSS
  dashboard that tilts into a frontal view on scroll (GSAP ScrollTrigger),
  three interactive feature demos, an asymmetric bento grid, an interactive
  "Ask NOVA" showcase, marquee social proof, and a dramatic final CTA.
- **Sign In** (`/signin`) and **Sign Up** (`/signup`) — one continuous
  split-screen auth surface. Switching between them slides the visual panel
  and the form past each other, morphs the brand mark, and converges a
  particle field from a scattered nebula (Sign In) into the NOVA spark
  constellation (Sign Up).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens in `app/globals.css`)
- **GSAP + ScrollTrigger** — scroll-driven dashboard perspective
- **Lenis** — smooth scrolling, synced to the GSAP ticker
- **Motion (Framer Motion)** — reveals, layout transitions, micro-interactions
- **Lucide** icons + custom inline brand marks
- Custom **canvas** particle system for the auth visual (no heavy 3D deps)

## Experience details

- Custom two-part cursor with magnetic buttons (desktop only)
- First-visit intro loader (once per session)
- Route transitions via App Router `template.tsx`
- **Per-section animated canvas backgrounds** (`components/landing/SectionFX.tsx`)
  — a different bespoke effect behind each section: flow-field (hero), aurora
  ribbons (features), circuit grid + light pulses (bento), sonar rings +
  orbiters (showcase), drifting starfield (social proof), rotating light rays
  (final CTA). Each is viewport-gated (pauses off-screen) and DPR/particle
  capped for 60fps; renders a single static frame under reduced-motion.
- Animated gradient lighting, dot grids, and background grain
- Fully responsive — auth uses a dedicated mobile composition, not a squeeze
- `prefers-reduced-motion` respected throughout; pointer effects disabled on
  touch devices for performance

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the build
```

## Structure

```
app/
  layout.tsx            # fonts, metadata, providers, cursor, loader
  template.tsx          # per-route entrance animation
  page.tsx              # landing page
  (auth)/signin|signup  # both render <AuthExperience/> in different states
components/
  landing/              # navbar, hero, dashboard, features, bento, showcase…
  auth/                 # AuthExperience, AuthVisual (canvas), forms, inputs
  ui/                   # Button, Cursor, Logo, Loader, Reveal, brand icons
  providers/            # Lenis smooth-scroll provider
lib/                    # cn() util + client hooks
```

Content, brands, and metrics are fictional placeholders. No backend — auth
submits are visual-only.
