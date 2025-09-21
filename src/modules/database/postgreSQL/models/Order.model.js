import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول الطلبات - Order Model
 * يحتوي على معلومات الطلبات الأساسية
 */
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف الطلب الفريد - Order ID'
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: 'رقم الطلب الفريد - Unique Order Number'
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    ),
    defaultValue: 'pending',
    comment: 'حالة الطلب - Order Status'
  },
  subtotal_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'المبلغ الفرعي قبل الخصم والضرائب - Subtotal Amount'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'مبلغ الخصم - Discount Amount'
  },
  tax_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'مبلغ الضريبة - Tax Amount'
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    validate: {
      min: 0
    },
    comment: 'مبلغ الشحن - Shipping Amount'
  },
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'المبلغ الإجمالي - Total Amount'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'ملاحظات الطلب - Order Notes'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالطلب - Associated site identifier'
  },
  
  // معرف المستخدم (Foreign Key) - User ID
  user_id: {
    type: DataTypes.STRING(15),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'معرف المستخدم المرتبط بالطلب - Associated user identifier'
  },
  
  // معرف عنوان الشحن (Foreign Key) - Shipping Address ID
  shipping_address_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    },
    comment: 'معرف عنوان الشحن - Shipping address identifier'
  },
  
  // معرف عنوان الفوترة (Foreign Key) - Billing Address ID
  billing_address_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    },
    comment: 'معرف عنوان الفوترة - Billing address identifier'
  },
  
  // معرف الكوبون (Foreign Key) - Coupon ID
  coupon_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'coupons',
      key: 'id'
    },
    comment: 'معرف كوبون الخصم المستخدم - Used coupon identifier'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['site_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['order_number']
    },
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['shipping_address_id']
    },
    {
      fields: ['billing_address_id']
    },
    {
      fields: ['coupon_id']
    }
  ],
  getterMethods: {
    canBeCancelled() {
      return ['pending', 'confirmed', 'processing'].includes(this.status);
    },
    canBeRefunded() {
      return ['delivered', 'shipped'].includes(this.status);
    }
  },
  comment: 'جدول الطلبات - Orders Table'
});

export default Order;