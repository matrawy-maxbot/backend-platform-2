import mongoose from 'mongoose';

const vendorNotificationSettingsSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  // إشعارات المخزون
  inventory_notifications: {
    low_stock: {
      type: Boolean,
      default: true
    },
    low_stock_threshold: {
      type: Number,
      default: 5
    },
    out_of_stock: {
      type: Boolean,
      default: true
    },
    stock_replenished: {
      type: Boolean,
      default: true
    }
  },
  // إشعارات الطلبات
  order_notifications: {
    new_order: {
      type: Boolean,
      default: true
    },
    order_status_change: {
      type: Boolean,
      default: true
    },
    order_cancelled: {
      type: Boolean,
      default: true
    },
    order_refunded: {
      type: Boolean,
      default: true
    }
  },
  // إشعارات العملاء
  customer_notifications: {
    new_customer: {
      type: Boolean,
      default: true
    },
    customer_review: {
      type: Boolean,
      default: true
    },
    customer_support: {
      type: Boolean,
      default: true
    }
  },
  // طرق الإشعار
  notification_methods: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    },
    in_app: {
      type: Boolean,
      default: true
    }
  },
  // إعدادات البريد الإلكتروني
  email_settings: {
    sender_name: String,
    sender_email: String,
    reply_to: String
  },
  // قوالب الإشعارات
  notification_templates: mongoose.Schema.Types.Mixed
}, {
  timestamps: true,
  strict: false
});

// Indexes
vendorNotificationSettingsSchema.index({ vendor_id: 1 });

const VendorNotificationSettings = mongoose.model('VendorNotificationSettings', vendorNotificationSettingsSchema);

export default VendorNotificationSettings;