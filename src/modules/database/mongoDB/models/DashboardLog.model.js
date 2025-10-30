import mongoose from 'mongoose';

const dashboardLogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  feature: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'update',
      'delete',
      'enable',
      'disable',
      'activate',
      'deactivate',
      'configure',
      'reset'
    ]
  },
  date: {
    type: Date,
    default: Date.now
  },
  server_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    default: null
  },
  additional_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  strict: false // يسمح بإضافة حقول إضافية مثل باقي النماذج
});

// إنشاء indexes للبحث السريع
dashboardLogSchema.index({ server_id: 1 });
dashboardLogSchema.index({ feature: 1 });
dashboardLogSchema.index({ action: 1 });
dashboardLogSchema.index({ date: -1 });
dashboardLogSchema.index({ server_id: 1, date: -1 });
dashboardLogSchema.index({ user_id: 1, date: -1 }); // فهرس إضافي للمستخدم
dashboardLogSchema.index({ feature: 1, action: 1 }); // فهرس مركب للميزة والإجراء

const DashboardLog = mongoose.model('DashboardLog', dashboardLogSchema);

export default DashboardLog;