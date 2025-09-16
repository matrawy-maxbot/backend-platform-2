// consumers/databaseWriter.js
import { Sequelize } from 'sequelize';
import { sendToDLQ } from './common/dlqHandler.js';

// إعداد اتصال PostgreSQL
const sequelize = new Sequelize('postgres://user:password@localhost:5432/mydb');

// تعريف الموديل
const DataModel = sequelize.define('Data', {
  id: { type: Sequelize.UUID, primaryKey: true },
  data: { type: Sequelize.JSONB },
  timestamp: { type: Sequelize.BIGINT },
});

export async function performBulkOperations(messages, topic) {
  try {
    // تحويل الرسائل إلى تنسيق مناسب للـ Bulk Insert
    const records = messages.map(msg => ({
      id: msg.id,
      data: msg.data,
      timestamp: msg.timestamp,
    }));

    // تنفيذ الـ Bulk Insert
    await DataModel.bulkCreate(records, {
      ignoreDuplicates: true,
      validate: false,
    });
    console.log('✅ تم إدخال البيانات بنجاح.');
  } catch (err) {
    console.error('❌ فشل في إدخال البيانات:', err);
    await sendToDLQ(messages, topic);
    throw err; // لإعادة المحاولة إذا لزم الأمر
  }
}