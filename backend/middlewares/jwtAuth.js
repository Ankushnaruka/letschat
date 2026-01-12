const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header
  const token = req.cookies ? req.cookies.accessToken : null;
  if(!token){
    res.status(401).json({ message: 'login again' });
    return;
  }
  // token from header is ignored
  // const token = (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  // if (!token) {
  //   return res.status(401).json({ message: 'Access token missing' });
  // }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = jwtAuth;