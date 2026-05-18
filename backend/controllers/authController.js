import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.json({
      success: true,
      user: { userId: user.id, role: user.role, username: user.username, email: user.email, fullName: user.fullName || user.username, avatar: user.avatar || null },
      token,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
}

export async function register(req, res) {
  try {
    const { username, email, password, fullName } = req.body;
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
    await pool.query(
      'INSERT INTO users (id, username, email, password, fullName, role, createdAt) VALUES (?, ?, ?, ?, ?, \'user\', NOW())',
      [id, username, email, hashed, fullName || username]
    );
    const token = generateToken({ id, role: 'user', username, email });
    res.status(201).json({
      success: true,
      user: { userId: id, role: 'user', username, email, fullName: fullName || username, avatar: null },
      token,
    });
  } catch {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
}

export async function getSession(req, res) {
  try {
    const [rows] = await pool.query('SELECT id, username, email, fullName, role, avatar FROM users WHERE id = ?', [req.user.userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const u = rows[0];
    res.json({
      success: true,
      user: { userId: u.id, role: u.role, username: u.username, email: u.email, fullName: u.fullName || u.username, avatar: u.avatar || null },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to get session' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { username, email, fullName, password, avatar } = req.body;
    const userId = req.user.userId;

    if (username !== undefined && (typeof username !== 'string' || username.trim().length < 2)) {
      return res.status(400).json({ success: false, message: 'Username must be at least 2 characters' });
    }
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    if (password !== undefined && password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (username !== undefined || email !== undefined) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?',
        [email || '', username || '', userId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email or username already taken' });
      }
    }

    const updates = {};
    if (username !== undefined) updates.username = username.trim();
    if (email !== undefined) updates.email = email;
    if (fullName !== undefined) updates.fullName = fullName || null;
    if (password !== undefined) updates.password = await bcrypt.hash(password, 10);
    if (avatar !== undefined) updates.avatar = avatar || null;

    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const sets = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    values.push(userId);

    await pool.query(`UPDATE users SET ${sets} WHERE id = ?`, values);

    const [rows] = await pool.query('SELECT id, username, email, fullName, role, avatar FROM users WHERE id = ?', [userId]);
    const u = rows[0];
    const userData = { userId: u.id, role: u.role, username: u.username, email: u.email, fullName: u.fullName || u.username, avatar: u.avatar || null };

    res.json({ success: true, user: userData });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}
