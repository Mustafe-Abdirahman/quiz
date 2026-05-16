import crypto from 'crypto';
import pool from '../config/db.js';

export async function getQuestions(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM questions ORDER BY id');
    const parsed = rows.map(q => ({ ...q, options: JSON.parse(q.options) }));
    res.json({ success: true, questions: parsed });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
}

export async function getQuestionsByQuizId(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM questions WHERE quizId = ?', [req.params.quizId]);
    const parsed = rows.map(q => ({ ...q, options: JSON.parse(q.options) }));
    res.json({ success: true, questions: parsed });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
}

export async function createQuestion(req, res) {
  try {
    const { text, options, correctAnswer, category, difficulty, quizId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }
    if (!options || options.length < 2) {
      return res.status(400).json({ success: false, message: 'At least 2 options required' });
    }
    const id = crypto.randomUUID();
    await pool.query(
      'INSERT INTO questions (id, quizId, text, options, correctAnswer, category, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, quizId || null, text, JSON.stringify(options), Number(correctAnswer), category || 'General', difficulty || 'medium']
    );
    const [rows] = await pool.query('SELECT * FROM questions WHERE id = ?', [id]);
    const question = { ...rows[0], options: JSON.parse(rows[0].options) };
    res.status(201).json({ success: true, question });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create question' });
  }
}

export async function updateQuestion(req, res) {
  try {
    const { text, options, correctAnswer, category, difficulty, quizId } = req.body;
    await pool.query(
      'UPDATE questions SET text = ?, options = ?, correctAnswer = ?, category = ?, difficulty = ?, quizId = ? WHERE id = ?',
      [text, JSON.stringify(options), Number(correctAnswer), category, difficulty, quizId || null, req.params.id]
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update question' });
  }
}

export async function deleteQuestion(req, res) {
  try {
    await pool.query('DELETE FROM questions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete question' });
  }
}
