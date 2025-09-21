import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول متغيرات المنتج - ProductVariant Model
 * يحتوي على الخيارات المختلفة للمنتج الواحد (مثل الألوان، الأحجام، إلخ)
 */
const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    defaultValue: () => {
        // إنشاء ID فريد: آخر 8 أرقام من timestamp + 4 أرقام عشوائية
        const timestamp = new Date().getTime().toString().slice(-8);
        const random = Math.floor(Math.random() * 8999 + 1000).toString();
        return timestamp + random;
    },
    comment: 'معرف متغير المنتج الفريد - Product Variant ID'
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    },
    comment: 'رمز المنتج الفريد - Stock Keeping Unit'
  },
  variant_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم متغير المنتج - Variant Name'
  },
  price_adjustment: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    comment: 'تعديل السعر للمتغير - Price Adjustment'
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'رابط صورة المتغير - Variant Image URL'
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'هل هذا المتغير الافتراضي - Is Default Variant'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'ترتيب المتغير - Sort Order'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بمتغير المنتج - Associated site identifier'
  },
  
  // معرف المنتج (Foreign Key) - Product ID
  product_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    comment: 'معرف المنتج المرتبط بالمتغير - Associated product identifier'
  }
}, {
  tableName: 'product_variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['sku']
    },
    {
      fields: ['is_default']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['created_at']
    }
  ],
  getterMethods: {
    finalPrice() {
      // سعر المنتج الأساسي + تعديل السعر للفاريانت
      return this.Product ? this.Product.base_price + this.price_adjustment : 0;
    }
  },
  comment: 'جدول متغيرات المنتجات - Product Variants Table'
});

export default ProductVariant;