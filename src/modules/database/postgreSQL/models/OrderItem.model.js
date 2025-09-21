import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول عناصر الطلبات - OrderItem Model
 * يحتوي على تفاصيل المنتجات في كل طلب
 */
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف عنصر الطلب الفريد - Order Item ID'
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'اسم المنتج - Product Name'
  },
  variant_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'اسم متغير المنتج - Product Variant Name'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    },
    comment: 'الكمية المطلوبة - Quantity'
  },
  unit_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'سعر الوحدة - Unit Price'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'مبلغ الخصم على العنصر - Item Discount Amount'
  },
  total_price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'السعر الإجمالي للعنصر - Total Item Price'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بعنصر الطلب - Associated site identifier'
  },
  
  // معرف الطلب (Foreign Key) - Order ID
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'معرف الطلب المرتبط بالعنصر - Associated order identifier'
  },
  
  // معرف المنتج (Foreign Key) - Product ID
  product_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    comment: 'معرف المنتج المرتبط بالعنصر - Associated product identifier'
  },
  
  // معرف متغير المنتج (Foreign Key) - Product Variant ID
  product_variant_id: {
    type: DataTypes.STRING(15),
    allowNull: true,
    references: {
      model: 'product_variants',
      key: 'id'
    },
    comment: 'معرف متغير المنتج المرتبط بالعنصر - Associated product variant identifier'
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['product_variant_id']
    },
    {
      fields: ['created_at']
    }
  ],
  getterMethods: {
    // حساب السعر الإجمالي بعد الخصم
    finalPrice() {
      return parseFloat(this.total_price) - parseFloat(this.discount_amount || 0);
    },
    
    // التحقق من وجود خصم على العنصر
    hasDiscount() {
      return parseFloat(this.discount_amount || 0) > 0;
    },
    
    // حساب نسبة الخصم
    discountPercentage() {
      if (!this.hasDiscount()) return 0;
      const totalBeforeDiscount = parseFloat(this.unit_price) * parseInt(this.quantity);
      return ((parseFloat(this.discount_amount) / totalBeforeDiscount) * 100).toFixed(2);
    }
  },
  comment: 'جدول عناصر الطلبات - Order Items Table'
});

export default OrderItem;