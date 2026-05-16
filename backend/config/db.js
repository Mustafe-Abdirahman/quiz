import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sslConfig = process.env.DB_SSL === 'true' ? {
  ssl: process.env.DB_CA_CERT
    ? { ca: fs.readFileSync(path.resolve(__dirname, process.env.DB_CA_CERT)) }
    : { rejectUnauthorized: true },
} : {};

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'quizdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig,
});

export default pool;
