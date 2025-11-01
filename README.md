# 2s6y Marketing Site

Standalone marketing landing page for 2s6y - Monthly Friend Group Newsletters

## Overview

This is a **static Next.js site** that serves as the marketing/landing page for 2s6y. It's completely separate from the main application and has no dependencies on authentication or backend services.

**Live URL**: Will be hosted at `https://your-domain.com/2s6y`

## Features

- **Static Export**: Pre-rendered HTML for fast loading
- **Responsive Design**: Mobile, tablet, and desktop optimized layouts
- **Animated Logo**: WebGL gradient with CSS fallback
- **Loading Screen**: Smooth first-visit experience
- **DaisyUI Cupcake Theme**: Consistent with main app branding
- **No Backend Dependencies**: Pure frontend, no auth required

## Tech Stack

- **Next.js 15** (App Router, static export)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **DaisyUI 5** (Cupcake theme)
- **Whatamesh** (WebGL gradient animations)

## Setup

### 1. Install Dependencies

```bash
cd /Users/kalyanchandana/Documents/GitHub/2s6y-marketing
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The site will be available at:
- **http://localhost:3000/2s6y** (with basePath)

### 3. Test Locally

Open your browser to `http://localhost:3000/2s6y` to see the landing page.

**Note**: The basePath `/2s6y` is configured in `next.config.ts` to match production deployment.

## Build for Production

### Static Export

This site uses Next.js static export to generate pure HTML/CSS/JS:

```bash
npm run build
```

Output will be in the `out/` directory:
```
out/
├── 2s6y/
│   ├── index.html
│   ├── _next/
│   ├── favicon.svg
│   ├── logo.svg
│   └── logo-mask.svg
```

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   cd /Users/kalyanchandana/Documents/GitHub/2s6y-marketing
   git init
   git add .
   git commit -m "Initial commit: 2s6y marketing site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/2s6y-marketing.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import `2s6y-marketing` repo
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Verify Deployment**:
   - Site will be at: `https://your-vercel-app.vercel.app/2s6y`
   - Test all links to main app work correctly

### Deploy to Custom Domain

If hosting on a custom domain (e.g., `https://bykc.pro/2s6y`):

1. Update basePath in `next.config.ts` if needed
2. Upload `out/` directory contents to your server
3. Ensure web server serves from `/2s6y` path

## Project Structure

```
2s6y-marketing/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx             # Landing page content (3 responsive layouts)
│   └── globals.css          # DaisyUI theme + Tailwind config
├── components/
│   ├── branding/
│   │   ├── AnimatedLogo.tsx      # WebGL + CSS gradient logo
│   │   ├── CSSGradientLogo.tsx   # CSS fallback gradient
│   │   └── WhatameshGradient.tsx # WebGL gradient wrapper
│   └── shared/
│       └── LoadingScreen.tsx      # First-visit loading animation
├── hooks/
│   └── useLoadingState.ts   # Loading state management
├── public/
│   ├── favicon.svg          # App icon
│   ├── logo.svg             # Main logo
│   └── logo-mask.svg        # Logo mask for gradients
├── next.config.ts           # Next.js config (basePath: '/2s6y')
├── tsconfig.json
├── package.json
└── README.md
```

## Configuration

### basePath

The site is configured with `basePath: '/2s6y'` in `next.config.ts`:

- **Local dev**: `http://localhost:3000/2s6y`
- **Production**: `https://your-domain.com/2s6y`

All internal asset paths automatically get prefixed with `/2s6y`.

### External Links

All CTAs and navigation links point to the main app:

- **Get Started**: `https://2s6y.bykc.pro/sign-up`
- **Sign In**: `https://2s6y.bykc.pro/signin`
- **Logo/Home**: `https://2s6y.bykc.pro`

**To update URLs**: Search for `https://2s6y.bykc.pro` in `app/page.tsx` and replace with new domain.

### Design System

Uses the same DaisyUI Cupcake theme as the main app:

- **Primary**: `#a442fe` (purple)
- **Accent**: `#80e4e4` (cyan)
- **Base**: `#f8f2ed`, `#e8e1dc`, `#dad2cd`
- **Fonts**: Instrument Sans (body), Instrument Serif (headings)

All design tokens are defined in `app/globals.css`.

## Responsive Breakpoints

The landing page has **3 responsive layouts**:

1. **Mobile** (< 768px): Vertical logo + content, full-width CTA
2. **Tablet** (768px - 1023px): Centered logo + content, wider CTA
3. **Desktop** (>= 1024px): Side-by-side logo + content

Test all breakpoints before deploying!

## Performance

- **Static Export**: No server-side rendering needed
- **CSS Fallback**: Logo shows instantly with CSS gradient
- **WebGL Enhancement**: Whatamesh gradient fades in when ready
- **First Visit Loading**: Smooth progress indicator for first-time users
- **Subsequent Visits**: Instant load (no loading screen)

## Environment Variables

**None required!** This is a pure static site with no backend dependencies.

## Troubleshooting

### Images not loading locally

Ensure you're accessing the site at `http://localhost:3000/2s6y` (with basePath).

### Links not working

All links use `<a>` tags (not Next.js `<Link>`) because they navigate to external domain (main app).

### WebGL gradient not showing

The CSS gradient fallback will show. Check browser console for Whatamesh errors. This is expected on older browsers.

### Build fails

Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Maintenance

### Updating Content

Edit `app/page.tsx` to update:
- Headlines
- Body copy
- CTA button text
- Layout/spacing

### Updating Styles

Edit `app/globals.css` to modify:
- Colors (design tokens)
- Typography
- Spacing scale
- Component styles

### Updating Links

Search for `https://2s6y.bykc.pro` in `app/page.tsx` and replace with new domain if app URL changes.

## License

Private project - All rights reserved

## Support

For issues or questions:
- **Main App Repo**: [2Sat-lite](https://github.com/kalyanchandana/2Sat-lite)
- **Email**: (your email)

---

**Last Updated**: 2025-10-31
**Version**: 1.0.0
**Maintained By**: Kalyan Chandana
