import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_NAME = process.env.DB_NAME || 'quizdb';

const sslConfig = process.env.DB_SSL === 'true' ? {
  ssl: process.env.DB_CA_CERT
    ? { ca: fs.readFileSync(path.resolve(__dirname, '..', 'config', process.env.DB_CA_CERT)) }
    : { rejectUnauthorized: true },
} : {};

const BASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
  ...sslConfig,
};

async function init() {
  // Connect without a database first to create/ensure it exists
  const connection = await mysql.createConnection(BASE_CONFIG);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  } catch {
    // May fail on Aiven if no CREATE DATABASE permission — ignore
  }

  await connection.query(`USE \`${DB_NAME}\``);

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await connection.query(schema);

  const adminPassword = await bcrypt.hash('admin123', 10);
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const seedWithPassword = seedSql.replace('$2a$10$dummy', adminPassword);
  await connection.query(seedWithPassword);

  console.log('Database initialized successfully!');
  await connection.end();
}

init().catch(err => {
  console.error('Database init failed:', err);
  process.exit(1);
});
