import jwt from 'jsonwebtoken';

/**
 * Signs a JWT containing the user's id.
 * Expires in 30 days by default.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
