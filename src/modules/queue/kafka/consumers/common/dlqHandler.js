// consumers/common/dlqHandler.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'dlq-handler',
  brokers: ['kafka1:9092', 'kafka2:9092'],
});

export async function sendToDLQ(messages, originalTopic) {
  const producer = kafka.producer();
  try {
    await producer.connect();
    await producer.send({
      topic: 'dead-letter-queue',
      messages: messages.map(msg => ({
        value: JSON.stringify({
          originalTopic,
          error: msg.error || 'Unknown error',
          data: msg.value,
        }),
      })),
    });
    console.log('✅ تم إرسال الرسائل الفاشلة إلى DLQ.');
  } catch (err) {
    console.error('❌ فشل إرسال الرسائل إلى DLQ:', err);
  } finally {
    await producer.disconnect();
  }
}