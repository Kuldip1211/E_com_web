const jwt = require('jsonwebtoken');

const generateRefreshToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = generateRefreshToken;
