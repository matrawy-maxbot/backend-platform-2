import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  product_id: {
    type: Number,
    required: true
  },
  variant_id: Number,
  added_at: {
    type: Date,
    default: Date.now
  }
}, {
  strict: false
});

// Compound index لمنع تكرار المنتج لنفس المستخدم
wishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });
wishlistSchema.index({ user_id: 1, variant_id: 1 });
wishlistSchema.index({ added_at: -1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;