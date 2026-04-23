const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  // Try to get token from Authorization header first, then from cookies
  let token = null;
  
  if (req.headers['authorization']) {
    token = req.headers['authorization'].split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = jwtAuth;