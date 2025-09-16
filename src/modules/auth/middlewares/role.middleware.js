import status from '../../../config/status.config.js';

export const checkRole = (role) => (req, res, next) => {
     if (req.user.role !== role) {
       return res.status(status.FORBIDDEN).json({ message: 'Access denied.' });
     }
     next();
   };