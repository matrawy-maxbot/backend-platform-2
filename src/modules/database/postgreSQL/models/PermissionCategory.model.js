import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول فئات الصلاحيات - Permission Category Model
 * يحتوي على تصنيفات الصلاحيات لتنظيمها بشكل أفضل
 */
const PermissionCategory = sequelize.define('PermissionCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف فئة الصلاحية الفريد - Permission Category ID'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم فئة الصلاحية - Permission Category Name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف فئة الصلاحية - Permission Category Description'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'ترتيب عرض الفئة - Display Sort Order'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بفئة الصلاحية - Associated site identifier'
  }
}, {
  tableName: 'permission_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['name']
    },
    {
      fields: ['created_at']
    }
  ],
  comment: 'جدول فئات الصلاحيات - Permission Categories Table'
});

export default PermissionCategory;