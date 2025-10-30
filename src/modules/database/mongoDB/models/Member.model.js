import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  server_id: {
    type: String,
    required: true,
    unique: true
  },
  welcome_message: {
    type: Boolean,
    default: false
  },
  welcome_message_content: {
    type: String,
    default: 'Welcome (user) to (server)! 🌬',
    maxlength: 500
  },
  welcome_message_channel: {
    type: String,
    default: null
  },
  welcome_image: {
    type: Boolean,
    default: false
  },
  leave_message: {
    type: Boolean,
    default: false
  },
  leave_message_content: {
    type: String,
    default: 'Goodbye (user), hope to see you soon!',
    maxlength: 500
  },
  leave_message_channel: {
    type: String,
    default: null
  },
  auto_role: {
    type: Boolean,
    default: false
  },
  auto_role_channel: {
    type: String,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
