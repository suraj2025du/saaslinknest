-- =====================================================
-- LinkNest - Manual Database Setup Script
-- =====================================================
-- Run this script in your MySQL database
-- How to run:
--   1. Login to your MySQL (via HeidiSQL, phpMyAdmin, or command line)
--   2. Select the 'linknest' database
--   3. Copy and paste this entire script
--   4. Execute it
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  open_id VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  login_method VARCHAR(50),
  role ENUM('user', 'admin') DEFAULT 'user',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_signed_in TIMESTAMP,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  backup_codes TEXT,
  deleted_at TIMESTAMP
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  username VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar TEXT,
  theme VARCHAR(50),
  background_color VARCHAR(50),
  gradient_color_1 VARCHAR(50),
  gradient_color_2 VARCHAR(50),
  gradient_direction VARCHAR(50),
  button_style VARCHAR(50),
  font_family VARCHAR(50),
  animation_enabled BOOLEAN DEFAULT TRUE,
  custom_domain VARCHAR(255),
  custom_domain_verified BOOLEAN DEFAULT FALSE,
  domain_verification_token VARCHAR(255),
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255),
  url VARCHAR(500),
  description TEXT,
  position INT,
  visible BOOLEAN DEFAULT TRUE,
  type VARCHAR(50) DEFAULT 'link',
  password VARCHAR(255),
  scheduled_at TIMESTAMP,
  scheduled_end_at TIMESTAMP,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan ENUM('free', 'premium', 'lifetime') DEFAULT 'free',
  status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  stripe_subscription_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  link_id INT,
  event_type ENUM('view', 'click'),
  device ENUM('mobile', 'tablet', 'desktop'),
  country VARCHAR(100),
  referrer VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(255),
  user_agent VARCHAR(500),
  ip VARCHAR(50),
  INDEX analytics_user_id_idx (user_id),
  INDEX analytics_timestamp_idx (timestamp),
  INDEX analytics_link_id_idx (link_id)
);

-- Create admin_config table
CREATE TABLE IF NOT EXISTS admin_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE,
  value TEXT,
  type ENUM('string', 'number', 'boolean', 'json'),
  encrypted BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  email VARCHAR(255),
  type VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_id INT,
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  seo_title VARCHAR(255),
  seo_description TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX blog_posts_slug_idx (slug),
  INDEX blog_posts_published_idx (published),
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  UNIQUE INDEX newsletter_email_idx (email)
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX notifications_user_id_idx (user_id),
  INDEX notifications_read_idx (read),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  profile_id INT NOT NULL,
  user_id INT,
  email VARCHAR(255),
  role ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
  status ENUM('pending', 'active', 'revoked') DEFAULT 'pending',
  invite_token VARCHAR(255),
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  INDEX team_members_profile_id_idx (profile_id),
  INDEX team_members_user_id_idx (user_id),
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  count INT DEFAULT 1,
  reset_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX rate_limits_key_idx (`key`),
  INDEX rate_limits_reset_at_idx (reset_at)
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  stripe_invoice_id VARCHAR(255),
  amount INT,
  currency VARCHAR(10) DEFAULT 'usd',
  status VARCHAR(50),
  url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX invoices_user_id_idx (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value INT NOT NULL,
  max_uses INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX coupons_code_idx (code)
);

-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS payment_gateways (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  public_key VARCHAR(500),
  secret_key VARCHAR(500),
  webhook_secret VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX gateways_provider_idx (provider)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  gateway VARCHAR(50),
  payment_id VARCHAR(255),
  amount INT,
  currency VARCHAR(10) DEFAULT 'usd',
  status VARCHAR(50),
  plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX transactions_user_id_idx (user_id),
  INDEX transactions_status_idx (status),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- Verification: Check all tables created
-- =====================================================
SHOW TABLES;
