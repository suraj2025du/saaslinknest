# 🔗 LinkNest - Smart Link-in-Bio Platform

A modern, feature-rich link-in-bio SaaS platform that allows creators, influencers, and businesses to create beautiful, customizable link pages in seconds.

![LinkNest](https://img.shields.io/badge/Version-3.0.0-7C3AED)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.9-black)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6)
![UI](https://img.shields.io/badge/UI-World%20Class-EC4899)

---

## ✨ Features

### 🎨 **NEW: World-Class UI/UX Design**
- **Animated Gradient Backgrounds** - Beautiful flowing gradient animations throughout
- **Glassmorphism Effects** - Frosted glass cards with backdrop-blur
- **3D Hover Animations** - Smooth transforms with scale and perspective
- **Floating Elements** - Animated orbs and decorative shapes
- **Micro-interactions** - Every button, card, and input has delightful feedback
- **Custom Scrollbar** - Gradient scrollbar matching brand colors
- **Stunning Typography** - Gradient text with glow effects
- **Smooth Transitions** - Page transitions with spring physics
- **Parallax Scrolling** - Depth effects on landing page
- **Animated Counters** - Numbers that count up on scroll
- **Mesh Gradients** - Multi-layered gradient backgrounds
- **Premium Components** - Shimmer effects, animated borders, glowing buttons
- **Link Management**: Add, edit, delete, and reorder links with drag-and-drop
- **Profile Customization**: 10+ themes, gradients, fonts, and button styles
- **Real-time Analytics**: Track views, clicks, geography, devices, and referrers
- **QR Code Generation**: Auto-generate QR codes for links and profiles
- **Public Profile Pages**: Dynamic `/{username}` pages with SSR and SEO
- **Responsive Design**: Mobile-first with beautiful animations

### 🔐 Authentication & Security
- **Email/Password Auth**: Secure signup/login with JWT sessions
- **Google OAuth**: One-click Google sign-in
- **Email Verification**: Automatic verification emails on signup
- **Password Reset**: SMTP-based password reset with email templates
- **Password Change**: Users can change passwords from dashboard
- **Account Deletion**: Soft delete with confirmation
- **Rate Limiting**: Persistent rate limiting (database-backed)
- **Security Headers**: XSS, CSRF, clickjacking protection

### 💳 Payments & Billing
- **Stripe Integration**: Full subscription and one-time payment support
- **Plan Management**: Free, Premium ($2.99/mo), Lifetime ($49)
- **Checkout Flow**: Seamless Stripe checkout session creation
- **Billing Portal**: Users manage subscriptions via Stripe billing portal
- **Webhook Handling**: Automatic subscription lifecycle management
- **Invoice Tracking**: Payment success/failure recording
- **Coupon Codes**: Discount code support (schema ready)

### 📊 Analytics & Export
- **View/Click Tracking**: Real-time event tracking with device detection
- **Geographic Analytics**: Country-level breakdown from IP
- **Device Detection**: Mobile, tablet, desktop parsing from user-agent
- **Referrer Tracking**: Know where your traffic comes from
- **CSV Export**: Download analytics data for external analysis
- **Top Links**: See which links perform best

### 📧 Email System
- **SMTP Integration**: Real email delivery via Nodemailer
- **Welcome Emails**: Sent automatically on signup
- **Password Reset Emails**: Secure token-based reset flow
- **Email Verification**: Verify email addresses on signup
- **Subscription Confirmation**: Sent after successful payment
- **Contact Form Confirmation**: Auto-reply to contact submissions
- **Beautiful Templates**: Professional HTML email templates

### 📝 Blog & Content
- **Database-backed CMS**: Create, edit, and publish blog posts
- **Admin Editor**: Full blog post editor with markdown support
- **Tag System**: Categorize posts with tags
- **Search & Filter**: Search posts by title/content, filter by tag
- **SEO Optimization**: Dynamic metadata for blog posts
- **Newsletter Integration**: Collect email subscribers

### 🎨 Admin Panel
- **User Management**: View, search, ban/unban users
- **Revenue Analytics**: Platform-wide MRR, ARR, conversion metrics
- **Feedback Management**: Review and resolve user feedback
- **Platform Settings**: Toggle features, enable/disable maintenance mode
- **Contact Submissions**: View all contact form submissions
- **Role-based Access**: Only admins can access admin panel

### 🗄️ Database & Storage
- **MySQL/TiDB**: Robust relational database with Drizzle ORM
- **Cloudflare R2**: Scalable, cost-effective image storage
- **Avatar Uploads**: Server-side upload with validation
- **File Size Limits**: 5MB max, JPEG/PNG/WebP/GIF only
- **Persistent Rate Limits**: Database-backed rate limiting
- **Indexed Queries**: Optimized analytics performance

### 🔧 Developer Experience
- **TypeScript**: Full type safety across frontend and backend
- **API Routes**: RESTful endpoints for all features
- **Component Architecture**: Modular, reusable React components
- **Drizzle Migrations**: Easy database schema management
- **Environment Config**: Comprehensive `.env.example` template
- **Security Best Practices**: Input validation, encryption, CORS

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and **npm**
- **MySQL or TiDB** database
- **Stripe account** (for payments)
- **Google Cloud project** (for OAuth)
- **SMTP credentials** (for emails)
- **Cloudflare R2 account** (for image storage, optional)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd linknest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Then edit `.env.local` with your credentials:
   - `DATABASE_URL`: MySQL connection string
   - `AUTH_SECRET`: Random secret for JWT (use `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`: From Stripe Dashboard
   - `SMTP_*`: Your SMTP provider credentials
   - `R2_*`: Cloudflare R2 credentials (optional, can skip for now)

4. **Set up the database**:
   ```bash
   # Option 1: Run the SQL migration script manually
   mysql -u user -p linknest < migrations/001_initial_schema.sql

   # Option 2: Use Drizzle Kit (recommended for development)
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. **Create a Stripe customer and products**:
   - Go to Stripe Dashboard → Products
   - Create two products:
     - **Premium Plan**: $2.99/month (recurring)
     - **Lifetime Plan**: $49 (one-time)
   - Note the Price IDs and add them to `.env.local`:
     ```
     STRIPE_PREMIUM_PRICE_ID=price_xxx
     STRIPE_LIFETIME_PRICE_ID=price_xxx
     ```

6. **Set up Google OAuth** (optional):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env.local`

7. **Run the development server**:
   ```bash
   npm run dev
   ```

8. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
linknest/
├── app/                      # Next.js App Router
│   ├── (routes)/            # Public routes (home, features, pricing, etc.)
│   ├── dashboard/           # User dashboard with tabs
│   ├── admin/               # Admin panel
│   ├── [username]/          # Public profile pages
│   ├── blog/                # Blog listing and posts
│   ├── api/                 # API routes (REST endpoints)
│   └── login, signup, etc.  # Auth pages
├── components/              # React components
│   ├── dashboard/           # Dashboard modules (Links, Analytics, etc.)
│   └── public/              # Public components (Navbar, Footer, etc.)
├── lib/                     # Utilities and shared code
│   ├── auth.ts              # JWT auth functions
│   ├── db.ts                # Database connection
│   ├── schema.ts            # Drizzle ORM schema (17 tables)
│   ├── email.ts             # Email templates and sender
│   ├── r2-storage.ts        # Cloudflare R2 upload
│   ├── qr-code.ts           # QR code generation
│   ├── analytics-export.ts  # CSV export
│   ├── device-detect.ts     # User-agent parsing
│   └── rate-limit-persistent.ts
├── migrations/              # Database migrations
├── middleware.ts            # Next.js middleware (auth + security)
├── drizzle.config.ts        # Drizzle Kit configuration
└── .env.example             # Environment variable template
```

---

## 🗄️ Database Schema

The platform uses **17 database tables**:

| Table | Purpose |
|-------|---------|
| `users` | User accounts (email, password, OAuth, role, 2FA) |
| `profiles` | Public profile settings (username, theme, custom domain) |
| `links` | User links (with scheduling, password protection, clicks) |
| `subscriptions` | Billing subscriptions (Free, Premium, Lifetime) |
| `analytics` | View/click tracking (device, country, referrer) |
| `admin_config` | Platform-wide settings |
| `feedbacks` | User bug reports and feedback |
| `blog_posts` | CMS blog posts (with tags, SEO, author) |
| `newsletter_subscribers` | Email list for newsletter |
| `contact_submissions` | Contact form submissions |
| `notifications` | In-app user notifications |
| `team_members` | Team collaboration (invites, roles) |
| `rate_limits` | Persistent rate limiting |
| `invoices` | Stripe invoice records |
| `coupons` | Discount coupon codes |

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email` - Verify email address
- `GET /api/auth/google/url` - Get Google OAuth URL
- `GET /api/auth/google/callback` - Google OAuth callback

### Links
- `GET /api/links` - Get user's links
- `POST /api/links` - Create new link
- `PATCH /api/links/[id]` - Update link
- `DELETE /api/links/[id]` - Delete link
- `POST /api/links/reorder` - Reorder links (drag-and-drop)

### Profile
- `POST /api/profile` - Create/update profile
- `POST /api/profile/appearance` - Update profile theme/appearance
- `GET /api/public/profile/[username]` - Get public profile data

### Analytics
- `GET /api/analytics` - Get user analytics (with filters)
- `POST /api/analytics/track` - Track view/click events
- `GET /api/analytics/export` - Export analytics as CSV

### Payments
- `POST /api/subscriptions/checkout` - Create Stripe checkout session
- `POST /api/subscriptions/billing-portal` - Get Stripe billing portal URL
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `PATCH /api/admin/users` - Update user (ban, change role)
- `DELETE /api/admin/users` - Delete user
- `GET /api/admin/revenue` - Get revenue metrics
- `GET /api/admin/config` - Get platform settings
- `PATCH /api/admin/config` - Update platform settings
- `GET /api/admin/feedback` - Get user feedback
- `PATCH /api/admin/feedback` - Update feedback status

### Blog & Content
- `GET /api/blog` - Get blog posts (public)
- `POST /api/blog` - Create blog post (admin only)
- `PATCH /api/blog` - Update blog post (admin only)
- `DELETE /api/blog` - Delete blog post (admin only)

### Utilities
- `POST /api/qr-code` - Generate QR code
- `POST /api/upload` - Upload file to Cloudflare R2
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/notifications` - Get/mark notifications
- `POST /api/account/delete` - Delete user account
- `POST /api/feedback` - Submit bug report/feedback

---

## 🚀 Deployment

### Deploy to Railway

1. **Connect your repository** to Railway
2. **Add environment variables** in Railway dashboard
3. **Provision a MySQL database** via Railway marketplace
4. **Run migrations**:
   ```bash
   npx drizzle-kit migrate
   ```
5. **Deploy!** Railway handles the rest.

### Custom Domain Setup

1. Add your domain in Railway/your hosting provider
2. Configure DNS records (A record or CNAME)
3. Add domain to `.env.local`: `APP_URL=https://yourdomain.com`
4. Enable SSL/HTTPS (automatic on most platforms)

---

## 📋 Pre-Launch Checklist

- [ ] Set up production database
- [ ] Configure SMTP for production emails
- [ ] Set up Stripe live mode (not test mode)
- [ ] Configure Google OAuth for production
- [ ] Add Cloudflare R2 for image storage
- [ ] Run database migrations
- [ ] Create first admin user
- [ ] Test full user journey (signup → add links → share → analytics)
- [ ] Test Stripe checkout flow (use test mode first)
- [ ] Test password reset flow
- [ ] Test email verification flow
- [ ] Submit sitemap to Google Search Console
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Review privacy policy and terms of service
- [ ] Add cookie consent banner (for GDPR)
- [ ] Test on mobile devices
- [ ] Load test with expected traffic

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Clean Next.js cache
npm run clean

# Generate Drizzle migrations
npx drizzle-kit generate

# Run database migrations
npx drizzle-kit migrate

# Push schema changes (development only)
npx drizzle-kit push
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Email**: support@linknest.com (if configured)

---

## 🎯 Roadmap

### Phase 2 (Next Release)
- [ ] AI-generated bio suggestions (Gemini integration)
- [ ] Link scheduling UI (schema ready)
- [ ] Password-protected links UI (schema ready)
- [ ] Custom domain verification flow
- [ ] Team collaboration features
- [ ] 2FA authentication

### Phase 3 (Future)
- [ ] Mobile app (iOS/Android)
- [ ] A/B testing for links
- [ ] Advanced automation workflows
- [ ] Multi-language support
- [ ] Theme marketplace
- [ ] API for third-party integrations

---

**Built with ❤️ by the LinkNest Team**
