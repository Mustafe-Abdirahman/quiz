import crypto from 'crypto';
import pool from '../config/db.js';

function generateRoomCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

export async function getRooms(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY createdAt DESC');
    const parsed = rows.map(r => ({ ...r, players: r.players ? JSON.parse(r.players) : [] }));
    res.json({ success: true, rooms: parsed });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch rooms' });
  }
}

export async function getRoomById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Room not found' });
    const room = { ...rows[0], players: rows[0].players ? JSON.parse(rows[0].players) : [] };
    res.json({ success: true, room });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch room' });
  }
}

export async function getRoomByCode(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE code = ?', [req.params.code]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Room not found' });
    const room = { ...rows[0], players: rows[0].players ? JSON.parse(rows[0].players) : [] };
    res.json({ success: true, room });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch room' });
  }
}

export async function createRoom(req, res) {
  try {
    const { quizId, maxPlayers } = req.body;
    const id = crypto.randomUUID();
    const code = generateRoomCode();
    const hostPlayer = { userId: req.user.userId, username: req.user.username, score: 0, correct: 0, incorrect: 0, answers: [], finished: false, questionIds: [], currentQuestion: 0 };
    await pool.query(
      'INSERT INTO rooms (id, code, quizId, hostId, maxPlayers, players, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, "waiting", NOW())',
      [id, code, quizId, req.user.userId, maxPlayers || 4, JSON.stringify([hostPlayer])]
    );
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    const room = { ...rows[0], players: JSON.parse(rows[0].players) };
    res.status(201).json({ success: true, room });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create room' });
  }
}

export async function joinRoom(req, res) {
  try {
    const { code } = req.body;
    const [rows] = await pool.query('SELECT * FROM rooms WHERE code = ?', [code]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Room not found' });

    const room = rows[0];
    const players = JSON.parse(room.players);
    if (room.status !== 'waiting') return res.status(400).json({ success: false, message: 'Game already started' });
    if (players.length >= (room.maxPlayers || 4)) return res.status(400).json({ success: false, message: 'Room is full' });
    if (players.find(p => p.userId === req.user.userId)) return res.status(400).json({ success: false, message: 'Already in room' });

    players.push({ userId: req.user.userId, username: req.user.username, score: 0, correct: 0, incorrect: 0, answers: [], finished: false, questionIds: [], currentQuestion: 0 });
    await pool.query('UPDATE rooms SET players = ? WHERE id = ?', [JSON.stringify(players), room.id]);

    const [updated] = await pool.query('SELECT * FROM rooms WHERE id = ?', [room.id]);
    const result = { ...updated[0], players: JSON.parse(updated[0].players) };
    res.json({ success: true, room: result });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to join room' });
  }
}

export async function updateRoom(req, res) {
  try {
    const { quizId, maxPlayers, status } = req.body;
    await pool.query('UPDATE rooms SET quizId = ?, maxPlayers = ?, status = ? WHERE id = ?',
      [quizId, maxPlayers, status, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    const room = { ...rows[0], players: rows[0].players ? JSON.parse(rows[0].players) : [] };
    res.json({ success: true, room });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update room' });
  }
}

export async function deleteRoom(req, res) {
  try {
    await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete room' });
  }
}

export async function startGame(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Room not found' });

    const room = rows[0];
    const players = JSON.parse(room.players);

    if (players.length === 0) return res.status(400).json({ success: false, message: 'No players in room' });

    players.forEach(p => {
      p.currentQuestion = 0;
      p.finished = false;
      p.score = 0;
      p.correct = 0;
      p.incorrect = 0;
      p.answers = [];
    });

    await pool.query('UPDATE rooms SET status = "playing", players = ? WHERE id = ?', [JSON.stringify(players), req.params.id]);
    const [updated] = await pool.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
    const result = { ...updated[0], players: JSON.parse(updated[0].players) };
    res.json({ success: true, room: result });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to start game' });
  }
}
