import mongoose from 'mongoose';

const vendorBackupsSchema = new mongoose.Schema({ 
  vendor_id: { 
    type: Number, 
    required: true 
  }, 
  backup_name: { 
    type: String, 
    required: true 
  }, 
  backup_type: { 
    type: String, 
    enum: ['auto', 'manual', 'system'], 
    default: 'manual' 
  }, 
  backup_scope: { 
    type: String, 
    enum: ['full', 'partial', 'database', 'files'], 
    default: 'full' 
  }, 
  file_path: { 
    type: String, 
    required: true 
  }, 
  file_size: { 
    type: Number, 
    default: 0 
  }, // بالبايت 
  compression_type: { 
    type: String, 
    enum: ['zip', 'tar', 'gzip', 'none'], 
    default: 'zip' 
  }, 
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'failed', 'deleted'], 
    default: 'pending' 
  }, 
  encryption: { 
    enabled: { type: Boolean, default: false }, 
    method: String 
  }, 
  checksum: String, 
  included_tables: [String], // للنسخ الجزئية 
  excluded_tables: [String], // للنسخ الجزئية 
  error_message: String, 
  metadata: mongoose.Schema.Types.Mixed 
}, { 
  timestamps: true, 
  strict: false 
}); 

// Indexes 
vendorBackupsSchema.index({ vendor_id: 1, created_at: -1 }); 
vendorBackupsSchema.index({ status: 1 }); 
vendorBackupsSchema.index({ backup_type: 1 }); 
// vendorBackupsSchema.index({ vendor_id: 1, status: 1 }); 

const VendorBackups = mongoose.model('VendorBackups', vendorBackupsSchema);

export default VendorBackups;