require('dotenv').config();

module.exports = {
  secret: "Balaji",
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  cookieExpires: process.env.JWT_COOKIE_EXPIRES || 90,
};