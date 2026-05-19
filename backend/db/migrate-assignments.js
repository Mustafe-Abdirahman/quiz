import 'dotenv/config';
import pool from '../config/db.js';

async function migrate() {
  try {
    console.log('Creating quiz_assignments table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_assignments (
        quizId VARCHAR(36) NOT NULL,
        userId VARCHAR(36) NOT NULL,
        PRIMARY KEY (quizId, userId),
        FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
