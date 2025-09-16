import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الترحيب (Welcome)
 * يحتوي على إعدادات الترحيب والتخطيط للخوادم
 */
const Welcome = sequelize.define('Welcome', {
  guild_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
    comment: 'معرف الخادم/الجيلد'
  },
  i_top: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الصورة من الأعلى'
  },
  i_left: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الصورة من اليسار'
  },
  i_width: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'عرض الصورة'
  },
  i_height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'ارتفاع الصورة'
  },
  b_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'رابط الخلفية'
  },
  b_x: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الخلفية على المحور X'
  },
  b_y: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الخلفية على المحور Y'
  },
  b_width: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'عرض الخلفية'
  },
  b_height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'ارتفاع الخلفية'
  },
  a_x: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الأفاتار على المحور X'
  },
  a_y: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'موضع الأفاتار على المحور Y'
  },
  a_width: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'عرض الأفاتار'
  },
  a_height: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'ارتفاع الأفاتار'
  },
  a_style: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'نمط الأفاتار'
  },
  a_radius: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    defaultValue: 0,
    comment: 'نصف قطر الأفاتار'
  },
  a_rotate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null,
    comment: 'زاوية دوران الأفاتار'
  },
  a_border_width: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    defaultValue: null,
    comment: 'عرض حدود الأفاتار'
  },
  a_border_color: {
    type: DataTypes.STRING(30),
    allowNull: true,
    defaultValue: null,
    comment: 'لون حدود الأفاتار'
  },
  a_border_style: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null,
    comment: 'نمط حدود الأفاتار'
  },
  text_array: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: 'مصفوفة النصوص'
  }
}, {
  tableName: 'welcome',
  timestamps: true, // إضافة createdAt و updatedAt تلقائياً
  indexes: [
    {
      unique: true,
      fields: ['guild_id'] // فهرس فريد على معرف الخادم
    }
  ],
  comment: 'جدول الترحيب - يحتوي على إعدادات الترحيب والتخطيط للخوادم'
});

export default Welcome;