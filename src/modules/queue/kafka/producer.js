import { Kafka, CompressionTypes } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const kafka = new Kafka({
  clientId: 'my-highload-producer',
  brokers: ['kafka1:9092', 'kafka2:9092'],
  retry: {
    retries: 5,
    initialRetryTime: 1000,
  },
});

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  idempotent: true,
  transactionTimeout: 30000,
});

const producerConfig = {
  acks: 1,
  compression: CompressionTypes.Snappy,
  linger: 5,
  batchSize: 16384,
};

async function sendToKafka(topic, messages) {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: messages.map(msg => ({
        value: JSON.stringify({ id: uuidv4(), ...msg }),
      })),
      ...producerConfig,
    });
  } catch (err) {
    console.error('فشل الإرسال إلى Kafka:', err);
    throw err; // أعد رمي الخطأ للتعامل معه في الطبقة الأعلى
  } finally {
    await producer.disconnect(); // تأكد من إغلاق الاتصال
  }
}

export default sendToKafka;

// مثال للاستخدام عند استقبال طلب
// app.post('/request', async (req, res) => {
//   try {
//     const message = {
//       id: uuidv4(), // unique ID لكل رسالة
//       data: req.body,
//       timestamp: Date.now(),
//     };

//     await sendToKafka('requests-topic', [message]);
//     res.status(200).send('تم استلام الطلب!');
//   } catch (err) {
//     console.error('فشل الإرسال:', err);
//     res.status(500).send('حدث خطأ!');
//   }
// });