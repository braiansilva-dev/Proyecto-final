const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret123';

// Middleware para verificar token en cookies (para APIs)
function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

// Middleware para verificar token en cookies (para páginas HTML - redirige si no hay token)
function verifyTokenPage(req, res, next) {
  const token = req.cookies?.token;
  
  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/login');
    }
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken, verifyTokenPage };
