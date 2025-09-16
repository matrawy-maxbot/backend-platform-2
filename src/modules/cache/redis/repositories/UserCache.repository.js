import redisClient from '../config/redis.config.js';

class UserCacheRepository {
  async setUser(userId, userData, ttl = 3600) {
    await redisClient.set(`user:${userId}`, JSON.stringify(userData), 'EX', ttl);
  }

  async getUser(userId) {
    const userData = await redisClient.get(`user:${userId}`);
    return userData ? JSON.parse(userData) : null;
  }

  async deleteUser(userId) {
    await redisClient.del(`user:${userId}`);
  }
}

export default new UserCacheRepository();