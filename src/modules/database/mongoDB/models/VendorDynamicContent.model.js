import mongoose from 'mongoose';

const vendorDynamicContentSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true,
    index: true
  },
  homepage_banners: [{
    image_url: { type: String, required: true },
    target_url: String,
    title: String,
    description: String,
    is_active: { type: Boolean, default: true },
    sort_order: { type: Number, default: 0 }
  }],
  custom_categories: [{
    name: { type: String, required: true },
    subcategories: [String],
    image_url: String,
    is_active: { type: Boolean, default: true }
  }],
  featured_products: [Number], // product_ids
  promotional_sections: [{
    title: String,
    products: [Number], // product_ids
    layout_type: String, // grid, slider, etc.
    is_active: Boolean
  }],
  social_links: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
vendorDynamicContentSchema.index({ vendor_id: 1 }, { unique: true });
vendorDynamicContentSchema.index({ 'homepage_banners.is_active': 1 });

const VendorDynamicContent = mongoose.model('VendorDynamicContent', vendorDynamicContentSchema);

export default VendorDynamicContent;