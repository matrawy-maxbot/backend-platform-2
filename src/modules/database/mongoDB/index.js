import connectDB from './config/db.config.js';
import { User } from './models/index.js';
import UserService from './services/User.service.js';

// نبدأ الاتصال بقاعدة البيانات
connectDB();

export { User, UserService };