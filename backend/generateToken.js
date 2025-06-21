const jwt = require('jsonwebtoken');

// Replace with your test user's MongoDB _id and your JWT secret
const users = [
  { _id: '665f1a1a1a1a1a1a1a1a1a11', username: 'test1' },
  { _id: '665f1a1a1a1a1a1a1a1a1a12', username: 'test2' },
  { _id: '665f1a1a1a1a1a1a1a1a1a13', username: 'test3' }
];

const secret = 'lnqvnlnniy49270qbcabvkhajvh' ;

users.forEach(user => {
  const token = jwt.sign({ _id: user._id, username: user.username }, secret, { expiresIn: '7d' });
  console.log(`${user.username}: ${token}`);
});