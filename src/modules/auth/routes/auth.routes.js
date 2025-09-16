import express from 'express';
import passport from '../index.js';
import AuthService from '../services/Auth.service.js';
import { authRateLimiter, generalRateLimiter } from '../../../middlewares/security/rateLimiter.middleware.js';
import status from '../../../config/status.config.js';

const router = express.Router();

// تسجيل الدخول بـ Discord token
router.post('/discord/login', authRateLimiter, async (req, res, next) => {
  try {
    const { discordToken } = req.body;
    
    if (!discordToken) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Discord token is required'
      });
    }

    const result = await AuthService.loginWithDiscord(discordToken);
    
    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error) {
    res.status(status.UNAUTHORIZED).json({
      error: error.message
    });
  }
});

// التحقق من صحة Discord token
router.post('/discord/validate', authRateLimiter, async (req, res) => {
  try {
    const { discordToken } = req.body;
    
    if (!discordToken) {
      return res.status(status.BAD_REQUEST).json({
        error: 'Discord token is required'
      });
    }

    const isValid = await AuthService.validateDiscordToken(discordToken);
    
    res.json({
      valid: isValid
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: 'Validation failed'
    });
  }
});

// الصفحات المحمية
router.get('/protected', generalRateLimiter, passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ 
    message: 'مرحبًا! انت مصدّق ومسموح ليك تشوف الصفحة دي.', 
    user: req.user 
  });
});

// معلومات المستخدم الحالي
router.get('/me', generalRateLimiter, passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;
