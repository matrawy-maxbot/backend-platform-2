// topics/database-writing/consumer.js
import { Kafka } from 'kafkajs';
import { performBulkOperations } from '../../consumers/databaseWriter.js';

const kafka = new Kafka({
  clientId: 'database-writer-consumer',
  brokers: ['kafka1:9092', 'kafka2:9092'],
});

const consumer = kafka.consumer({
  groupId: 'database-writer-group',
  maxBytesPerPartition: 1048576, // 1MB لكل بارتيشن
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

export async function startDatabaseWriterConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'database-writing', fromBeginning: false });

    await consumer.run({
      autoCommit: false,
      partitionsConsumedConcurrently: 5,
      eachBatch: async ({ batch }) => {
        try {
          const messages = batch.messages.map(msg => JSON.parse(msg.value.toString()));
          await performBulkOperations(messages, batch.topic);
          await consumer.commitOffsets([{ 
            topic: batch.topic, 
            partition: batch.partition, 
            offset: batch.highWatermark 
          }]);
        } catch (err) {
          console.error('❌ فشل معالجة الدُفعة:', err);
        }
      },
    });
  } catch (err) {
    console.error('❌ فشل تشغيل الـ Consumer:', err);
  }
}