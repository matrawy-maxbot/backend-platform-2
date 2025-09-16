// redis_pub_sub/publishers/NotificationPublisher.js
import redisClient from '../../redis/config/redis.config.js';

class NotificationPublisher {
  async publish(channel, message) {
    try {
      await redisClient.publish(channel, JSON.stringify(message));
      console.log(`✅ نشر على ${channel}: ${JSON.stringify(message)}`);
    } catch (err) {
      console.error(`❌ فشل النشر على ${channel}:`, err);
      throw err;
    }
  }
}

export default new NotificationPublisher();