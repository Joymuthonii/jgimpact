import jwt from 'jsonwebtoken';

const SESSION_TIMEOUT_SECONDS = 15 * 60;

export const verifyAuth = (token) => {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      typeof decoded.iat !== 'number' ||
      Date.now() / 1000 - decoded.iat >= SESSION_TIMEOUT_SECONDS
    ) {
      return null;
    }
    return decoded;
  } catch (error) {
    return null;
  }
};

export const createToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: SESSION_TIMEOUT_SECONDS }
  );
};

export const getTokenFromRequest = (req) => {
  const authHeader = typeof req.headers.get === 'function'
    ? req.headers.get('authorization')
    : req.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
};
