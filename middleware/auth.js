// Blocks access unless the user is logged in
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) return next();

  // API calls get JSON, page requests get redirected to the login page
  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({ error: 'Please log in first.' });
  }
  return res.redirect('/Login/index.html');
}

module.exports = { requireLogin };
