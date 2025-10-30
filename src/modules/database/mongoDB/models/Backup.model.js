import mongoose from 'mongoose';

const backupSchema = new mongoose.Schema({
  server_id: {
    type: String,
    required: true
  },
  server_settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  channels: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  roles: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  created_by: {
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
// إنشاء indexes للبحث السريع
backupSchema.index({ server_id: 1 });
backupSchema.index({ created_at: -1 });
backupSchema.index({ server_id: 1, created_at: -1 });

const Backup = mongoose.model('Backup', backupSchema);
export default Backup;
