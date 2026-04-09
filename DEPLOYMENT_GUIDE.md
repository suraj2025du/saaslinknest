# 🚀 LinkNest Deployment Guide for linknest.tech

## ✅ Pre-Deployment Checklist

### 1. **Environment Variables Setup**
Update `.env.local` with your production values:

```bash
# Required
APP_URL=https://linknest.tech
NEXT_PUBLIC_APP_URL=https://linknest.tech
DATABASE_URL=mysql://your-db-connection-string
AUTH_SECRET=<generate with: openssl rand -base64 32>

# Optional (Recommended)
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 2. **Generate AUTH_SECRET**
```bash
openssl rand -base64 32
```

### 3. **Create OpenGraph Image**
Create `/public/og-image.png` (1200x630px) for social media sharing

---

## 🌐 Deploy to Vercel (Recommended)

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit - LinkNest setup for linknest.tech"
git branch -M main
git remote add origin https://github.com/yourusername/linknest.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `next build`
   - **Output Directory:** .next

### Step 3: Add Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add all variables from `.env.local`

### Step 4: Deploy

Click **"Deploy"** and wait for build to complete (~2-3 minutes)

---

## 🔗 Connect Your Domain (linknest.tech)

### Option A: Vercel Nameservers (Easiest)

1. In Vercel, go to **Settings → Domains**
2. Add `linknest.tech`
3. Vercel will provide nameservers
4. Go to your domain registrar (GoDaddy/Namecheap)
5. Update nameservers to Vercel's nameservers
6. Wait 24-48 hours for DNS propagation

### Option B: DNS Records (Advanced)

Add these records at your domain registrar:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🔍 SEO Setup (100% Optimized)

### ✅ What's Already Configured:

1. **Metadata & Tags**
   - ✅ Title tags optimized for "LinkNest"
   - ✅ Meta descriptions with keywords
   - ✅ 17+ SEO keywords added
   - ✅ Open Graph tags for social sharing
   - ✅ Twitter Card meta tags
   - ✅ Canonical URLs
   - ✅ Robots meta configuration

2. **Technical SEO**
   - ✅ `sitemap.xml` - Auto-generated
   - ✅ `robots.txt` - Auto-generated
   - ✅ JSON-LD structured data (Organization + Website)
   - ✅ Security headers (HSTS, X-Frame-Options, etc.)
   - ✅ WWW to non-WWW redirect
   - ✅ Mobile-responsive design

3. **Performance**
   - ✅ Next.js 15 with App Router
   - ✅ Automatic code splitting
   - ✅ Image optimization
   - ✅ Font optimization

### 📋 Post-Deployment SEO Tasks:

1. **Google Search Console**
   ```
   1. Go to https://search.google.com/search-console
   2. Add property: https://linknest.tech
   3. Verify ownership (add meta tag to layout.tsx)
   4. Submit sitemap: https://linknest.tech/sitemap.xml
   ```

2. **Google Analytics**
   ```
   1. Create account at https://analytics.google.com
   2. Get tracking ID
   3. Add to your AnalyticsTracker component
   ```

3. **Bing Webmaster Tools**
   ```
   1. Go to https://www.bing.com/webmasters
   2. Add https://linknest.tech
   3. Submit sitemap
   ```

4. **Social Media Profiles**
   - Update `components/public/JsonLd.tsx` with your actual social media URLs
   - Add Twitter handle to metadata in `layout.tsx`

---

## 🧪 Testing Checklist

### Before Going Live:

```bash
# 1. Build locally
npm run build

# 2. Check for errors
npm run lint

# 3. Test production build
npm run start
```

### After Deployment:

1. ✅ Visit https://linknest.tech
2. ✅ Test all pages load correctly
3. ✅ Check mobile responsiveness
4. ✅ Test signup/login functionality
5. ✅ Verify SSL certificate (https://)
6. ✅ Test on multiple browsers
7. ✅ Check PageSpeed: https://pagespeed.web.dev/report?url=https://linknest.tech

---

## 📊 Performance Optimization

### Already Included:
- ✅ Standalone output mode (faster deployments)
- ✅ Image optimization with Next.js Image
- ✅ Font optimization with next/font
- ✅ Automatic static optimization
- ✅ Code splitting

### Additional Recommendations:
1. Enable Vercel Edge Network (automatic)
2. Use Vercel Analytics for monitoring
3. Enable Sentry for error tracking
4. Add CDN caching headers

---

## 🔒 Security Checklist

- ✅ HTTPS enabled (automatic on Vercel)
- ✅ Security headers configured
- ✅ Environment variables secured
- ✅ AUTH_SECRET generated securely
- ✅ CORS policy configured
- ✅ XSS protection headers

---

## 📱 Social Media Setup

### Update these files before launch:

1. **Twitter Handle** - `app/layout.tsx`
   ```typescript
   site: '@yourtwitterhandle',
   creator: '@yourtwitterhandle',
   ```

2. **Social Links** - `components/public/JsonLd.tsx`
   ```typescript
   sameAs: [
     'https://twitter.com/yourhandle',
     'https://www.instagram.com/yourhandle',
     // Add actual profiles
   ]
   ```

3. **Contact Email** - `components/public/JsonLd.tsx`
   ```typescript
   email: 'support@linknest.tech',
   ```

---

## 🎯 Going Live Checklist

- [ ] Environment variables configured
- [ ] Domain connected to Vercel
- [ ] SSL certificate active
- [ ] All pages tested
- [ ] Forms working
- [ ] Database connected
- [ ] Google Search Console verified
- [ ] Google Analytics added
- [ ] Sitemap submitted
- [ ] Social media profiles updated
- [ ] OG image created (`/public/og-image.png`)
- [ ] Favicon added
- [ ] 404 page tested
- [ ] Mobile tested
- [ ] PageSpeed score checked

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check TypeScript errors
npm run build

# Ignore build errors temporarily
# Set in next.config.ts: ignoreBuildErrors: true
```

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Check DNS: https://dnschecker.org
- Clear browser cache

### Images Not Loading
- Ensure R2/cloud storage is configured
- Check image URLs in database
- Verify CORS settings

---

## 📞 Support

- **Email:** support@linknest.tech
- **Docs:** https://linknest.tech/docs
- **Status:** https://linknest.tech/status

---

**Your LinkNest platform is now live at https://linknest.tech! 🎉**
