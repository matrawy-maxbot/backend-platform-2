import mongoose from 'mongoose';

const orderStatusHistorySchema = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending', 'confirmed', 'processing', 'shipped',
      'delivered', 'cancelled', 'refunded'
    ]
  },
  description: String,
  changed_by: Number, // user_id أو system
  notes: String // ملاحظات إضافية
}, {
  timestamps: true, // created_at, updated_at
  strict: false
});

// Indexes
orderStatusHistorySchema.index({ order_id: 1, created_at: -1 });
orderStatusHistorySchema.index({ status: 1 });
orderStatusHistorySchema.index({ order_id: 1, status: 1 });

const OrderStatusHistory = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);

export default OrderStatusHistory;