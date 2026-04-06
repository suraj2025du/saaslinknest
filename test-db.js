/**
 * Quick Database Connection Test
 */

const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing database connection...\n');

  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '4Fxmi6opzQhfZTf.root',
      password: 'wEqBphspHCxG4xWc',
      database: 'test',
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('✅ Connected to TiDB Cloud successfully!\n');

    // Check tables
    const [tables] = await connection.query(
      "SHOW TABLES"
    );

    console.log(`📊 Found ${tables.length} tables in database:\n`);
    
    tables.forEach((table, i) => {
      const tableName = Object.values(table)[0];
      console.log(`   ${i + 1}. ✅ ${tableName}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE IS WORKING PERFECTLY!');
    console.log('='.repeat(60) + '\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error(error.message);
    console.error('\nCheck your password and try again.');
  }
}

testConnection();
