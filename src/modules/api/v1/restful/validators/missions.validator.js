import Joi from 'joi';

// Schema لإنشاء مهمة جديدة
export const createMissionSchema = Joi.object({
  chat_points: Joi.number().integer().min(0).required().messages({
    'number.base': 'نقاط الدردشة يجب أن تكون رقماً',
    'number.integer': 'نقاط الدردشة يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الدردشة يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'نقاط الدردشة مطلوبة'
  }),
  voice_points: Joi.number().integer().min(0).required().messages({
    'number.base': 'نقاط الصوت يجب أن تكون رقماً',
    'number.integer': 'نقاط الصوت يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الصوت يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'نقاط الصوت مطلوبة'
  }),
  passed_missions: Joi.string().allow('', null).optional().messages({
    'string.base': 'المهام المكتملة يجب أن تكون نصاً'
  }),
  active_mission: Joi.string().allow('', null).optional().messages({
    'string.base': 'المهمة النشطة يجب أن تكون نصاً'
  }),
  crown_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت التاج يجب أن تكون قيمة منطقية'
  }),
  diamond_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت الماس يجب أن تكون قيمة منطقية'
  }),
  star_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت النجمة يجب أن تكون قيمة منطقية'
  }),
  support_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت الدعم يجب أن تكون قيمة منطقية'
  }),
  programmer_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت المبرمج يجب أن تكون قيمة منطقية'
  }),
  youtube_rewards: Joi.boolean().default(false).messages({
    'boolean.base': 'مكافآت اليوتيوب يجب أن تكون قيمة منطقية'
  })
});

// Schema لتحديث مهمة
export const updateMissionSchema = Joi.object({
  chat_points: Joi.number().integer().min(0).optional().messages({
    'number.base': 'نقاط الدردشة يجب أن تكون رقماً',
    'number.integer': 'نقاط الدردشة يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الدردشة يجب أن تكون أكبر من أو تساوي 0'
  }),
  voice_points: Joi.number().integer().min(0).optional().messages({
    'number.base': 'نقاط الصوت يجب أن تكون رقماً',
    'number.integer': 'نقاط الصوت يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الصوت يجب أن تكون أكبر من أو تساوي 0'
  }),
  passed_missions: Joi.string().allow('', null).optional().messages({
    'string.base': 'المهام المكتملة يجب أن تكون نصاً'
  }),
  active_mission: Joi.string().allow('', null).optional().messages({
    'string.base': 'المهمة النشطة يجب أن تكون نصاً'
  }),
  crown_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت التاج يجب أن تكون قيمة منطقية'
  }),
  diamond_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت الماس يجب أن تكون قيمة منطقية'
  }),
  star_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت النجمة يجب أن تكون قيمة منطقية'
  }),
  support_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت الدعم يجب أن تكون قيمة منطقية'
  }),
  programmer_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت المبرمج يجب أن تكون قيمة منطقية'
  }),
  youtube_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت اليوتيوب يجب أن تكون قيمة منطقية'
  })
}).min(1).messages({
  'object.min': 'يجب تقديم حقل واحد على الأقل للتحديث'
});

// Schema لتحديث نقاط المهمة
export const updateMissionPointsSchema = Joi.object({
  chatPoints: Joi.number().integer().min(0).required().messages({
    'number.base': 'نقاط الدردشة يجب أن تكون رقماً',
    'number.integer': 'نقاط الدردشة يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الدردشة يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'نقاط الدردشة مطلوبة'
  }),
  voicePoints: Joi.number().integer().min(0).required().messages({
    'number.base': 'نقاط الصوت يجب أن تكون رقماً',
    'number.integer': 'نقاط الصوت يجب أن تكون رقماً صحيحاً',
    'number.min': 'نقاط الصوت يجب أن تكون أكبر من أو تساوي 0',
    'any.required': 'نقاط الصوت مطلوبة'
  })
});

// Schema لتحديث المهام المكتملة
export const updatePassedMissionsSchema = Joi.object({
  passedMissions: Joi.string().allow('', null).required().messages({
    'string.base': 'المهام المكتملة يجب أن تكون نصاً',
    'any.required': 'المهام المكتملة مطلوبة'
  })
});

// Schema لتحديث المهمة النشطة
export const updateActiveMissionSchema = Joi.object({
  activeMission: Joi.string().allow('', null).required().messages({
    'string.base': 'المهمة النشطة يجب أن تكون نصاً',
    'any.required': 'المهمة النشطة مطلوبة'
  })
});

// Schema لتحديث المكافآت
export const updateRewardsSchema = Joi.object({
  crown_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت التاج يجب أن تكون قيمة منطقية'
  }),
  diamond_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت الماس يجب أن تكون قيمة منطقية'
  }),
  star_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت النجمة يجب أن تكون قيمة منطقية'
  }),
  support_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت الدعم يجب أن تكون قيمة منطقية'
  }),
  programmer_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت المبرمج يجب أن تكون قيمة منطقية'
  }),
  youtube_rewards: Joi.boolean().optional().messages({
    'boolean.base': 'مكافآت اليوتيوب يجب أن تكون قيمة منطقية'
  })
}).min(1).messages({
  'object.min': 'يجب تقديم نوع مكافأة واحد على الأقل للتحديث'
});

// Schema لتفعيل مكافأة
export const activateRewardSchema = Joi.object({
  rewardType: Joi.string().valid(
    'crown_rewards',
    'diamond_rewards',
    'star_rewards',
    'support_rewards',
    'programmer_rewards',
    'youtube_rewards'
  ).required().messages({
    'string.base': 'نوع المكافأة يجب أن يكون نصاً',
    'any.only': 'نوع المكافأة غير صحيح',
    'any.required': 'نوع المكافأة مطلوب'
  })
});

// Schema لإلغاء تفعيل مكافأة
export const deactivateRewardSchema = Joi.object({
  rewardType: Joi.string().valid(
    'crown_rewards',
    'diamond_rewards',
    'star_rewards',
    'support_rewards',
    'programmer_rewards',
    'youtube_rewards'
  ).required().messages({
    'string.base': 'نوع المكافأة يجب أن يكون نصاً',
    'any.only': 'نوع المكافأة غير صحيح',
    'any.required': 'نوع المكافأة مطلوب'
  })
});

// Schema للحصول على مهمة بواسطة المعرف
export const getMissionByIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.base': 'المعرف يجب أن يكون نصاً',
    'string.uuid': 'المعرف يجب أن يكون UUID صحيحاً',
    'any.required': 'المعرف مطلوب'
  })
});

// Schema للحصول على المهام بواسطة نقاط الدردشة
export const getMissionsByChatPointsSchema = Joi.object({
  minChatPoints: Joi.number().integer().min(0).required().messages({
    'number.base': 'الحد الأدنى لنقاط الدردشة يجب أن يكون رقماً',
    'number.integer': 'الحد الأدنى لنقاط الدردشة يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأدنى لنقاط الدردشة يجب أن يكون أكبر من أو يساوي 0',
    'any.required': 'الحد الأدنى لنقاط الدردشة مطلوب'
  }),
  maxChatPoints: Joi.number().integer().min(Joi.ref('minChatPoints')).optional().messages({
    'number.base': 'الحد الأقصى لنقاط الدردشة يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى لنقاط الدردشة يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأقصى لنقاط الدردشة يجب أن يكون أكبر من أو يساوي الحد الأدنى'
  })
});

// Schema للحصول على المهام بواسطة نقاط الصوت
export const getMissionsByVoicePointsSchema = Joi.object({
  minVoicePoints: Joi.number().integer().min(0).required().messages({
    'number.base': 'الحد الأدنى لنقاط الصوت يجب أن يكون رقماً',
    'number.integer': 'الحد الأدنى لنقاط الصوت يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأدنى لنقاط الصوت يجب أن يكون أكبر من أو يساوي 0',
    'any.required': 'الحد الأدنى لنقاط الصوت مطلوب'
  }),
  maxVoicePoints: Joi.number().integer().min(Joi.ref('minVoicePoints')).optional().messages({
    'number.base': 'الحد الأقصى لنقاط الصوت يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى لنقاط الصوت يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأقصى لنقاط الصوت يجب أن يكون أكبر من أو يساوي الحد الأدنى'
  })
});

// Schema للحصول على المهام بواسطة نوع المكافأة
export const getMissionsByRewardTypeSchema = Joi.object({
  rewardType: Joi.string().valid(
    'crown_rewards',
    'diamond_rewards',
    'star_rewards',
    'support_rewards',
    'programmer_rewards',
    'youtube_rewards'
  ).required().messages({
    'string.base': 'نوع المكافأة يجب أن يكون نصاً',
    'any.only': 'نوع المكافأة غير صحيح',
    'any.required': 'نوع المكافأة مطلوب'
  }),
  hasReward: Joi.string().valid('true', 'false').default('true').messages({
    'string.base': 'وجود المكافأة يجب أن يكون نصاً',
    'any.only': 'وجود المكافأة يجب أن يكون true أو false'
  })
});

// Schema لحذف المهام بواسطة نطاق نقاط الدردشة
export const deleteMissionsByChatPointsRangeSchema = Joi.object({
  minChatPoints: Joi.number().integer().min(0).required().messages({
    'number.base': 'الحد الأدنى لنقاط الدردشة يجب أن يكون رقماً',
    'number.integer': 'الحد الأدنى لنقاط الدردشة يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأدنى لنقاط الدردشة يجب أن يكون أكبر من أو يساوي 0',
    'any.required': 'الحد الأدنى لنقاط الدردشة مطلوب'
  }),
  maxChatPoints: Joi.number().integer().min(Joi.ref('minChatPoints')).required().messages({
    'number.base': 'الحد الأقصى لنقاط الدردشة يجب أن يكون رقماً',
    'number.integer': 'الحد الأقصى لنقاط الدردشة يجب أن يكون رقماً صحيحاً',
    'number.min': 'الحد الأقصى لنقاط الدردشة يجب أن يكون أكبر من أو يساوي الحد الأدنى',
    'any.required': 'الحد الأقصى لنقاط الدردشة مطلوب'
  })
});