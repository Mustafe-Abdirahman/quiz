import crypto from 'crypto';
import pool from '../config/db.js';

export async function getCategories(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json({ success: true, categories: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
}

export async function createCategory(req, res) {
  try {
    const { name, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const id = crypto.randomUUID();
    await pool.query('INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)', [id, name, icon || '📁']);
    res.status(201).json({ success: true, category: { id, name, icon: icon || '📁' } });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
}

export async function deleteCategory(req, res) {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
}
