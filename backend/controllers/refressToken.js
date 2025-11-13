const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

async function refreshTokengen(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(400).json({ message: 'Authorization header required' });
    }
    
    const refreshToken = authHeader.split(' ')[1];
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token with JWT_SECRET (same as signup/login)
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const userId = decoded._id;
    
    const user = await User.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
}

module.exports = { refreshTokengen };