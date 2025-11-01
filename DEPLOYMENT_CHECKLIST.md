# 2s6y Marketing Site - Deployment Checklist

Quick reference checklist for deploying the 2s6y marketing site to production.

---

## Pre-Deployment Checklist

- [ ] **Code Review**
  - [ ] All marketing copy is final
  - [ ] All CTAs link to correct URLs (`https://2s6y.bykc.pro/*`)
  - [ ] Assets (logo, favicon) are optimized
  - [ ] Responsive design tested on all breakpoints

- [ ] **Local Testing**
  ```bash
  npm run dev
  # Open: http://localhost:3000/2s6y
  ```
  - [ ] Page loads without errors
  - [ ] Logo animation works
  - [ ] All buttons functional
  - [ ] No console errors

- [ ] **Build Testing**
  ```bash
  npm run build
  ```
  - [ ] Build completes successfully
  - [ ] No TypeScript errors
  - [ ] No ESLint warnings (except font warning - safe to ignore)
  - [ ] Output directory `out/` created

---

## GitHub Setup

- [ ] **Create Repository**
  ```bash
  git init
  git add .
  git commit -m "Initial commit: 2s6y marketing site"
  ```

- [ ] **Push to GitHub**
  - [ ] Create new repo on GitHub: `2s6y-marketing`
  - [ ] Push code to main branch
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/2s6y-marketing.git
  git branch -M main
  git push -u origin main
  ```

---

## Vercel Deployment

### Step 1: Import Project

- [ ] Go to https://vercel.com/new
- [ ] Click "Import Project"
- [ ] Select `2s6y-marketing` repository
- [ ] Click "Import"

### Step 2: Configure Project

- [ ] **Project Name**: `2s6y-marketing`
- [ ] **Framework**: Next.js (auto-detected)
- [ ] **Root Directory**: `./` (default)
- [ ] **Build Command**: `npm run build` (default)
- [ ] **Output Directory**: `out` (auto-detected)
- [ ] **Environment Variables**: None needed ✅

### Step 3: Deploy

- [ ] Click "Deploy"
- [ ] Wait 1-2 minutes for build
- [ ] Verify deployment success

### Step 4: Test Preview URL

- [ ] Open `https://2s6y-marketing.vercel.app/2s6y`
- [ ] Verify page loads correctly
- [ ] Test all CTAs (should link to `2s6y.bykc.pro`)
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Verify no console errors

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

- [ ] Go to Vercel project → Settings → Domains
- [ ] Enter: `bykc.pro`
- [ ] Click "Add"
- [ ] Note DNS instructions provided by Vercel

### Step 2: Configure DNS

In your DNS provider (where `bykc.pro` is registered):

**Option A: CNAME (Recommended)**
- [ ] Type: `CNAME`
- [ ] Name: `@` (or leave blank)
- [ ] Value: `cname.vercel-dns.com`
- [ ] TTL: `3600` (or default)

**Option B: A Record**
- [ ] Type: `A`
- [ ] Name: `@` (or leave blank)
- [ ] Value: `76.76.21.21`
- [ ] TTL: `3600`

### Step 3: Wait for DNS Propagation

- [ ] Wait 5-60 minutes
- [ ] Check DNS: https://dnschecker.org
- [ ] Verify Vercel shows "Valid" status
- [ ] SSL certificate auto-provisioned

---

## Production Verification

### Functional Testing

- [ ] **Access Production URL**
  - [ ] `https://bykc.pro/2s6y` loads successfully
  - [ ] SSL certificate valid (green lock icon)
  - [ ] No browser warnings

- [ ] **Mobile (< 768px)**
  - [ ] Layout looks correct
  - [ ] Logo renders properly
  - [ ] Buttons are clickable
  - [ ] Text is readable

- [ ] **Tablet (768px - 1023px)**
  - [ ] Layout looks correct
  - [ ] Logo centered
  - [ ] Content spacing good

- [ ] **Desktop (>= 1024px)**
  - [ ] Split layout (content left, logo right)
  - [ ] Logo fully visible
  - [ ] No overflow issues

### Link Testing

- [ ] **"Get Started" button** → `https://2s6y.bykc.pro/sign-up`
- [ ] **"Sign In" button** → `https://2s6y.bykc.pro/signin`
- [ ] **"Go to App" button** (if signed in) → `https://2s6y.bykc.pro/dashboard`
- [ ] **Logo click** → Stays on marketing page or goes to app

### Performance Testing

- [ ] **Load Time** < 2 seconds
- [ ] **First Contentful Paint** < 1 second
- [ ] **No JavaScript errors** in console
- [ ] **No network errors** in DevTools

### SEO/Metadata

- [ ] Page title shows: "2s6y Marketing"
- [ ] Favicon loads correctly
- [ ] Open Graph tags present (if added)
- [ ] No broken links

---

## Post-Deployment

### Monitor

- [ ] Check Vercel analytics (if enabled)
- [ ] Monitor error logs (if any)
- [ ] Test from different devices/browsers

### Documentation

- [ ] Update README with production URL
- [ ] Document any deployment issues encountered
- [ ] Share production URL with team

### Optional Enhancements

- [ ] Set up custom analytics (Google Analytics, Plausible, etc.)
- [ ] Add error tracking (Sentry)
- [ ] Configure custom fonts (if needed)
- [ ] Add social media meta tags
- [ ] Set up staging environment (preview branch)

---

## Rollback Procedure

If something goes wrong:

1. **Vercel Dashboard** → Project → Deployments
2. **Find previous working deployment**
3. **Click "Promote to Production"**
4. **Verify rollback successful**

Or:

```bash
# Revert git commit locally
git revert HEAD
git push origin main

# Vercel will auto-deploy the reverted code
```

---

## Common Issues

### "404 Not Found" at `/2s6y`

**Cause**: basePath not configured correctly

**Fix**:
1. Check `next.config.ts` has `basePath: '/2s6y'`
2. Verify `output: "export"` is set
3. Rebuild and redeploy

### Assets Not Loading

**Cause**: Asset paths incorrect

**Fix**:
1. Use Next.js `<Image>` component (auto-prefixes basePath)
2. For public assets: Use `/filename.svg` (Next.js adds basePath)
3. Clear browser cache

### DNS Not Resolving

**Cause**: DNS records incorrect or not propagated

**Fix**:
1. Verify DNS records in your DNS provider
2. Use `dig bykc.pro` to check resolution
3. Wait up to 48 hours (usually 5-60 minutes)
4. Contact DNS provider support

### Build Fails on Vercel

**Cause**: Dependencies missing or build errors

**Fix**:
1. Check Vercel build logs
2. Ensure `package.json` has all dependencies
3. Run `npm run build` locally to debug
4. Check Node.js version compatibility

---

## Quick Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run start

# Check for issues
npm run lint

# View Vercel deployments
vercel ls

# Check Vercel logs
vercel logs
```

---

## Contact & Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Project Repository**: https://github.com/YOUR_USERNAME/2s6y-marketing

---

**Last Updated**: 2025-10-31
**Next Review**: Before each major deployment
