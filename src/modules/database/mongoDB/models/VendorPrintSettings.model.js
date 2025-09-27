import mongoose from 'mongoose';

const vendorPrintSettingsSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
    unique: true
  },
  // إعدادات عامة
  general: {
    paper_size: {
      type: String,
      enum: ['A4', 'A5', 'Letter', 'Legal'],
      default: 'A4'
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait'
    },
    margin: {
      top: { type: Number, default: 10 },
      right: { type: Number, default: 10 },
      bottom: { type: Number, default: 10 },
      left: { type: Number, default: 10 }
    }
  },
  // إعدادات الفواتير
  invoice: {
    print_logo: {
      type: Boolean,
      default: true
    },
    print_company_info: {
      type: Boolean,
      default: true
    },
    print_customer_info: {
      type: Boolean,
      default: true
    },
    print_item_details: {
      type: Boolean,
      default: true
    },
    print_tax_details: {
      type: Boolean,
      default: true
    },
    print_payment_info: {
      type: Boolean,
      default: true
    },
    print_signature: {
      type: Boolean,
      default: false
    },
    footer_text: String
  },
  // إعدادات الطلبات
  order: {
    print_barcode: {
      type: Boolean,
      default: true
    },
    print_shipping_label: {
      type: Boolean,
      default: true
    },
    print_packing_slip: {
      type: Boolean,
      default: true
    }
  },
  // إعدادات التقارير
  report: {
    print_page_numbers: {
      type: Boolean,
      default: true
    },
    print_date: {
      type: Boolean,
      default: true
    },
    print_header: {
      type: Boolean,
      default: true
    },
    print_footer: {
      type: Boolean,
      default: true
    }
  },
  // تخصيص المحتوى
  custom_content: {
    header: String,
    footer: String,
    terms: String,
    notes: String
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
// vendorPrintSettingsSchema.index({ vendor_id: 1 }); // مكرر - vendor_id معرف بـ unique: true

const VendorPrintSettings = mongoose.model('VendorPrintSettings', vendorPrintSettingsSchema);

export default VendorPrintSettings;