import { mysqlTable, serial, varchar, text, boolean, timestamp, int, json, mysqlEnum, datetime, index, uniqueIndex } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  openId: varchar('open_id', { length: 255 }),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  loginMethod: varchar('login_method', { length: 50 }),
  role: mysqlEnum('role', ['user', 'admin']).default('user'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  lastSignedIn: timestamp('last_signed_in'),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: varchar('email_verification_token', { length: 255 }),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  backupCodes: text('backup_codes'), // JSON string of backup codes
  deletedAt: timestamp('deleted_at'), // soft delete
});

export const profiles = mysqlTable('profiles', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  username: varchar('username', { length: 255 }).unique(),
  bio: text('bio'),
  avatar: text('avatar'),
  theme: varchar('theme', { length: 50 }),
  backgroundColor: varchar('background_color', { length: 50 }),
  gradientColor1: varchar('gradient_color_1', { length: 50 }),
  gradientColor2: varchar('gradient_color_2', { length: 50 }),
  gradientDirection: varchar('gradient_direction', { length: 50 }),
  buttonStyle: varchar('button_style', { length: 50 }),
  fontFamily: varchar('font_family', { length: 50 }),
  animationEnabled: boolean('animation_enabled').default(true),
  customDomain: varchar('custom_domain', { length: 255 }),
  customDomainVerified: boolean('custom_domain_verified').default(false),
  domainVerificationToken: varchar('domain_verification_token', { length: 255 }),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const links = mysqlTable('links', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  url: varchar('url', { length: 500 }),
  description: text('description'),
  position: int('position'),
  visible: boolean('visible').default(true),
  type: varchar('type', { length: 50 }).default('link'),
  password: varchar('password', { length: 255 }), // password-protected links
  scheduledAt: timestamp('scheduled_at'), // schedule visibility
  scheduledEndAt: timestamp('scheduled_end_at'), // schedule end
  clicks: int('clicks').default(0), // click counter
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const subscriptions = mysqlTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: mysqlEnum('plan', ['free', 'premium', 'lifetime']).default('free'),
  status: mysqlEnum('status', ['active', 'cancelled', 'expired']).default('active'),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeCheckoutSessionId: varchar('stripe_checkout_session_id', { length: 255 }),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const analytics = mysqlTable('analytics', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  linkId: int('link_id').references(() => links.id, { onDelete: 'cascade' }),
  eventType: mysqlEnum('event_type', ['view', 'click']),
  device: mysqlEnum('device', ['mobile', 'tablet', 'desktop']),
  country: varchar('country', { length: 100 }),
  referrer: varchar('referrer', { length: 255 }),
  timestamp: timestamp('timestamp').defaultNow(),
  sessionId: varchar('session_id', { length: 255 }),
  userAgent: varchar('user_agent', { length: 500 }),
  ip: varchar('ip', { length: 50 }),
}, (table) => ({
  userIdIdx: index('analytics_user_id_idx').on(table.userId),
  timestampIdx: index('analytics_timestamp_idx').on(table.timestamp),
  linkIdIdx: index('analytics_link_id_idx').on(table.linkId),
}));

export const adminConfig = mysqlTable('admin_config', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique(),
  value: text('value'),
  type: mysqlEnum('type', ['string', 'number', 'boolean', 'json']),
  encrypted: boolean('encrypted').default(false),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const feedbacks = mysqlTable('feedbacks', {
  id: serial('id').primaryKey(),
  userId: int('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }),
  type: varchar('type', { length: 50 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Blog posts table
export const blogPosts = mysqlTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  authorId: int('author_id').references(() => users.id),
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  tags: json('tags'), // array of tags
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  slugIdx: uniqueIndex('blog_posts_slug_idx').on(table.slug),
  publishedIdx: index('blog_posts_published_idx').on(table.published),
}));

// Newsletter subscribers table
export const newsletterSubscribers = mysqlTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  subscribed: boolean('subscribed').default(true),
  subscribedAt: timestamp('subscribed_at').defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at'),
}, (table) => ({
  emailIdx: uniqueIndex('newsletter_email_idx').on(table.email),
}));

// Contact form submissions
export const contactSubmissions = mysqlTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications table
export const notifications = mysqlTable('notifications', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info'), // info, warning, success, error
  read: boolean('read').default(false),
  link: varchar('link', { length: 255 }), // optional link to navigate
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  readIdx: index('notifications_read_idx').on(table.read),
}));

// Team members table
export const teamMembers = mysqlTable('team_members', {
  id: serial('id').primaryKey(),
  profileId: int('profile_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  userId: int('user_id').references(() => users.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }), // for invites before signup
  role: mysqlEnum('role', ['owner', 'editor', 'viewer']).default('viewer'),
  status: mysqlEnum('status', ['pending', 'active', 'revoked']).default('pending'),
  inviteToken: varchar('invite_token', { length: 255 }),
  invitedAt: timestamp('invited_at').defaultNow(),
  acceptedAt: timestamp('accepted_at'),
}, (table) => ({
  profileIdIdx: index('team_members_profile_id_idx').on(table.profileId),
  userIdIdx: index('team_members_user_id_idx').on(table.userId),
}));

// Rate limits table (persistent rate limiting)
export const rateLimits = mysqlTable('rate_limits', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  count: int('count').default(1),
  resetAt: timestamp('reset_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  keyIdx: uniqueIndex('rate_limits_key_idx').on(table.key),
  resetAtIdx: index('rate_limits_reset_at_idx').on(table.resetAt),
}));

// Invoices table
export const invoices = mysqlTable('invoices', {
  id: serial('id').primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }),
  amount: int('amount'), // in cents
  currency: varchar('currency', { length: 10 }).default('usd'),
  status: varchar('status', { length: 50 }),
  url: text('url'), // Stripe hosted invoice URL
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('invoices_user_id_idx').on(table.userId),
}));

// Coupon codes table
export const coupons = mysqlTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  discountType: mysqlEnum('discount_type', ['percentage', 'fixed']).default('percentage'),
  discountValue: int('discount_value').notNull(), // percentage or cents
  maxUses: int('max_uses'),
  usedCount: int('used_count').default(0),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  codeIdx: uniqueIndex('coupons_code_idx').on(table.code),
}));

// Payment Gateways table (Stripe/Razorpay keys management)
export const paymentGateways = mysqlTable('payment_gateways', {
  id: serial('id').primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(false),
  publicKey: varchar('public_key', { length: 500 }),
  secretKey: varchar('secret_key', { length: 500 }),
  webhookSecret: varchar('webhook_secret', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  providerIdx: uniqueIndex('gateways_provider_idx').on(table.provider),
}));

// Transactions log table
export const transactions = mysqlTable('transactions', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  gateway: varchar('gateway', { length: 50 }),
  paymentId: varchar('payment_id', { length: 255 }),
  amount: int('amount'),
  currency: varchar('currency', { length: 10 }).default('usd'),
  status: varchar('status', { length: 50 }),
  plan: varchar('plan', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('transactions_user_id_idx').on(table.userId),
  statusIdx: index('transactions_status_idx').on(table.status),
}));

