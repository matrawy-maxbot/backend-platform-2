import mongoose from 'mongoose';

const auditTrailsSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  user_type: {
    type: String,
    enum: ['admin', 'vendor', 'customer', 'system'],
    required: true
  },
  action: {
    type: String,
    required: true
  }, // create, update, delete, etc.
  entity_type: {
    type: String,
    required: true
  }, // product, order, user, etc.
  entity_id: Number,
  entity_name: String,
  old_value: mongoose.Schema.Types.Mixed,
  new_value: mongoose.Schema.Types.Mixed,
  changes: [{
    field: String,
    old_value: mongoose.Schema.Types.Mixed,
    new_value: mongoose.Schema.Types.Mixed
  }],
  ip_address: String,
  user_agent: String,
  reason: String // سبب التعديل إن وجد
}, {
  timestamps: true,
  strict: false
});

// Indexes
auditTrailsSchema.index({ user_id: 1, created_at: -1 });
auditTrailsSchema.index({ entity_type: 1, entity_id: 1 });
auditTrailsSchema.index({ action: 1 });
auditTrailsSchema.index({ created_at: -1 });

const AuditTrails = mongoose.model('AuditTrails', auditTrailsSchema);

export default AuditTrails;