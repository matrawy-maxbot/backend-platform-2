import UserCacheRepository from '../repositories/UserCache.repository.js';

class UserCacheService {
  async cacheUser(userId, userData, ttl = 3600) {
    await UserCacheRepository.setUser(userId, userData, ttl);
  }

  async getCachedUser(userId) {
    return await UserCacheRepository.getUser(userId);
  }

  async removeCachedUser(userId) {
    await UserCacheRepository.deleteUser(userId);
  }
}

export default new UserCacheService();