const crypto = require('crypto');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

// 1. Request password reset
async function forgotPassword(req, res) {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found with given username' });

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    user.resetCode = code;
    user.resetCodeExpiry = Date.now() + 3 * 60 * 1000; // 3 minutes
    await user.save();

    // Email content
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f7;">
      <div style="max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">🔐 Password Reset</h2>
        <p style="font-size: 16px; color: #555;">
          Hello, we received a request to reset your password. Use the code below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 22px; font-weight: bold; background: #007BFF; color: white; padding: 10px 20px; border-radius: 6px; letter-spacing: 2px;">
            ${code}
          </span>
        </div>
        <p style="font-size: 14px; color: #777;">
          This code will expire in <b>3 minutes</b>. If you didn’t request this, you can ignore this email.
        </p>
      </div>
    </div>
    `;

    // ✅ Use Brevo's shared sender (noreply@brevo.com)
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'letschat', email: process.env.EMAIL_USER },
        to: [{ email: user.email }],
        subject: 'Your password reset code',
        htmlContent,
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': `${process.env.BREVO_API_KEY}`,
          'content-type': 'application/json',
        },
      }
    );

    res.json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.error('Email send error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send email' });
  }
}

// 2. Verify code
async function verifyCode(req, res) {
  const { email, code } = req.body;
  const user = await User.findOne({ email, resetCode: code });
  if (!user || user.resetCodeExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }
  res.json({ message: 'Code verified' });
}

// 3. Reset password
async function resetPassword(req, res) {
  const { username, code, newPassword } = req.body;
  const user = await User.findOne({ username, resetCode: code });
  if (!user || user.resetCodeExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired code' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
}

module.exports = { forgotPassword, verifyCode, resetPassword };
