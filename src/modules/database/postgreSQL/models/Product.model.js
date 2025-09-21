import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول المنتجات - Product Model
 * يحتوي على معلومات المنتجات الأساسية
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    defaultValue: () => {
        // إنشاء ID فريد: آخر 8 أرقام من timestamp + 4 أرقام عشوائية
        const timestamp = new Date().getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 8999 + 1000).toString();
        return timestamp + random;
    },
    comment: 'معرف المنتج الفريد - Product ID'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم المنتج - Product Name'
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9-]+$/
    },
    comment: 'الرابط المختصر للمنتج - Product Slug'
  },
  main_image_url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: true
    },
    comment: 'رابط الصورة الرئيسية للمنتج - Main Image URL'
  },
  base_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'السعر الأساسي للمنتج - Base Price'
  },
  discount_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'نسبة الخصم - Discount Percentage'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'وصف المنتج - Product Description'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'حالة تفعيل المنتج - Product Active Status'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالمنتج - Associated site identifier'
  },
  
  // معرف البائع (Foreign Key) - Vendor ID
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendors',
      key: 'id'
    },
    comment: 'معرف البائع المرتبط بالمنتج - Associated vendor identifier'
  },
  
  // معرف الفئة (Foreign Key) - Category ID
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'معرف الفئة المرتبطة بالمنتج - Associated category identifier'
  }
}, {
  tableName: 'products',
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
      fields: ['base_price']
    },
    {
      fields: ['created_at']
    }
  ],
  getterMethods: {
    finalPrice() {
      return this.base_price * (1 - this.discount_percentage / 100);
    }
  },
  comment: 'جدول المنتجات - Products Table'
});

export default Product;