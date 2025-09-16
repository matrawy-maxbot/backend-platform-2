import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول التصويتات (Votes)
 * يحتوي على معلومات التصويتات في الخوادم
 */
const Votes = sequelize.define('Votes', {
  // معرف
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    comment: 'معرف'
  },
  guildID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'معرف الخادم/الجيلد'
  },
  channelID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'معرف القناة'
  },
  messageID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'معرف الرسالة'
  },
  rankmessageID: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'معرف رسالة الترتيب'
  }
}, {
  tableName: 'votes',
  timestamps: true, // إضافة createdAt و updatedAt تلقائياً
  indexes: [
    {
      unique: true,
      fields: ['guildID', 'channelID'] // فهرس مركب فريد
    },
    {
      fields: ['guildID'] // فهرس للبحث السريع بالخادم
    },
    {
      fields: ['channelID'] // فهرس للبحث السريع بالقناة
    },
    {
      fields: ['messageID'] // فهرس للبحث السريع بالرسالة
    }
  ],
  comment: 'جدول التصويتات - يحتوي على معلومات التصويتات في الخوادم'
});

export default Votes;