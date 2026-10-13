const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const { requireLogin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Parse JSON request bodies
app.use(express.json());

// Sessions (stored in memory - fine for a mini project; users must log in again after a server restart)
app.use(
  session({
    name: 'udyamini.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// API routes
app.use('/api', authRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));

// index2.html is the "logged-in" home page, so protect it
app.get('/index2.html', requireLogin, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index2.html'));
});

// Everything else in /public (html, css, images, videos...) is served as static files
app.use(express.static(PUBLIC_DIR));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Udyamini running at http://localhost:${PORT}`);
});
