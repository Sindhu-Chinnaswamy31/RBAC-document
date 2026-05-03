// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
  // Sign the token with user ID as payload
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  // Set as httpOnly cookie — JS cannot read this, prevents XSS theft
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  });

  return token;
};

module.exports = generateToken;
