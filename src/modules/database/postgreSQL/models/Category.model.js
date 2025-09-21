import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الفئات - Category Model
 * يحتوي على فئات المنتجات والخدمات
 */
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف الفئة الفريد - Category ID'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم الفئة - Category Name'
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9-]+$/ // يتأكد أن الـslug يحتوي على حروف صغيرة وأرقام وشرطات فقط
    },
    comment: 'الرابط المختصر للفئة - Category Slug'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف الفئة - Category Description'
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'رابط صورة الفئة - Category Image URL'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'ترتيب الفئة - Sort Order'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'حالة تفعيل الفئة - Category Active Status'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالفئة - Associated site identifier'
  },
  
  // معرف الفئة الأب (Foreign Key) - Parent Category ID
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'معرف الفئة الأب للفئات الفرعية - Parent category identifier for subcategories'
  }
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['created_at']
    }
  ],
  comment: 'جدول الفئات - Categories Table'
});

export default Category;