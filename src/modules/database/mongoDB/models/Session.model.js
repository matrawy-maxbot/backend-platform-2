import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  device_info: String,
  ip_address: String,
  expires_at: {
    type: Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

// Indexes
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ token: 1 });
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Session = mongoose.model('Session', sessionSchema);

export default Session;