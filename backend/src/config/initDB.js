const mysql = require('mysql2/promise');
const pool = require('./db');

const useSSL = process.env.DB_SSL === 'true' || !!process.env.TIDB_HOST;

const initDB = async () => {
  try {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || process.env.TIDB_HOST,
        user: process.env.DB_USER || process.env.TIDB_USER,
        password: process.env.DB_PASSWORD || process.env.TIDB_PASSWORD,
        port: process.env.DB_PORT || process.env.TIDB_PORT || 3306,
        ...(useSSL ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || process.env.TIDB_DATABASE}\``);
      await connection.end();
    } catch (dbCreateError) {
      // Some managed MySQL providers (e.g. TiDB Cloud Serverless) provision the
      // database up front and don't grant CREATE DATABASE — safe to ignore
      // since pool.execute below already targets that pre-existing database.
    }

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_code VARCHAR(6),
        verification_expires DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        color VARCHAR(20) DEFAULT '#ffffff',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        category VARCHAR(50) DEFAULT 'General',
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = initDB;
