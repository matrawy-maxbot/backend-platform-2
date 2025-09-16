import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../../../config/security.config.js';
import { cacheGet, cacheSet } from '../../cache/redis/config/redis.manager.js';
import fetch from 'node-fetch';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // بتاخد التوكن من الهيدر
  secretOrKey: JWT_SECRET, // المفتاح السري
};

export default new JwtStrategy(options, async (payload, done) => {
  try {
    const { discordToken } = payload;
    
    if (!discordToken) {
      return done(null, false);
    }

    // تحقق من الكاش أولاً
    const cachedUser = await cacheGet(`discord_user:${discordToken}`);
    if (cachedUser) {
      return done(null, JSON.parse(cachedUser));
    }

    // إذا لم يوجد في الكاش، اطلب من Discord API
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${discordToken}`
      }
    });

    if (!response.ok) {
      return done(null, false); // التوكن غير صحيح
    }

    const discordUser = await response.json();
    
    // إنشاء كائن المستخدم
    const user = {
      id: discordUser.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
      email: discordUser.email,
      role: 'user' // الدور الافتراضي
    };

    // حفظ في الكاش لمدة 15 دقيقة
    await cacheSet(`discord_user:${discordToken}`, JSON.stringify(user), 900);

    return done(null, user);
  } catch (err) {
    console.error('Error in JWT strategy:', err);
    if(err.message === 'jwt expired') {
      return done(new Error('jwt expired'), false);
    }
    return done(err, false);
  }
});
