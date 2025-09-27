import mongoose from 'mongoose';

const vendorSettingsSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
    unique: true
  },
  business_type: {
    type: String,
    enum: ['clothing', 'electronics', 'food', 'furniture', 'other'],
    required: true
  },
  shipping_policy: String,
  return_policy: String,
  theme_color: {
    type: String,
    default: '#3B82F6'
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  timezone: {
    type: String,
    default: 'Africa/Cairo'
  },
  business_hours: {
    sunday: { open: String, close: String },
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String }
  },
  social_media: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
// vendorSettingsSchema.index({ vendor_id: 1 }); // مكرر - vendor_id معرف بـ unique: true
vendorSettingsSchema.index({ business_type: 1 });

const VendorSettings = mongoose.model('VendorSettings', vendorSettingsSchema);

export default VendorSettings;