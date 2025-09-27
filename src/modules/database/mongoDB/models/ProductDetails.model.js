import mongoose from 'mongoose';

const productDetailsSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
    unique: true
  },
  vendor_id: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  additional_images: [String], // مصفوفة للصور الإضافية
  specifications: {
    type: Map,
    of: String // مواصفات مرنة {brand: "Samsung", color: "Black"}
  },
  features: [String], // مميزات المنتج
  tags: [String], // كلمات دلالية
  seo_data: {
    meta_title: String,
    meta_description: String,
    slug: String
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  warranty_info: String
}, {
  timestamps: true,
  strict: false
});

// Indexes
// productDetailsSchema.index({ product_id: 1 }); // مكرر - product_id معرف بـ unique: true
productDetailsSchema.index({ vendor_id: 1 });
productDetailsSchema.index({ tags: 1 }); // للبحث بالكلمات الدلالية
productDetailsSchema.index({ 'specifications.brand': 1 }); // للبحث بالماركة

const ProductDetails = mongoose.model('ProductDetails', productDetailsSchema);

export default ProductDetails;