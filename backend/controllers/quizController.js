import crypto from 'crypto';
import pool from '../config/db.js';

export async function getQuizzes(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes ORDER BY createdAt DESC');
    res.json({ success: true, quizzes: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
  }
}

export async function getQuizById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, quiz: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
  }
}

export async function createQuiz(req, res) {
  try {
    const { title, description, category, difficulty, timePerQuestion, thumbnail, maxPlayers } = req.body;
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Title must be at least 3 characters' });
    }
    const id = crypto.randomUUID();
    await pool.query(
      `INSERT INTO quizzes (id, title, description, category, difficulty, timePerQuestion, thumbnail, maxPlayers, createdBy, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, title, description || '', category || 'General', difficulty || 'medium',
       Number(timePerQuestion) || 60, thumbnail || '📝', Number(maxPlayers) || 4, req.user.userId]
    );
    const [rows] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [id]);
    res.status(201).json({ success: true, quiz: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create quiz' });
  }
}

export async function updateQuiz(req, res) {
  try {
    const { title, description, category, difficulty, timePerQuestion, thumbnail, maxPlayers } = req.body;
    await pool.query(
      `UPDATE quizzes SET title = ?, description = ?, category = ?, difficulty = ?, timePerQuestion = ?, thumbnail = ?, maxPlayers = ? WHERE id = ?`,
      [title, description, category, difficulty, timePerQuestion, thumbnail, maxPlayers, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update quiz' });
  }
}

export async function deleteQuiz(req, res) {
  try {
    await pool.query('DELETE FROM quizzes WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete quiz' });
  }
}

export async function incrementPlayCount(req, res) {
  try {
    await pool.query('UPDATE quizzes SET playCount = playCount + 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update play count' });
  }
}
