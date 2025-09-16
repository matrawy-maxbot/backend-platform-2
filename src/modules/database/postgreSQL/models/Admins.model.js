import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول المشرفين - Admins Model
 * يحتوي على معلومات المشرفين وإعدادات الكيبورد لكل خادم
 */
const Admins = sequelize.define('Admins', {
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    comment: 'معرف الخادم - Guild ID'
  },
  admins_id: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'معرفات المشرفين - Admins IDs'
  },
  max_kb: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment: 'الحد الأقصى للكيبورد - Max keyboard setting'
  },
  blacklist_kb: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    comment: 'كيبورد القائمة السوداء - Blacklist keyboard setting'
  }
}, {
  tableName: 'admins',
  timestamps: true, // إضافة createdAt و updatedAt
  indexes: [
    {
      unique: true,
      fields: ['guild_id']
    }
  ],
  comment: 'جدول المشرفين وإعدادات الكيبورد للخوادم'
});

export default Admins;