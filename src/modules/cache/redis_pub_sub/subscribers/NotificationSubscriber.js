// redis_pub_sub/subscribers/NotificationSubscriber.js
import redisClient from '../../redis/config/redis.config.js';
import NotificationHandler from '../handlers/NotificationHandler.js';

class NotificationSubscriber {
  constructor() {
    this.subscriber = redisClient.duplicate();
    this.connect();
  }

  async connect() {
    await this.subscriber.connect();
    console.log('🎧 مشترك Redis متصل');
  }

  subscribe(channel) {
    this.subscriber.subscribe(channel, (err) => {
      if (err) console.error(`❌ فشل الاشتراك في ${channel}:`, err);
      else console.log(`🔔 مشترك في ${channel}`);
    });

    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) NotificationHandler.handle(JSON.parse(msg));
    });
  }
}

export default new NotificationSubscriber();