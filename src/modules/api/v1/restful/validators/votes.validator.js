import joi from 'joi';

/**
 * مخطط إنشاء تصويت جديد
 */
export const createVoteSchema = joi.object({
    guild_id: joi.string().required().messages({
        'string.empty': 'معرف الخادم مطلوب',
        'any.required': 'معرف الخادم مطلوب'
    }),
    channel_id: joi.string().required().messages({
        'string.empty': 'معرف القناة مطلوب',
        'any.required': 'معرف القناة مطلوب'
    }),
    message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف الرسالة يجب أن يكون نص'
    }),
    rank_message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف رسالة الترتيب يجب أن يكون نص'
    })
});

/**
 * مخطط تحديث تصويت
 */
export const updateVoteSchema = joi.object({
    guild_id: joi.string().optional().messages({
        'string.base': 'معرف الخادم يجب أن يكون نص'
    }),
    channel_id: joi.string().optional().messages({
        'string.base': 'معرف القناة يجب أن يكون نص'
    }),
    message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف الرسالة يجب أن يكون نص'
    }),
    rank_message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف رسالة الترتيب يجب أن يكون نص'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة المعرف
 */
export const getVoteByIdSchema = joi.object({
    id: joi.number().integer().positive().required().messages({
        'number.base': 'المعرف يجب أن يكون رقم',
        'number.integer': 'المعرف يجب أن يكون رقم صحيح',
        'number.positive': 'المعرف يجب أن يكون رقم موجب',
        'any.required': 'المعرف مطلوب'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة معرف الخادم
 */
export const getVoteByGuildIdSchema = joi.object({
    guildId: joi.string().required().messages({
        'string.empty': 'معرف الخادم مطلوب',
        'any.required': 'معرف الخادم مطلوب'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة معرف القناة
 */
export const getVoteByChannelIdSchema = joi.object({
    channelId: joi.string().required().messages({
        'string.empty': 'معرف القناة مطلوب',
        'any.required': 'معرف القناة مطلوب'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة معرف الرسالة
 */
export const getVoteByMessageIdSchema = joi.object({
    messageId: joi.string().required().messages({
        'string.empty': 'معرف الرسالة مطلوب',
        'any.required': 'معرف الرسالة مطلوب'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة معرف رسالة الترتيب
 */
export const getVoteByRankMessageIdSchema = joi.object({
    rankMessageId: joi.string().required().messages({
        'string.empty': 'معرف رسالة الترتيب مطلوب',
        'any.required': 'معرف رسالة الترتيب مطلوب'
    })
});

/**
 * مخطط الحصول على تصويت بواسطة معرف الخادم والقناة
 */
export const getVoteByGuildAndChannelSchema = joi.object({
    guildId: joi.string().required().messages({
        'string.empty': 'معرف الخادم مطلوب',
        'any.required': 'معرف الخادم مطلوب'
    }),
    channelId: joi.string().required().messages({
        'string.empty': 'معرف القناة مطلوب',
        'any.required': 'معرف القناة مطلوب'
    })
});

/**
 * مخطط البحث في التصويتات
 */
export const searchVotesSchema = joi.object({
    searchTerm: joi.string().min(1).required().messages({
        'string.empty': 'مصطلح البحث مطلوب',
        'string.min': 'مصطلح البحث يجب أن يحتوي على حرف واحد على الأقل',
        'any.required': 'مصطلح البحث مطلوب'
    })
});

/**
 * مخطط تحديث معرف الرسالة
 */
export const updateMessageIdSchema = joi.object({
    messageId: joi.string().required().messages({
        'string.empty': 'معرف الرسالة مطلوب',
        'any.required': 'معرف الرسالة مطلوب'
    })
});

/**
 * مخطط تحديث معرف رسالة الترتيب
 */
export const updateRankMessageIdSchema = joi.object({
    rankMessageId: joi.string().required().messages({
        'string.empty': 'معرف رسالة الترتيب مطلوب',
        'any.required': 'معرف رسالة الترتيب مطلوب'
    })
});

/**
 * مخطط تحديث معرف القناة
 */
export const updateChannelIdSchema = joi.object({
    channelId: joi.string().required().messages({
        'string.empty': 'معرف القناة مطلوب',
        'any.required': 'معرف القناة مطلوب'
    })
});

/**
 * مخطط إنشاء أو تحديث تصويت
 */
export const createOrUpdateVoteSchema = joi.object({
    guild_id: joi.string().required().messages({
        'string.empty': 'معرف الخادم مطلوب',
        'any.required': 'معرف الخادم مطلوب'
    }),
    channel_id: joi.string().required().messages({
        'string.empty': 'معرف القناة مطلوب',
        'any.required': 'معرف القناة مطلوب'
    }),
    message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف الرسالة يجب أن يكون نص'
    }),
    rank_message_id: joi.string().optional().allow('').messages({
        'string.base': 'معرف رسالة الترتيب يجب أن يكون نص'
    })
});