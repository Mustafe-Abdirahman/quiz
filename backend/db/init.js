import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function init() {
  const connection = await mysql.createConnection(DB_CONFIG);

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
