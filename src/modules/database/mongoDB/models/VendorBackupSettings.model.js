import mongoose from 'mongoose';

const vendorBackupSettingsSchema = new mongoose.Schema({ 
  vendor_id: { 
    type: Number, 
    required: true, 
    unique: true
  }, 
  // الإعدادات العامة 
  auto_backup: { 
    type: Boolean, 
    default: true 
  }, 
  backup_frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'custom'], 
    default: 'daily' 
  }, 
  backup_time: { 
    type: String, 
    default: '02:00' 
  }, // توقيت النسخ 
  retention_period: { 
    type: Number, 
    default: 30 
  }, // عدد الأيام 
  max_backups: { 
    type: Number, 
    default: 10 
  }, // الحد الأقصى للنسخ 
  // إعدادات التخزين 
  storage: { 
    type: { 
      type: String, 
      enum: ['local', 's3', 'google_drive', 'dropbox', 'ftp'], 
      default: 'local' 
    }, 
    path: String, // للمحلي 
    bucket: String, // لـ S3 
    folder: String, // للسحابي 
    credentials: mongoose.Schema.Types.Mixed // بيانات الاعتماد 
  }, 
  // إعدادات الأداء 
  performance: { 
    compression_level: { 
      type: Number, 
      min: 1, 
      max: 9, 
      default: 6 
    }, 
    max_file_size: Number, // الحجم الأقصى للنسخة 
    split_files: { type: Boolean, default: false } 
  }, 
  // الإشعارات 
  notifications: { 
    on_success: { type: Boolean, default: true }, 
    on_failure: { type: Boolean, default: true }, 
    on_warning: { type: Boolean, default: true }, 
    email_notifications: [String] // قائمة البريد للإشعارات 
  }, 
  // الإعدادات المتقدمة 
  advanced: { 
    include_media: { type: Boolean, default: true }, 
    include_database: { type: Boolean, default: true }, 
    include_logs: { type: Boolean, default: false }, 
    backup_before_update: { type: Boolean, default: true } 
  }, 
  last_backup: { 
    date: Date, 
    status: String, 
    size: Number, 
    duration: Number // بالميلي ثانية 
  }, 
  next_backup: Date 
}, { 
  timestamps: true, 
  strict: false 
}); 

// Indexes 
// vendorBackupSettingsSchema.index({ vendor_id: 1 }); // مكرر - vendor_id معرف بـ unique: true
vendorBackupSettingsSchema.index({ 'storage.type': 1 }); 

const VendorBackupSettings = mongoose.model('VendorBackupSettings', vendorBackupSettingsSchema);

export default VendorBackupSettings;