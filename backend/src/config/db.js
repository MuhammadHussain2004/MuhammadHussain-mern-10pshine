const mysql = require('mysql2/promise');
require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true' || !!process.env.TIDB_HOST;

const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.TIDB_HOST,
    user: process.env.DB_USER || process.env.TIDB_USER,
    password: process.env.DB_PASSWORD || process.env.TIDB_PASSWORD,
    database: process.env.DB_NAME || process.env.TIDB_DATABASE,
    port: process.env.DB_PORT || process.env.TIDB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    ...(useSSL ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } } : {}),
});

module.exports = pool;
