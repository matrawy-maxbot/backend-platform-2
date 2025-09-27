import mongoose from 'mongoose';

const vendorActivitiesSchema = new mongoose.Schema({
  vendor_id: {
    type: Number,
    required: true
  },
  activity_type: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'add_product', 'update_product',
      'delete_product', 'new_order', 'update_order',
      'update_settings', 'payment_received'
    ]
  },
  description: String,
  ip_address: String,
  user_agent: String,
  related_entity: String, // product, order, etc.
  related_entity_id: Number,
  metadata: mongoose.Schema.Types.Mixed // بيانات إضافية مرنة
}, {
  timestamps: true,
  strict: false
});

// Indexes
vendorActivitiesSchema.index({ vendor_id: 1, created_at: -1 });
vendorActivitiesSchema.index({ activity_type: 1 });
// vendorActivitiesSchema.index({ vendor_id: 1, activity_type: 1 });
vendorActivitiesSchema.index({ created_at: -1 }); // للتقارير

const VendorActivities = mongoose.model('VendorActivities', vendorActivitiesSchema);

export default VendorActivities;