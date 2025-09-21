import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج إعدادات موقع البائع - VendorSiteSetting Model
 * يحتوي على إعدادات التخصيص والمظهر لموقع البائع
 */
const VendorSiteSetting = sequelize.define('VendorSiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف إعدادات الموقع الفريد - Site Settings ID'
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendors',
      key: 'id'
    },
    comment: 'معرف البائع - Vendor ID'
  },
  site_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'نوع الموقع - Site Type'
  },
  theme_color: {
    type: DataTypes.STRING(20),
    defaultValue: '#3B82F6',
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ // يتأكد انه لون hex صحيح
    },
    comment: 'لون القالب الأساسي - Theme Color'
  },
  logo_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'رابط شعار الموقع - Logo URL'
  },
  banner_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'رابط بانر الموقع - Banner URL'
  },
  custom_domain: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      // Custom validator للدومين
      isDomain(value) {
        if (value && !/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/.test(value)) {
          throw new Error('يجب أن يكون الدومين صحيحاً - Domain must be valid');
        }
      }
    },
    comment: 'الدومين المخصص - Custom Domain'
  },
  is_custom_domain_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'حالة تأكيد الدومين المخصص - Custom Domain Verification Status'
  },
  site_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'عنوان الموقع - Site Title'
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف الموقع للمحركات البحث - Meta Description'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'حالة تفعيل الموقع - Site Active Status'
  },
  maintenance_mode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'وضع الصيانة - Maintenance Mode'
  }
}, {
  tableName: 'vendor_site_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['vendor_id']
    },
    {
      fields: ['custom_domain']
    },
    {
      fields: ['site_type']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['maintenance_mode']
    }
  ],
  comment: 'جدول إعدادات مواقع البائعين - Vendor Site Settings Table'
});

export default VendorSiteSetting;