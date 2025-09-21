import mongoose from 'mongoose';

const vendorCompanySettingsSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  company_name: {
    type: String,
    required: true
  },
  tax_number: String,
  commercial_registration: String,
  phone: String,
  email: String,
  address: {
    country: String,
    city: String,
    street: String,
    building: String,
    apartment: String,
    postal_code: String
  },
  invoice_settings: {
    prefix: { type: String, default: 'INV-' },
    next_number: { type: Number, default: 1 },
    terms: String,
    due_days: { type: Number, default: 30 }
  },
  order_settings: {
    prefix: { type: String, default: 'ORD-' },
    next_number: { type: Number, default: 1 }
  },
  tax_settings: {
    enabled: { type: Boolean, default: true },
    percentage: { type: Number, default: 14 },
    tax_number: String
  },
  currency_settings: {
    code: { type: String, default: 'EGP' },
    symbol: { type: String, default: 'ج.م' },
    position: { type: String, default: 'right' } // left, right
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
vendorCompanySettingsSchema.index({ vendor_id: 1 });
vendorCompanySettingsSchema.index({ 'address.country': 1 });

const VendorCompanySettings = mongoose.model('VendorCompanySettings', vendorCompanySettingsSchema);

export default VendorCompanySettings;