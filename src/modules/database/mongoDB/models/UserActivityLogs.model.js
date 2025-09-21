import mongoose from 'mongoose';

const userActivityLogsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  activity_type: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'view_product', 'add_to_cart',
      'remove_from_cart', 'add_to_wishlist', 'place_order',
      'update_profile', 'change_password', 'contact_support'
    ]
  },
  ip_address: String,
  user_agent: String,
  device_type: String, // mobile, desktop, tablet
  browser: String,
  os: String,
  location: {
    country: String,
    city: String,
    region: String
  },
  related_entity: String, // product, order, etc.
  related_entity_id: Number,
  metadata: mongoose.Schema.Types.Mixed // بيانات إضافية
}, {
  timestamps: true,
  strict: false
});

// Indexes
userActivityLogsSchema.index({ user_id: 1, created_at: -1 });
userActivityLogsSchema.index({ activity_type: 1 });
userActivityLogsSchema.index({ created_at: -1 });
userActivityLogsSchema.index({ 'location.country': 1 });

const UserActivityLogs = mongoose.model('UserActivityLogs', userActivityLogsSchema);

export default UserActivityLogs;