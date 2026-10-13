# Udyamini – Node.js + Express backend

## Run it
```bash
npm install
npm start          # or: npm run dev  (auto-restarts on changes)
```
Open **http://localhost:3000** (do not open the HTML files by double-clicking – the login/signup need the server).

Optional: set a real session secret
- Windows (PowerShell): `$env:SESSION_SECRET="some-long-random-text"; npm start`
- Mac/Linux: `SESSION_SECRET="some-long-random-text" npm start`

## Structure
```
server.js              Express app (sessions, static files, route protection)
db.js                  SQLite database + users table  (file: data/udyamini.db)
routes/auth.js         /api/signup, /api/login, /api/logout, /api/me
middleware/auth.js     requireLogin (protects index2.html)
public/                Your original front-end (HTML/CSS/images/videos)
```

## API
| Method | URL          | Body                          | What it does                  |
|--------|--------------|-------------------------------|-------------------------------|
| POST   | /api/signup  | username, email, password     | Creates user + logs them in   |
| POST   | /api/login   | username (or email), password | Logs in                       |
| POST   | /api/logout  | –                             | Logs out                      |
| GET    | /api/me      | –                             | Returns the logged-in user    |

Passwords are hashed with bcrypt. Sessions use an httpOnly cookie.
`/index2.html` (the logged-in home page) redirects to the login page if you are not logged in.
