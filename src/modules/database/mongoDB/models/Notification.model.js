import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    default: 'in_app'
  },
  is_read: {
    type: Boolean,
    default: false
  },
  related_entity: String, // order, product, etc.
  related_entity_id: Number,
  action_url: String // رابط للإجراء
}, {
  timestamps: true,
  strict: false
});

// Indexes
notificationSchema.index({ user_id: 1, is_read: 1 });
notificationSchema.index({ created_at: -1 });
notificationSchema.index({ user_id: 1, created_at: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;