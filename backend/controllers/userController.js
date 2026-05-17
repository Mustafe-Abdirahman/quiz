import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../config/db.js';

export async function getUsers(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, username, email, fullName, role, createdAt FROM users ORDER BY createdAt DESC');
    res.json({ success: true, users: rows });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

export async function getUserById(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, username, email, fullName, role, createdAt FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}

export async function updateUser(req, res) {
  try {
    const { username, email, fullName, password, role } = req.body;
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (fullName !== undefined) updates.fullName = fullName;
    if (password !== undefined) updates.password = await bcrypt.hash(password, 10);
    if (role !== undefined) {
      const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = \'admin\'');
      if (count <= 1) {
        const [[target]] = await pool.query('SELECT role FROM users WHERE id = ?', [req.params.id]);
        if (target && target.role === 'admin' && role !== 'admin') {
          return res.status(400).json({ success: false, message: 'Cannot demote the last admin' });
        }
      }
      updates.role = role;
    }

    const allowed = ['username', 'email', 'fullName', 'password', 'role'];
    const keys = Object.keys(updates).filter(k => allowed.includes(k));
    if (keys.length === 0) return res.status(400).json({ success: false, message: 'No valid fields to update' });

    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    values.push(req.params.id);

    await pool.query(`UPDATE users SET ${sets} WHERE id = ?`, values);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
}

export async function createUser(req, res) {
  try {
    const { username, email, password, fullName, role } = req.body;
    if (!username || username.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Username must be at least 2 characters' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email or username already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const userRole = role === 'admin' ? 'admin' : 'user';
    await pool.query(
      'INSERT INTO users (id, username, email, password, fullName, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [id, username, email, hashed, fullName || username, userRole]
    );
    res.status(201).json({
      success: true,
      user: { userId: id, role: userRole, username, email, fullName: fullName || username },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
}
