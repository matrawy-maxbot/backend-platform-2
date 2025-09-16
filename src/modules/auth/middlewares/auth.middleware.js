import passport from 'passport';
import status from '../../../config/status.config.js';

// Middleware للتحقق من المصادقة وإضافة المستخدم والـ role للـ req
export const authenticateJwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
          res.status(status.UNAUTHORIZED);
          return next(new Error(err));
    }

    if (!user) {
          res.status(status.UNAUTHORIZED);
          return next(new Error('Unauthorized'));
    }

    if(!user.role) {
          res.status(status.UNAUTHORIZED);
          return next(new Error('User does not have a role'));
    }

    req.user = user;
    req.user.role = user.role || 'user';

    next(); // استمر للـ route اللي بعده
  })(req, res, next);
};
