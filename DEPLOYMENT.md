# Deployment Guide - 2s6y Marketing Site

This document explains how to deploy the 2s6y marketing site to production.

## Understanding basePath

The site is configured with `basePath: '/2s6y'` in `next.config.ts`. This means:

- **Local Dev**: Access at `http://localhost:3000/2s6y`
- **Production**: Will be at `https://your-domain.com/2s6y`
- **All internal links/assets**: Automatically prefixed with `/2s6y`

## Build Output

When you run `npm run build`, Next.js creates a static export in the `out/` directory:

```
out/
├── _next/          # JS/CSS bundles
├── index.html      # Landing page
├── 404.html        # Error page
├── favicon.svg     # Icons
├── logo.svg
└── logo-mask.svg
```

**Important**: The basePath `/2s6y` is handled at runtime by Next.js. The build output doesn't create a `/2s6y` subdirectory.

## Option 1: Deploy to Vercel (Recommended)

Vercel automatically handles the basePath configuration.

### Steps:

1. **Initialize Git repo**:
   ```bash
   cd /Users/kalyanchandana/Documents/GitHub/2s6y-marketing
   git init
   git add .
   git commit -m "Initial commit: 2s6y marketing site"
   ```

2. **Create GitHub repo**:
   - Go to https://github.com/new
   - Name: `2s6y-marketing`
   - Visibility: Public or Private
   - Don't initialize with README (already exists)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/2s6y-marketing.git
   git push -u origin main
   ```

4. **Deploy on Vercel**:
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `2s6y-marketing`
   - Vercel auto-detects Next.js config
   - Click "Deploy"

5. **Access your site**:
   - Vercel URL: `https://2s6y-marketing.vercel.app/2s6y`
   - Custom domain: Configure in Vercel settings

### Custom Domain on Vercel

To use `https://bykc.pro/2s6y`:

1. Go to Vercel project settings → Domains
2. Add domain: `bykc.pro`
3. Follow DNS configuration steps
4. Site will be available at: `https://bykc.pro/2s6y`

## Option 2: Deploy to Custom Server

If hosting on your own server (e.g., Apache, Nginx):

### Steps:

1. **Build the site**:
   ```bash
   npm run build
   ```

2. **Upload files**:
   - Upload entire `out/` directory to your web server
   - Place contents in document root (e.g., `/var/www/html/`)

3. **Configure web server**:

   **For Nginx**:
   ```nginx
   server {
       listen 80;
       server_name bykc.pro;
       root /var/www/html;

       # Serve 2s6y marketing site
       location /2s6y {
           try_files $uri $uri/ /2s6y/index.html;
       }

       # Main app (if on same domain)
       location / {
           proxy_pass http://localhost:3001;  # Main app server
       }
   }
   ```

   **For Apache** (`.htaccess`):
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /2s6y/
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /2s6y/index.html [L]
   </IfModule>
   ```

4. **Verify deployment**:
   - Visit: `https://bykc.pro/2s6y`
   - Test all links to main app work

## Option 3: Deploy to GitHub Pages

GitHub Pages can host static sites for free.

### Steps:

1. **Update basePath** (if needed):
   - If deploying to `https://username.github.io/2s6y-marketing/`
   - Change `basePath: '/2s6y-marketing'` in `next.config.ts`

2. **Build and deploy**:
   ```bash
   npm run build
   git add out
   git commit -m "Add build output"
   git subtree push --prefix out origin gh-pages
   ```

3. **Enable GitHub Pages**:
   - Go to repo settings → Pages
   - Source: `gh-pages` branch
   - Click Save

4. **Access site**:
   - `https://username.github.io/2s6y-marketing/`

## Option 4: Deploy to Netlify

Similar to Vercel:

1. Push code to GitHub (same as Option 1)
2. Go to https://app.netlify.com/start
3. Import `2s6y-marketing` repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Click "Deploy site"
6. Access at: `https://your-site.netlify.app/2s6y`

## Updating the Site

### Content Changes

1. Edit `app/page.tsx` (headlines, copy, etc.)
2. Test locally: `npm run dev`
3. Commit changes: `git commit -am "Update landing page copy"`
4. Push to GitHub: `git push`
5. Vercel/Netlify auto-deploys

### Link Updates

If the main app URL changes:

1. Search and replace in `app/page.tsx`:
   - Find: `https://2s6y.bykc.pro`
   - Replace: `https://new-domain.com`
2. Test all links work
3. Commit and deploy

## Testing Before Deployment

### Local Testing

```bash
npm run dev
```

Open `http://localhost:3000/2s6y` and verify:
- [ ] All 3 responsive layouts work (mobile, tablet, desktop)
- [ ] Logo animations load properly
- [ ] All CTAs link to correct URLs
- [ ] Loading screen shows on first visit
- [ ] No console errors

### Production Build Testing

```bash
npm run build
npx serve out
```

Open `http://localhost:3000/2s6y` and verify same checklist.

## Troubleshooting

### Issue: 404 on deployment

**Cause**: Web server not configured for SPA routing

**Fix**: Add rewrite rules (see Option 2 above)

### Issue: Assets not loading (404 on `/2s6y/_next/...`)

**Cause**: basePath not correctly configured

**Fix**: Ensure `basePath: '/2s6y'` is in `next.config.ts`

### Issue: Links to main app not working

**Cause**: Main app domain changed

**Fix**: Update all URLs in `app/page.tsx` (search for `https://2s6y.bykc.pro`)

### Issue: ESLint warning about custom fonts

**Warning**: "Custom fonts not added in `pages/_document.js`"

**Fix**: Ignore this warning - we're using App Router (`app/layout.tsx`), not Pages Router. The fonts are correctly configured.

## Monitoring

### Performance

- **First Load JS**: ~108 kB (very good for a Next.js site)
- **Route Size**: ~8 kB (landing page HTML)
- **Static Export**: No server needed, CDN-cacheable

### Analytics (Optional)

Add Vercel Analytics or Google Analytics:

**Vercel Analytics**:
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Rollback

If deployment fails:

### Vercel/Netlify
- Go to Deployments tab
- Click "..." on previous successful deployment
- Click "Promote to Production"

### Custom Server
- Keep backup of previous `out/` directory
- Replace with backup files
- Restart web server

## Security

- **No environment variables**: Site is 100% static
- **No API keys**: Pure frontend, no backend calls
- **CSP Headers** (optional): Add in Vercel/Netlify settings

## Support

If deployment issues occur:
- Check build logs in Vercel/Netlify dashboard
- Verify DNS settings if using custom domain
- Test with `npx serve out` locally first

---

**Last Updated**: 2025-10-31
