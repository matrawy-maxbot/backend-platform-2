import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  server_id: {
    type: String,
    required: true
  },
  member_join_leave: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  role_changes: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  kick_ban: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  channel_changes: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  member_updates: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  message_changes: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  },
  server_settings: {
    enabled: {
      type: Boolean,
      default: false
    },
    channel_id: {
      type: String,
      default: null
    }
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

// إنشاء indexes للبحث السريع
logSchema.index({ server_id: 1 }, { unique: true }); // فهرس فريد لضمان سجل واحد لكل خادم

const Log = mongoose.model('Log', logSchema);

export default Log;