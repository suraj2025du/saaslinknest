# 🚀 LinkNest Quick Start Guide

## Pre-Deployment Setup

### 1. Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL=mysql://username:password@hostname:3306/database_name

# Authentication
AUTH_SECRET=your-random-jwt-secret-key-here

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PREMIUM_PRICE_ID=price_premium_id
STRIPE_LIFETIME_PRICE_ID=price_lifetime_id

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# AI (Google Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Application
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_EMAIL=support@linknest.com

# Optional
ADMIN_EMAIL=admin@linknest.com
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Run database migrations
npx drizzle-kit push
```

### 3. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 4. Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Feature Quick Reference

### 🔐 Two-Factor Authentication (2FA)
- Users can enable 2FA from Dashboard → Settings → Security
- Requires scanning QR code with authenticator app
- Backup codes provided during setup
- Login requires 6-digit code after password

### 💰 Coupon Management
- Admin Panel → Coupons tab
- Create coupons with codes, discounts, usage limits
- Users enter coupon codes at checkout
- Automatic discount application via Stripe

### 🔔 Notifications
- Bell icon in dashboard header
- Click to view recent notifications
- Mark individual or all as read
- Color-coded: blue (info), yellow (warning), green (success), red (error)

### 📅 Link Scheduling
- Add start/end dates when creating links
- Links automatically show/hide based on schedule
- Visual badges: Scheduled (amber), Active (green), Expired (gray)

### 🔒 Password-Protected Links
- Click lock icon on any link to set password
- Minimum 4 characters required
- Public visitors must enter password to access
- Session-based unlock caching

### 🌐 Custom Domain Verification
- Settings → Custom Domain section
- Enter your domain
- Add TXT record to DNS: `_linknest.yourdomain.com`
- Click "Verify" to confirm ownership

### 🤖 AI Features
- **Bio Generation:** Settings → Bio field → "AI Generate" button
- **Link Suggestions:** Links tab → "AI Suggest Links" button
- Requires `GEMINI_API_KEY` environment variable

### 👥 Team Collaboration
- Dashboard → Team tab
- Invite members via email
- Assign roles: Editor (can edit) or Viewer (read-only)
- Owners have full control
- Team members can access shared profile

### 📊 Milestone Emails
- Automatically sent at: 100, 500, 1K, 5K, 10K, 50K views
- No setup required - automatic after view tracking
- Celebrates user achievements with branded emails

### 🎨 Link Types
When adding links, choose type:
- **Link:** Standard URL button
- **Image:** Display image with optional link
- **Video:** Embed YouTube/Vimeo videos
- **Text:** Styled text block (for descriptions/announcements)

### 📝 Blog Management
- Admin Panel → Blog Editor tab
- Create/edit posts with markdown support
- SEO fields, tags, cover images
- Publish/Draft toggle
- Search and filter functionality

### 🍪 Cookie Consent
- Banner shows automatically on first visit
- Users can Accept or Decline
- Analytics tracking respects consent choice
- Persists across sessions

### 📧 Contact & Bug Reports
- Contact page: `/contact`
- Bug report: Bug icon in dashboard
- Supports screenshots (5MB max)
- Admin receives email notifications

---

## Testing Checklist

### Authentication
```
□ Signup with email/password
□ Email verification
□ Login with credentials
□ Enable 2FA
□ Login with 2FA
□ Password reset
□ Google OAuth login
```

### Links
```
□ Create link (all types: link, image, video, text)
□ Edit link
□ Delete link
□ Set schedule
□ Add password protection
□ Drag-and-drop reorder
□ View on public profile
```

### Profile
```
□ Change theme
□ Customize colors
□ Change fonts
□ AI-generate bio
□ Set custom domain
□ Verify custom domain
```

### Analytics
```
□ View dashboard
□ Check device breakdown
□ View country data
□ See top links
□ Filter by date range
□ Export to CSV
```

### Payments
```
□ Create coupon (admin)
□ Apply coupon at checkout
□ Subscribe to premium
□ View billing history
□ Payment failure email received
```

### Team
```
□ Invite team member
□ Accept invite
□ Edit role
□ Remove member
□ Team member can edit profile
```

### Notifications
```
□ Bell icon shows unread count
□ Dropdown displays notifications
□ Mark as read works
□ Click navigates to link
```

### Blog
```
□ Create post (admin)
□ Edit post
□ Publish/Draft toggle
□ View on public blog page
```

---

## Common Issues & Solutions

### Issue: Database connection error
**Solution:** Ensure `DATABASE_URL` is correctly formatted:
```
mysql://user:password@host:port/database
```

### Issue: Stripe webhook not working
**Solution:** 
1. Set up webhook in Stripe Dashboard
2. Point to: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### Issue: Emails not sending
**Solution:** 
1. Verify SMTP credentials
2. For Gmail, use App Passwords (not account password)
3. Enable "Less secure app access" or use OAuth2

### Issue: AI features not working
**Solution:**
1. Get API key from https://aistudio.google.com
2. Set `GEMINI_API_KEY` in environment
3. Check for API quota limits

### Issue: Custom domain not verifying
**Solution:**
1. Ensure TXT record is added correctly
2. DNS propagation can take up to 48 hours
3. Check record with: `nslookup -type=TXT _linknest.yourdomain.com`

### Issue: Build fails
**Solution:**
```bash
# Clear build cache
rm -rf .next
npm run build
```

---

## Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
- **Netlify:** Similar setup
- **AWS/GCP:** Manual deployment
- **Railway:** Auto-detects Next.js
- **Render:** Easy deployment

---

## Post-Launch Monitoring

### Essential Monitoring:
1. **Error Tracking:** Set up Sentry
2. **Analytics:** Monitor view counts
3. **Payments:** Check Stripe dashboard
4. **Emails:** Monitor delivery rates
5. **Database:** Watch connection pool

### Performance Metrics:
- Page load time: < 2 seconds
- API response time: < 200ms
- Database queries: < 100ms
- Uptime: 99.9%

---

## Support Resources

### Documentation:
- `COMPLETE_IMPLEMENTATION_REPORT.md` - Full feature list
- `FINAL_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `README.md` - Project overview

### API Endpoints:
All documented in code comments and route files.

### Database Schema:
See `lib/schema.ts` for complete schema documentation.

---

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server
npm run lint             # Run linter
npm run clean            # Clean build cache

# Database
npx drizzle-kit push     # Run migrations
npx drizzle-kit studio   # Open database GUI

# Build
npm run build            # Compile for production
```

---

**You're all set! Deploy with confidence!** 🚀

For detailed feature documentation, see `COMPLETE_IMPLEMENTATION_REPORT.md`
