import crypto from 'crypto';
import pool from '../config/db.js';

export async function getAttempts(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM attempts ORDER BY completedAt DESC');
    const parsed = rows.map(a => ({ ...a, answers: a.answers ? JSON.parse(a.answers) : [] }));
    res.json({ success: true, attempts: parsed });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch attempts' });
  }
}

export async function getUserAttempts(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM attempts WHERE userId = ? ORDER BY completedAt DESC', [req.params.userId]);
    const parsed = rows.map(a => ({ ...a, answers: a.answers ? JSON.parse(a.answers) : [] }));
    res.json({ success: true, attempts: parsed });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch attempts' });
  }
}

export async function saveAttempt(req, res) {
  try {
    const { userId, quizId, quizTitle, score, totalQuestions, correct, incorrect, unanswered, accuracy, timeTaken, answers, mode } = req.body;
    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO attempts (id, userId, quizId, quizTitle, score, totalQuestions, correct, incorrect, unanswered, accuracy, timeTaken, answers, mode, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, userId, quizId, quizTitle || '', score || 0, totalQuestions || 0, correct || 0, incorrect || 0, unanswered || 0,
       accuracy || 0, timeTaken || 0, JSON.stringify(answers || []), mode || 'solo']
    );
    const [rows] = await pool.query('SELECT * FROM attempts WHERE id = ?', [id]);
    const attempt = { ...rows[0], answers: rows[0].answers ? JSON.parse(rows[0].answers) : [] };
    res.status(201).json({ success: true, attempt });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save attempt' });
  }
}

export async function getLeaderboard(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT a.userId, u.username,
             SUM(a.score) as totalScore,
             SUM(a.correct) as totalCorrect,
             SUM(a.totalQuestions) as totalQuestions,
             COUNT(*) as attempts,
             ROUND(SUM(a.correct) / SUM(a.totalQuestions) * 100) as accuracy
      FROM attempts a
      JOIN users u ON a.userId = u.id
      GROUP BY a.userId, u.username
      ORDER BY totalScore DESC, accuracy DESC
    `);
    res.json({ success: true, leaderboard: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
}

export async function getUserStats(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT COUNT(*) as totalQuizzes,
             COALESCE(SUM(correct), 0) as totalCorrect,
             COALESCE(SUM(incorrect), 0) as totalIncorrect,
             COALESCE(MAX(score), 0) as bestScore,
             COALESCE(ROUND(AVG(score)), 0) as averageScore,
             COALESCE(ROUND(AVG(accuracy)), 0) as totalAccuracy
      FROM attempts WHERE userId = ?
    `, [req.params.userId]);
    res.json({ success: true, stats: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
}
