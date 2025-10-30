import mongoose from 'mongoose';

const autoReplySchema = new mongoose.Schema({
  server_id: {
    type: String,
    required: true
  },
  reply_name: {
    type: String,
    required: true
  },
  triggers: {
    type: [String],
    default: []
  },
  responses: {
    type: [String],
    default: []
  },
  channels: {
    type: [String],
    default: []
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

// إنشاء indexes للبحث السريع
autoReplySchema.index({ server_id: 1 });

const AutoReply = mongoose.model('AutoReply', autoReplySchema);

AutoReply.find({ server_id: '123456789012345678' }, {});

export default AutoReply;