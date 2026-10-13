const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

const USERNAME_RE = /^[A-Za-z0-9 _.-]{3,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create a fresh session for the user (prevents session fixation)
function startSession(req, res, next, user, status) {
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.userId = user.id;
    req.session.username = user.username;
    res.status(status).json({ ok: true, user: { username: user.username } });
  });
}

// POST /api/signup  { username, email, password }
router.post('/signup', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!USERNAME_RE.test(username)) {
      return res.status(400).json({ error: 'Name must be 3-30 characters (letters, numbers, space, _ . -).' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6 || password.length > 72) {
      return res.status(400).json({ error: 'Password must be 6-72 characters long.' });
    }

    const existing = db
      .prepare('SELECT id FROM users WHERE username = ? OR email = ?')
      .get(username, email);
    if (existing) {
      return res.status(409).json({ error: 'Username or email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const info = db
      .prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)')
      .run(username, email, passwordHash);

    startSession(req, res, next, { id: Number(info.lastInsertRowid), username }, 201);
  } catch (err) {
    next(err);
  }
});

// POST /api/login  { username (or email), password }
router.post('/login', async (req, res, next) => {
  try {
    const identifier = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = db
      .prepare('SELECT id, username, password_hash FROM users WHERE username = ? OR email = ?')
      .get(identifier, identifier.toLowerCase());

    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    startSession(req, res, next, user, 200);
  } catch (err) {
    next(err);
  }
});

// POST /api/logout
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('udyamini.sid');
    res.json({ ok: true });
  });
});

// GET /api/me  -> who is logged in?
router.get('/me', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({ user: { id: req.session.userId, username: req.session.username } });
  }
  res.status(401).json({ error: 'Not logged in.' });
});

module.exports = router;
