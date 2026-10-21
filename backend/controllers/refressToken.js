const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

async function refreshTokengen(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    const refreshToken = req.cookies?.refreshToken || bearerToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    res.cookie('accessToken', newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to refresh token', error: error.message });
  }
}

module.exports = { refreshTokengen };
