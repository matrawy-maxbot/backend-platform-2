import Joi from 'joi';

/**
 * مخطط التحقق من إنشاء سجل كتم صوت جديد
 */
export const createMuteVoiceSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'معرف السجل يجب أن يكون نص',
    'any.required': 'معرف السجل مطلوب'
  }),
  mutes: Joi.string().allow(null).optional().messages({
    'string.base': 'بيانات الكتم يجب أن تكون نص'
  })
});

/**
 * مخطط التحقق من تحديث سجل كتم صوت
 */
export const updateMuteVoiceSchema = Joi.object({
  id: Joi.string().optional().messages({
    'string.base': 'معرف السجل يجب أن يكون نص'
  }),
  mutes: Joi.string().allow(null).optional().messages({
    'string.base': 'بيانات الكتم يجب أن تكون نص'
  })
}).min(1).messages({
  'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
});

/**
 * مخطط التحقق من تحديث بيانات الكتم الصوتي فقط
 */
export const updateMuteDataSchema = Joi.object({
  mutes: Joi.string().required().messages({
    'string.base': 'بيانات الكتم يجب أن تكون نص',
    'any.required': 'بيانات الكتم مطلوبة'
  })
});

/**
 * مخطط التحقق من الحصول على سجل كتم صوت بالمعرف
 */
export const getMuteVoiceByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'معرف السجل يجب أن يكون نص',
    'any.required': 'معرف السجل مطلوب'
  })
});

/**
 * مخطط التحقق من البحث في سجلات كتم الصوت
 */
export const searchMuteVoicesSchema = Joi.object({
  searchTerm: Joi.string().min(1).required().messages({
    'string.base': 'مصطلح البحث يجب أن يكون نص',
    'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
    'any.required': 'مصطلح البحث مطلوب'
  })
});

/**
 * مخطط التحقق من إضافة أو تحديث بيانات كتم صوتي
 */
export const addOrUpdateMuteDataSchema = Joi.object({
  mutes: Joi.string().required().messages({
    'string.base': 'بيانات الكتم يجب أن تكون نص',
    'any.required': 'بيانات الكتم مطلوبة'
  })
});

/**
 * دالة التحقق من إنشاء سجل كتم صوت جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateCreateMuteVoice = (req, res, next) => {
  const { error } = createMuteVoiceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

/**
 * دالة التحقق من تحديث سجل كتم صوت
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateUpdateMuteVoice = (req, res, next) => {
  const { error } = updateMuteVoiceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

/**
 * دالة التحقق من تحديث بيانات الكتم الصوتي
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateUpdateMuteData = (req, res, next) => {
  const { error } = updateMuteDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

/**
 * دالة التحقق من معرف السجل
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateMuteVoiceId = (req, res, next) => {
  const { error } = getMuteVoiceByIdSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

/**
 * دالة التحقق من مصطلح البحث
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateSearchTerm = (req, res, next) => {
  const { error } = searchMuteVoicesSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

/**
 * دالة التحقق من إضافة أو تحديث بيانات كتم صوتي
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 * @param {Function} next - الدالة التالية
 */
export const validateAddOrUpdateMuteData = (req, res, next) => {
  const { error } = addOrUpdateMuteDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};