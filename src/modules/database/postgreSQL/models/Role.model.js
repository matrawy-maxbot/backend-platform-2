import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الأدوار - Role Model
 * يحتوي على أدوار المستخدمين والصلاحيات المرتبطة بها
 */
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف الدور الفريد - Role ID'
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم الدور - Role Name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف الدور - Role Description'
  },
  permissions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    validate: {
      isValidPermissions(value) {
        if (typeof value !== 'object' || Array.isArray(value)) {
          throw new Error('Permissions must be a JSON object');
        }
      }
    },
    comment: 'صلاحيات الدور بصيغة JSON - Role Permissions in JSON format'
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'هل هذا الدور افتراضي - Is Default Role'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'حالة تفعيل الدور - Role Active Status'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالدور - Associated site identifier'
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['is_default']
    },
    {
      fields: ['name']
    },
    {
      fields: ['created_at']
    }
  ],
  getterMethods: {
    hasPermission(permissionCode) {
      return this.permissions && this.permissions[permissionCode] === true;
    }
  },
  comment: 'جدول الأدوار - Roles Table'
});

export default Role;