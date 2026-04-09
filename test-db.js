const mysql = require('mysql2/promise');

async function test() {
  const uri = 'mysql://4Fxmi6opzQhfZTf.root:v9cX10X2B7g1oEZs@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/fortune500?ssl={"rejectUnauthorized":true}';
  
  try {
    const pool = mysql.createPool({
      uri: uri,
      ssl: { rejectUnauthorized: false }
    });
    const conn = await pool.getConnection();
    console.log("SUCCESS!");
    conn.release();
  } catch(e) {
    console.error("ERROR:", e);
  }
}
test();
