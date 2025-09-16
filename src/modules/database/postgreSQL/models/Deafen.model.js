import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج Deafen - يمثل جدول كتم الصوت في قاعدة البيانات
 * Deafen Model - Represents the deafen table in the database
 */
const Deafen = sequelize.define('Deafen', {
  id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    comment: 'المعرف الفريد - Unique identifier'
  },
  deafens: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'بيانات كتم الصوت - Deafen data'
  }
}, {
  tableName: 'deafen',
  timestamps: false, // لا نحتاج timestamps افتراضية
  indexes: [
    {
      fields: ['id'],
      name: 'idx_deafen_id',
      unique: true
    }
  ]
});

export default Deafen;