// import { Kafka } from 'kafkajs';

// const kafka = new Kafka({
//   clientId: 'my-highload-consumer',
//   brokers: ['kafka1:9092', 'kafka2:9092'],
// });

// const consumer = kafka.consumer({
//   groupId: 'bulk-insert-group',
//   maxBytesPerPartition: 1048576,
//   sessionTimeout: 30000,
//   heartbeatInterval: 3000,
// });

// async function runConsumer() {
//   try {
//     await consumer.connect();
//     await consumer.subscribe({ topic: 'requests-topic', fromBeginning: false });

//     await consumer.run({
//       autoCommit: false,
//       partitionsConsumedConcurrently: 10,
//       eachBatchAutoResolve: false,
//       // eslint-disable-next-line no-unused-vars
//       eachBatch: async ({ batch, resolveOffset, commitOffsets }) => {
//         const messages = batch.messages;

//         try {
//           // eslint-disable-next-line no-unused-vars
//           const bulkData = messages.map(msg => JSON.parse(msg.value.toString()));
//           // await performBulkOperations(bulkData); // دالة أنت اللي هتكتبها
//           await commitOffsets(batch.highWatermark);
//         } catch (err) {
//           console.error('فشل معالجة الرسائل:', err);
//           // أرسل الرسائل الفاشلة إلى Dead Letter Queue
//           await sendToDLQ(messages);
//         }
//       },
//     });
//   } catch (err) {
//     console.error('فشل تشغيل الـ Consumer:', err);
//   } finally {
//     await consumer.disconnect(); // تأكد من إغلاق الاتصال
//   }
// }

// // دالة لإرسال الرسائل الفاشلة إلى Dead Letter Queue
// async function sendToDLQ(messages) {
//   const dlqProducer = kafka.producer();
//   await dlqProducer.connect();
//   try {
//     await dlqProducer.send({
//       topic: 'dead-letter-queue',
//       messages: messages.map(msg => ({ value: JSON.stringify(msg) })),
//     });
//   } catch (err) {
//     console.error('فشل إرسال الرسائل إلى DLQ:', err);
//   } finally {
//     await dlqProducer.disconnect();
//   }
// }

// runConsumer().catch(console.error);


// consumer.js
import { startDatabaseWriterConsumer } from './topics/database-writing/consumer.js';

async function runAllConsumers() {
  try {
    await startDatabaseWriterConsumer();
    // يمكنك إضافة consumers أخرى هنا مثل:
    // await startAnotherConsumer();
    console.log('🎉 تم تشغيل جميع الـ Consumers بنجاح!');
  } catch (err) {
    console.error('❌ فشل تشغيل الـ Consumers:', err);
  }
}

runAllConsumers();