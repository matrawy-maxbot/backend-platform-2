import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول موظفي الموقع - Staff User Model
 * يربط المستخدمين بالمواقع والأدوار المخصصة لهم
 */
const StaffUser = sequelize.define('StaffUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف موظف الموقع الفريد - Staff User ID'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالموظف - Associated site identifier'
  },
  
  // معرف الدور (Foreign Key) - Role ID
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'roles',
      key: 'id'
    },
    comment: 'معرف الدور المخصص للموظف - Assigned role identifier'
  },
  
  // معرف المستخدم (Foreign Key) - User ID
  user_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'معرف المستخدم المرتبط بالموظف - Associated user identifier'
  }
}, {
  tableName: 'staff_users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['role_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['site_id', 'user_id'],
      unique: true,
      name: 'unique_site_user'
    },
    {
      fields: ['created_at']
    }
  ],
  comment: 'جدول موظفي المواقع - Staff Users Table'
});

export default StaffUser;