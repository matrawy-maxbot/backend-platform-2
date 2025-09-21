import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  dark_mode: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'ar'
  },
  email_notifications: {
    type: Boolean,
    default: true
  },
  sms_notifications: {
    type: Boolean,
    default: false
  },
  offer_notifications: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  strict: false
});

// Indexes
userSettingsSchema.index({ user_id: 1 });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;