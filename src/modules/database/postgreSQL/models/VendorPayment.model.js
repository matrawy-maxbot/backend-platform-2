import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

/**
 * نموذج جدول مدفوعات البائعين - VendorPayment Model
 * يحتوي على معلومات المدفوعات الخاصة باشتراكات البائعين
 */
const VendorPayment = sequelize.define('VendorPayment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'معرف الدفعة الفريد - Payment ID'
    },
    site_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendor_site_settings',
            key: 'id'
        },
        comment: 'معرف الموقع المرتبط بالدفعة - Associated site identifier'
    },
    vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendors',
            key: 'id'
        },
        comment: 'معرف البائع المرتبط بالدفعة - Associated vendor identifier'
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vendor_subscriptions',
            key: 'id'
        },
        comment: 'معرف الاشتراك المرتبط بالدفعة - Associated subscription identifier'
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        comment: 'مبلغ الدفعة - Payment amount'
    },
    payment_method: {
        type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'wallet'),
        allowNull: false,
        comment: 'طريقة الدفع - Payment method'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        comment: 'معرف المعاملة الفريد - Unique transaction identifier'
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        comment: 'حالة الدفعة - Payment status'
    },
    currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'USD',
        comment: 'عملة الدفعة - Payment currency'
    },
    gateway_response: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'استجابة بوابة الدفع - Payment gateway response'
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'تاريخ إتمام الدفعة - Payment completion date'
    }
}, {
    tableName: 'vendor_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['site_id']
        },
        {
            fields: ['vendor_id']
        },
        {
            fields: ['subscription_id']
        },
        {
            fields: ['transaction_id']
        },
        {
            fields: ['payment_status']
        },
        {
            fields: ['paid_at']
        },
        {
            fields: ['payment_method']
        },
        {
            fields: ['currency']
        }
    ],
    comment: 'جدول مدفوعات البائعين - Vendor Payments Table'
});

// Instance method للتحقق من نجاح الدفعة
VendorPayment.prototype.isSuccessful = function() {
    return this.payment_status === 'completed';
};

// Instance method للتحقق من فشل الدفعة
VendorPayment.prototype.isFailed = function() {
    return this.payment_status === 'failed';
};

// Instance method للتحقق من حالة الانتظار
VendorPayment.prototype.isPending = function() {
    return ['pending', 'processing'].includes(this.payment_status);
};

// Instance method لتحديث حالة الدفعة
VendorPayment.prototype.updateStatus = function(status, paidAt = null) {
    this.payment_status = status;
    if (status === 'completed' && paidAt) {
        this.paid_at = paidAt;
    }
    return this.save();
};

// Instance method للحصول على معلومات الدفعة المنسقة
VendorPayment.prototype.getFormattedAmount = function() {
    return `${this.amount} ${this.currency}`;
};

export default VendorPayment;