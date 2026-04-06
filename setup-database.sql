-- LinkNest Database Schema for TiDB Cloud
-- Run this in TiDB Cloud SQL Editor: https://tidbcloud.com/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `rate_limits`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `contact_submissions`;
DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `feedbacks`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `analytics`;
DROP TABLE IF EXISTS `links`;
DROP TABLE IF EXISTS `subscriptions`;
DROP TABLE IF EXISTS `profiles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admin_config`;

-- Users table
CREATE TABLE `users` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `open_id` VARCHAR(255),
  `name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `login_method` VARCHAR(50),
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `stripe_customer_id` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_signed_in` TIMESTAMP,
  `reset_token` VARCHAR(255),
  `reset_token_expiry` TIMESTAMP,
  `email_verified` BOOLEAN DEFAULT FALSE,
  `email_verification_token` VARCHAR(255),
  `two_factor_enabled` BOOLEAN DEFAULT FALSE,
  `two_factor_secret` VARCHAR(255),
  `backup_codes` TEXT,
  `deleted_at` TIMESTAMP
);

-- Profiles table
CREATE TABLE `profiles` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `username` VARCHAR(255) UNIQUE,
  `bio` TEXT,
  `avatar` TEXT,
  `theme` VARCHAR(50),
  `background_color` VARCHAR(50),
  `gradient_color_1` VARCHAR(50),
  `gradient_color_2` VARCHAR(50),
  `gradient_direction` VARCHAR(50),
  `button_style` VARCHAR(50),
  `font_family` VARCHAR(50),
  `animation_enabled` BOOLEAN DEFAULT TRUE,
  `custom_domain` VARCHAR(255),
  `custom_domain_verified` BOOLEAN DEFAULT FALSE,
  `domain_verification_token` VARCHAR(255),
  `seo_title` VARCHAR(255),
  `seo_description` TEXT,
  `seo_keywords` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Links table
CREATE TABLE `links` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255),
  `url` VARCHAR(500),
  `description` TEXT,
  `position` INT,
  `visible` BOOLEAN DEFAULT TRUE,
  `type` VARCHAR(50) DEFAULT 'link',
  `password` VARCHAR(255),
  `scheduled_at` TIMESTAMP,
  `scheduled_end_at` TIMESTAMP,
  `clicks` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Subscriptions table
CREATE TABLE `subscriptions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `plan` ENUM('free', 'premium', 'lifetime') DEFAULT 'free',
  `status` ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
  `stripe_subscription_id` VARCHAR(255),
  `stripe_checkout_session_id` VARCHAR(255),
  `current_period_start` TIMESTAMP,
  `current_period_end` TIMESTAMP,
  `cancel_at_period_end` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Analytics table
CREATE TABLE `analytics` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `link_id` BIGINT,
  `event_type` ENUM('view', 'click'),
  `device` ENUM('mobile', 'tablet', 'desktop'),
  `country` VARCHAR(100),
  `referrer` VARCHAR(255),
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `session_id` VARCHAR(255),
  `user_agent` VARCHAR(500),
  `ip` VARCHAR(50),
  INDEX `analytics_user_id_idx` (`user_id`),
  INDEX `analytics_timestamp_idx` (`timestamp`),
  INDEX `analytics_link_id_idx` (`link_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON DELETE CASCADE
);

-- Admin config table
CREATE TABLE `admin_config` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE,
  `value` TEXT,
  `type` ENUM('string', 'number', 'boolean', 'json'),
  `encrypted` BOOLEAN DEFAULT FALSE,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Feedbacks table
CREATE TABLE `feedbacks` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT,
  `email` VARCHAR(255),
  `type` VARCHAR(50),
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Blog posts table
CREATE TABLE `blog_posts` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT,
  `content` TEXT NOT NULL,
  `cover_image` TEXT,
  `author_id` BIGINT,
  `published` BOOLEAN DEFAULT FALSE,
  `published_at` TIMESTAMP,
  `seo_title` VARCHAR(255),
  `seo_description` TEXT,
  `tags` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE INDEX `blog_posts_slug_idx` (`slug`),
  INDEX `blog_posts_published_idx` (`published`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
);

-- Newsletter subscribers table
CREATE TABLE `newsletter_subscribers` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `subscribed` BOOLEAN DEFAULT TRUE,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP,
  UNIQUE INDEX `newsletter_email_idx` (`email`)
);

-- Contact submissions table
CREATE TABLE `contact_submissions` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255),
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE `notifications` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `read` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `notifications_user_id_idx` (`user_id`),
  INDEX `notifications_read_idx` (`read`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Team members table
CREATE TABLE `team_members` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `profile_id` BIGINT NOT NULL,
  `user_id` BIGINT,
  `email` VARCHAR(255),
  `role` ENUM('owner', 'editor', 'viewer') DEFAULT 'viewer',
  `status` ENUM('pending', 'active', 'revoked') DEFAULT 'pending',
  `invite_token` VARCHAR(255),
  `invited_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` TIMESTAMP,
  INDEX `team_members_profile_id_idx` (`profile_id`),
  INDEX `team_members_user_id_idx` (`user_id`),
  FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Rate limits table
CREATE TABLE `rate_limits` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) UNIQUE NOT NULL,
  `count` INT DEFAULT 1,
  `reset_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `rate_limits_key_idx` (`key`),
  INDEX `rate_limits_reset_at_idx` (`reset_at`)
);

-- Invoices table
CREATE TABLE `invoices` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `stripe_invoice_id` VARCHAR(255),
  `amount` INT,
  `currency` VARCHAR(10) DEFAULT 'usd',
  `status` VARCHAR(50),
  `url` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `invoices_user_id_idx` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Coupons table
CREATE TABLE `coupons` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) UNIQUE NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') DEFAULT 'percentage',
  `discount_value` INT NOT NULL,
  `max_uses` INT,
  `used_count` INT DEFAULT 0,
  `valid_from` TIMESTAMP,
  `valid_until` TIMESTAMP,
  `active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE INDEX `coupons_code_idx` (`code`)
);
