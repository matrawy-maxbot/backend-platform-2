import { sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/security.config.js';

const generateToken = (payload, expiresIn = '1h') => {
    return sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

export default { generateToken, verifyToken };