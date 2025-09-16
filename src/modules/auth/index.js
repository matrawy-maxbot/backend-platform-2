import passport from 'passport';
import jwtStrategy from './strategies/jwt.strategy.js';

// هنا بنفعّل الاستراتيجيات مع Passport
passport.use(jwtStrategy);

export default passport;
