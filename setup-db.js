// This script creates/updates all database tables automatically
// Run with: node setup-db.js

const { drizzle } = require('drizzle-orm/mysql2');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🔗 Connecting to database...');

  try {
    // Connect to MySQL with SSL (required for TiDB Cloud)
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    console.log('✅ Connected to database!');

    // Create users table
    console.log('\n📋 Creating users table...');
    await connection.query(`
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
      )
    `);
    console.log('✅ Users table created!');

    // Create profiles table
    console.log('\n📋 Creating profiles table...');
    await connection.query(`
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
      )
    `);
    console.log('✅ Profiles table created!');

    // Create links table
    console.log('\n📋 Creating links table...');
    await connection.query(`
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
      )
    `);
    console.log('✅ Links table created!');

    // Create subscriptions table
    console.log('\n📋 Creating subscriptions table...');
    await connection.query(`
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
      )
    `);
    console.log('✅ Subscriptions table created!');

    // Create analytics table
    console.log('\n📋 Creating analytics table...');
    await connection.query(`
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
        ip VARCHAR(50)
      )
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS analytics_user_id_idx ON analytics(user_id)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS analytics_timestamp_idx ON analytics(timestamp)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS analytics_link_id_idx ON analytics(link_id)`);
    console.log('✅ Analytics table created!');

    // Create rate_limits table
    console.log('\n📋 Creating rate_limits table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(255) UNIQUE NOT NULL,
        count INT DEFAULT 1,
        reset_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Rate limits table created!');

    // Create notifications table
    console.log('\n📋 Creating notifications table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        \`read\` BOOLEAN DEFAULT FALSE,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(\`read\`)`);
    console.log('✅ Notifications table created!');

    // Create blog_posts table
    console.log('\n📋 Creating blog_posts table...');
    await connection.query(`
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
        FOREIGN KEY (author_id) REFERENCES users(id)
      )
    `);
    console.log('✅ Blog posts table created!');

    // Create newsletter_subscribers table
    console.log('\n📋 Creating newsletter_subscribers table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed BOOLEAN DEFAULT TRUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP
      )
    `);
    console.log('✅ Newsletter subscribers table created!');

    // Create contact_submissions table
    console.log('\n📋 Creating contact_submissions table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact submissions table created!');

    // Create feedbacks table
    console.log('\n📋 Creating feedbacks table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        email VARCHAR(255),
        type VARCHAR(50),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Feedbacks table created!');

    // Create admin_config table
    console.log('\n📋 Creating admin_config table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admin_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`key\` VARCHAR(255) UNIQUE,
        value TEXT,
        type ENUM('string', 'number', 'boolean', 'json'),
        encrypted BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin config table created!');

    // Create invoices table
    console.log('\n📋 Creating invoices table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        stripe_invoice_id VARCHAR(255),
        amount INT,
        currency VARCHAR(10) DEFAULT 'usd',
        status VARCHAR(50),
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id)`);
    console.log('✅ Invoices table created!');

    // Create coupons table
    console.log('\n📋 Creating coupons table...');
    await connection.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Coupons table created!');

    // Create payment_gateways table
    console.log('\n📋 Creating payment_gateways table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS payment_gateways (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provider VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT FALSE,
        public_key VARCHAR(500),
        secret_key VARCHAR(500),
        webhook_secret VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Payment gateways table created!');

    // Create transactions table
    console.log('\n📋 Creating transactions table...');
    await connection.query(`
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
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON transactions(user_id)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS transactions_status_idx ON transactions(status)`);
    console.log('✅ Transactions table created!');

    // Create team_members table
    console.log('\n📋 Creating team_members table...');
    await connection.query(`
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
        FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await connection.query(`CREATE INDEX IF NOT EXISTS team_members_profile_id_idx ON team_members(profile_id)`);
    await connection.query(`CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id)`);
    console.log('✅ Team members table created!');

    // Show all tables
    console.log('\n\n✅✅✅ ALL TABLES CREATED SUCCESSFULLY! ✅✅✅\n');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📊 Tables in database:');
    console.log(tables);

    await connection.end();
    console.log('\n🎉 Database setup complete! You can now run: npm run dev');

  } catch (error) {
    console.error('\n❌ Error setting up database:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: Make sure MySQL is running and DATABASE_URL in .env.local is correct!');
    }
    if (error.message.includes('ER_ACCESS_DENIED')) {
      console.log('\n💡 Tip: Check your database username and password in DATABASE_URL!');
    }
    process.exit(1);
  }
}

setupDatabase();
