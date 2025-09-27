import mongoose from 'mongoose';

function generateFastId() {
  const timestamp = Date.now().toString(36); // base36 لأقصر طول
  const random = Math.random().toString(36).substr(2, 9);
  return (timestamp + random).substr(0, 24); // تأكد من ألا يزيد عن 24 حرف
}

// أو الأكثر أماناً مع أداء عالي
function generateSecureFastId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  const processId = (process.pid % 0xFFFF).toString(16).padStart(4, '0');
  return timestamp + random + processId; // 18 حرف
}

const userActivitiesSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: generateSecureFastId // استخدام الأسرع
  },
  user_id: {
    type: Number
  },
  user_type: {
    type: String,
    enum: ['customer', 'vendor', 'admin', 'guest'],
    default: 'customer'
  },
  activity_type: {
    type: String,
    required: true
  },
  activity_description: String,
  ip_address: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    default: 0
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  // إعدادات الأداء القصوى
  strict: false,           // إلغاء التحقق من الحقول
  validateBeforeSave: false, // إلغاء التحقق قبل الحفظ
  autoIndex: false,        // إلغاء إنشاء indexes تلقائي
  bufferCommands: false,   // إلغاء buffering للأوامر
  id: true,                // الاحتفاظ بـ virtual id إذا needed
  versionKey: false,       // إلغاء __v field
  minimize: false,         // للحفاظ على empty objects إذا needed
  
  // إعدادات الأداء الإضافية
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===== INDEXES =====
userActivitiesSchema.index({ user_id: 1, timestamp: -1 });
userActivitiesSchema.index({ activity_type: 1, timestamp: -1 });
userActivitiesSchema.index({ timestamp: -1 });
userActivitiesSchema.index({ ip_address: 1 });
userActivitiesSchema.index({ user_id: 1, activity_type: 1 });

// ===== VIRTUAL FIELDS =====
userActivitiesSchema.virtual('is_high_frequency').get(function() {
  return this.duration < 100; // أقل من 100ms يعتبر high frequency
});

// ===== STATICS =====
userActivitiesSchema.statics.insertBatch = function(activities) {
  return this.collection.insertMany(activities, {
    ordered: false,
    writeConcern: { w: 0 }
  });
};

userActivitiesSchema.statics.updateDuration = function(activityId, additionalDuration) {
  return this.collection.updateOne(
    { _id: activityId },
    { $inc: { duration: additionalDuration } },
    { w: 0 }
  );
};

// ===== PRE-HOOKS =====
userActivitiesSchema.pre('save', function(next) {
  // تحديث توقيت التعديل
  this.updatedAt = new Date();
  next();
});

// ===== POST-HOOKS =====
userActivitiesSchema.post('save', function() {
  // تنظيف الذاكرة إذا needed
  if (global.gc) global.gc();
});

const UserActivity = mongoose.model('UserActivity', userActivitiesSchema);

// ===== EXPORTS =====
export {
  UserActivity,
  generateFastId,
  generateSecureFastId
};

export default UserActivity;