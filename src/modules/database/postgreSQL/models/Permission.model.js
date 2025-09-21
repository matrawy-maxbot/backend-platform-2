import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الصلاحيات - Permission Model
 * يحتوي على الصلاحيات المختلفة التي يمكن منحها للأدوار
 */
const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف الصلاحية الفريد - Permission ID'
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[a-z_]+$/ // يتأكد أن الكود يحتوي على حروف صغيرة وشرطات سفلية فقط
    },
    comment: 'كود الصلاحية الفريد - Unique Permission Code'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم الصلاحية - Permission Name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف الصلاحية - Permission Description'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالصلاحية - Associated site identifier'
  },
  
  // معرف فئة الصلاحية (Foreign Key) - Category ID
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'permission_categories',
      key: 'id'
    },
    comment: 'معرف فئة الصلاحية - Permission Category ID'
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['code']
    },
    {
      fields: ['site_id', 'code'],
      unique: true,
      name: 'unique_site_permission_code'
    },
    {
      fields: ['name']
    },
    {
      fields: ['created_at']
    }
  ],
  comment: 'جدول الصلاحيات - Permissions Table'
});

export default Permission;