import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول المدفوعات - Payment Model
 * يحتوي على معلومات المدفوعات والمعاملات المالية
 */
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'معرف الدفعة الفريد - Payment ID'
  },
  payment_method: {
    type: DataTypes.ENUM(
      'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'
    ),
    allowNull: false,
    comment: 'طريقة الدفع - Payment Method'
  },
  payment_status: {
    type: DataTypes.ENUM(
      'pending', 'processing', 'completed', 'failed', 'refunded'
    ),
    defaultValue: 'pending',
    comment: 'حالة الدفع - Payment Status'
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    comment: 'مبلغ الدفع - Payment Amount'
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'معرف المعاملة من بوابة الدفع - Transaction ID from Payment Gateway'
  },
  gateway_response: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'استجابة بوابة الدفع - Payment Gateway Response'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'ملاحظات الدفع - Payment Notes'
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'تاريخ ووقت الدفع - Payment Date and Time'
  },
  
  // معرف الموقع (Foreign Key) - Site ID
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'vendor_site_settings',
      key: 'id'
    },
    comment: 'معرف الموقع المرتبط بالدفع - Associated site identifier'
  },
  
  // معرف الطلب (Foreign Key) - Order ID
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'معرف الطلب المرتبط بالدفع - Associated order identifier'
  }
}, {
  tableName: 'payments',
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
      fields: ['transaction_id']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['payment_method']
    },
    {
      fields: ['paid_at']
    },
    {
      fields: ['created_at']
    }
  ],
  getterMethods: {
    // التحقق من نجاح الدفع
    isSuccessful() {
      return this.payment_status === 'completed';
    },
    
    // التحقق من إمكانية الاسترداد
    canBeRefunded() {
      return this.payment_status === 'completed' && this.paid_at;
    },
    
    // التحقق من فشل الدفع
    isFailed() {
      return this.payment_status === 'failed';
    },
    
    // التحقق من حالة الانتظار
    isPending() {
      return ['pending', 'processing'].includes(this.payment_status);
    },
    
    // الحصول على اسم طريقة الدفع بالعربية
    getPaymentMethodName() {
      const methods = {
        'credit_card': 'بطاقة ائتمان',
        'debit_card': 'بطاقة خصم',
        'paypal': 'باي بال',
        'bank_transfer': 'تحويل بنكي',
        'cash_on_delivery': 'الدفع عند الاستلام'
      };
      return methods[this.payment_method] || this.payment_method;
    },
    
    // الحصول على اسم حالة الدفع بالعربية
    getPaymentStatusName() {
      const statuses = {
        'pending': 'في الانتظار',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل',
        'failed': 'فاشل',
        'refunded': 'مسترد'
      };
      return statuses[this.payment_status] || this.payment_status;
    }
  },
  comment: 'جدول المدفوعات - Payments Table'
});

export default Payment;