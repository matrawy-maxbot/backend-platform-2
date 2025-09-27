import mongoose from 'mongoose';

const productReviewsSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    required: true
  },
  images: [String], // صور مرفقة مع التقييم
  is_verified_purchase: {
    type: Boolean,
    default: false
  }, // من عملية شراء مؤكدة
  helpful_votes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
productReviewsSchema.index({ product_id: 1, rating: 1 });
// productReviewsSchema.index({ user_id: 1 }); // مكرر - user_id موجود في الفهرس المركب
productReviewsSchema.index({ product_id: 1, created_at: -1 });
productReviewsSchema.index({ is_verified_purchase: 1 });
productReviewsSchema.index({ status: 1 });

// لمنع تقييم مكرر لنفس المنتج من نفس المستخدم
productReviewsSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const ProductReviews = mongoose.model('ProductReviews', productReviewsSchema);

export default ProductReviews;