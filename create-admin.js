/**
 * Create Default Admin Account
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  console.log('🔧 Creating default admin account...\n');

  let connection;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    console.log(`✅ Password hashed (bcrypt cost: 10)`);

    // Connect to database
    connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '4Fxmi6opzQhfZTf.root',
      password: 'wEqBphspHCxG4xWc',
      database: 'test',
      ssl: { rejectUnauthorized: false },
    });

    console.log('✅ Connected to TiDB Cloud\n');

    // Check if user already exists
    const [existing] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      ['admin@linknest.com']
    );

    if (existing.length > 0) {
      console.log('⚠️  User already exists!');
      console.log(`   Email: ${existing[0].email}`);
      console.log(`   Role:  ${existing[0].role}`);
      
      // Update to admin role if not already
      if (existing[0].role !== 'admin') {
        await connection.execute(
          'UPDATE users SET role = "admin" WHERE email = ?',
          ['admin@linknest.com']
        );
        console.log('✅ Updated role to ADMIN\n');
      } else {
        console.log('✅ Role is already ADMIN\n');
      }

      console.log('🔑 You can now login with:');
      console.log('   Email:    admin@linknest.com');
      console.log('   Password: Admin@123\n');
    } else {
      // Create new admin user
      await connection.execute(
        `INSERT INTO users (email, password, name, role, email_verified, created_at, updated_at) 
         VALUES (?, ?, ?, 'admin', TRUE, NOW(), NOW())`,
        ['admin@linknest.com', hashedPassword, 'LinkNest Admin']
      );

      console.log('✅ Admin account created successfully!\n');
      console.log('🔑 Login Credentials:');
      console.log('   Email:    admin@linknest.com');
      console.log('   Password: Admin@123\n');
    }

    // Create profile for the admin
    const [user] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@linknest.com']
    );

    if (user.length > 0) {
      const userId = user[0].id;
      
      const [profile] = await connection.execute(
        'SELECT id FROM profiles WHERE user_id = ?',
        [userId]
      );

      if (profile.length === 0) {
        await connection.execute(
          `INSERT INTO profiles (user_id, username, bio, theme, background_color, button_style, font_family, animation_enabled, created_at, updated_at) 
           VALUES (?, 'admin', 'LinkNest Administrator', 'midnight', '#0B0F1A', 'solid', 'Inter', TRUE, NOW(), NOW())`,
          [userId]
        );
        console.log('✅ Admin profile created\n');
      } else {
        console.log('✅ Admin profile already exists\n');
      }
    }

    console.log('=' .repeat(50));
    console.log('🎉 ADMIN ACCOUNT READY!');
    console.log('=' .repeat(50));
    console.log('\n🌐 Go to: http://localhost:3000/admin');
    console.log('📧 Email:    admin@linknest.com');
    console.log('🔑 Password: Admin@123\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createAdmin();
