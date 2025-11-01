# 2s6y Marketing Site - Project Context

**Project Type**: Static Marketing Landing Page
**Framework**: Next.js 15 (Static Export)
**Status**: Production Ready
**Last Updated**: 2025-11-01

---

## Project Overview

The 2s6y marketing site is a standalone Next.js static site that serves as the landing page for the 2s6y application. It's deployed separately from the main app and accessible at `bykc.pro/2s6y`.

### Purpose
- Introduce 2s6y to new visitors
- Explain the core value proposition
- Drive sign-ups and sign-ins
- Link to the main application

### Key Characteristics
- **No Backend**: Pure static site with no server-side logic
- **No Authentication**: No Clerk, no user sessions
- **No Database**: No Convex, no data persistence
- **Static Export**: Builds to `/out` directory for CDN deployment
- **Vercel Rewrites**: Configured to serve from `/2s6y` path via vercel.json

---

## Tech Stack

### Core
- **Next.js 15.4.7** - React framework with static export
- **React 19** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/postcss** - Tailwind CSS 4 PostCSS plugin
- **DaisyUI 5.1.25** - Component library (cupcake theme)
- **Instrument Sans** - Primary font (via next/font/google)
- **Instrument Serif** - Display font (via Google Fonts CDN)

### Animation
- **Whatamesh** - Animated gradient background component

---

## Project Structure

```
2s6y-marketing/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Landing page (responsive)
│   └── globals.css         # Tailwind + DaisyUI theme config
├── components/
│   └── branding/
│       └── AnimatedLogo.tsx # Whatamesh gradient logo
├── public/
│   └── 2s6y/
│       └── favicon.svg     # Logo/favicon
├── .claude/                # Agentic framework config
├── next.config.ts          # basePath: "/2s6y", output: "export"
├── postcss.config.mjs      # Tailwind CSS 4 PostCSS setup
└── package.json            # Dependencies
```

---

## Design System

### Colors (DaisyUI Cupcake Theme)

Defined in `app/globals.css` using `@plugin "daisyui/theme"`:

- **Primary**: `#a442fe` (Purple)
- **Primary Content**: `#f8f3ff` (Light purple text)
- **Base-100**: `#f8f2ed` (Lightest beige background)
- **Base-200**: `#e8e1dc` (Light beige)
- **Base-300**: `#dad2cd` (Warm beige - main background)
- **Base Content**: `#291334` (Dark purple text)
- **Secondary**: `#eeba79` (Warm orange)
- **Accent**: `#80e4e4` (Cyan)

### Typography

- **Headings**: Instrument Serif (Google Fonts)
- **Body**: Instrument Sans (next/font/google with CSS variable)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont, etc.)

### Responsive Breakpoints

- **Mobile**: < 768px (single column, centered)
- **Tablet**: 768px - 1023px (single column, larger)
- **Desktop**: ≥ 1024px (two column layout)

---

## Configuration

### next.config.ts

```typescript
const nextConfig = {
  output: "export",            // Static site generation
  images: {
    unoptimized: true,         // Required for static export
  },
};
```

### vercel.json

```json
{
  "rewrites": [
    {
      "source": "/2s6y",
      "destination": "/"
    },
    {
      "source": "/2s6y/:path*",
      "destination": "/:path*"
    }
  ]
}
```

This configuration allows the site to be accessed at both the root URL and `/2s6y` path.

### postcss.config.mjs

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"], // Tailwind CSS 4
};
```

### globals.css

Uses Tailwind CSS 4 syntax:
- `@import "tailwindcss"`
- `@plugin "daisyui"`
- `@plugin "daisyui/theme"` with custom colors
- `@theme` block with design tokens

---

## Development

### Local Development

```bash
npm run dev
```

Runs on `http://localhost:3000` (or next available port)
Access at `http://localhost:3000`

### Build

```bash
npm run build
```

Generates static files in `/out` directory

### Deployment

Deploy to Vercel:
1. Connect GitHub repository to Vercel
2. Configure build settings (auto-detected)
3. Deploy to production
4. Configure DNS: `bykc.pro/2s6y` → Vercel deployment

---

## Links to Main App

All CTAs link to the main 2s6y application:

- **Sign Up**: `https://2s6y.bykc.pro/sign-up`
- **Sign In**: `https://2s6y.bykc.pro/signin`
- **Logo**: `https://2s6y.bykc.pro`

---

## Design System Compliance

This marketing site uses the **exact same** DaisyUI cupcake theme as the main app:
- Same color tokens
- Same font system
- Same component styling
- Same border radius values

This ensures visual consistency when users navigate from marketing → app.

---

## Development Guidelines

### Adding Content

- Edit `app/page.tsx` for landing page content
- Maintain responsive design (mobile/tablet/desktop layouts)
- Use DaisyUI utility classes (see [daisyui.com](https://daisyui.com))

### Styling Rules

- **Use DaisyUI classes**: `btn`, `navbar`, `link`, etc.
- **Use Tailwind utilities**: `flex`, `gap-4`, `text-3xl`, etc.
- **NO custom CSS**: Stay within design system
- **NO inline styles**: Use utility classes

### Visual Testing

Use Playwright browser tools to verify:
- Mobile (< 768px)
- Tablet (768px - 1023px)
- Desktop (≥ 1024px)

```bash
npx playwright test
```

---

## Troubleshooting

### Colors not matching main app

1. Check `app/globals.css` has `@plugin "daisyui/theme"` with correct hex values
2. Verify `postcss.config.mjs` exists and loads `@tailwindcss/postcss`
3. Clear `.next` cache: `rm -rf .next && npm run dev`

### Fonts not loading

1. Verify `next/font/google` import in `app/layout.tsx`
2. Check Google Fonts CDN link in `<head>` for Instrument Serif
3. Confirm CSS variable `--font-instrument-sans` is set

### basePath issues

All URLs must include `/2s6y`:
- ❌ `http://localhost:3000`
- ✅ `http://localhost:3000/2s6y`

---

## Future Enhancements

Potential improvements (not currently needed):

- Add more landing pages (pricing, features, about)
- Implement A/B testing for CTA copy
- Add analytics tracking (Google Analytics, Plausible)
- Create blog section for content marketing
- Add testimonials/social proof section

---

**For framework documentation**: See `.claude/core/Framework.md`
**For agent protocols**: See `.claude/core/agents/`
**For development guides**: See `.claude/guides/`
