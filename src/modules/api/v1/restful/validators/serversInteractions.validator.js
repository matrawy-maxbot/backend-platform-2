// src/modules/api/v1/restful/validators/serversInteractions.validator.js
import joi from 'joi';
const types = joi.types();
const { string, object, number } = types;

// schema لإنشاء تفاعل جديد
export const createInteractionSchema = object.keys({
  user_id: string.max(20).required(),
  guild_id: string.max(20).required(),
  chat_points: number.integer().min(0).default(0),
  voice_points: number.integer().min(0).default(0),
  chat_level: number.integer().min(1).default(1),
  voice_level: number.integer().min(1).default(1)
});

// schema لتحديث تفاعل موجود
export const updateInteractionSchema = object.keys({
  chat_points: number.integer().min(0),
  voice_points: number.integer().min(0),
  chat_level: number.integer().min(1),
  voice_level: number.integer().min(1)
});

// schema للحصول على تفاعل بواسطة معرف المستخدم ومعرف الخادم
export const getUserGuildInteractionSchema = object.keys({
  userId: string.max(20).required(),
  guildId: string.max(20).required()
});

// schema للحصول على جميع تفاعلات مستخدم معين
export const getUserInteractionsSchema = object.keys({
  userId: string.max(20).required()
});

// schema للحصول على جميع تفاعلات خادم معين
export const getGuildInteractionsSchema = object.keys({
  guildId: string.max(20).required()
});

// schema للحصول على التفاعلات بناءً على مستوى الدردشة
export const getChatLevelInteractionsSchema = object.keys({
  minLevel: number.integer().min(1).required()
});

// schema للحصول على التفاعلات بناءً على مستوى الصوت
export const getVoiceLevelInteractionsSchema = object.keys({
  minLevel: number.integer().min(1).required()
});

// schema لتحديث النقاط
export const updatePointsSchema = object.keys({
  points: number.integer().min(0).required()
});

// schema لزيادة النقاط
export const incrementPointsSchema = object.keys({
  increment: number.integer().min(1).default(1)
});

// schema لحذف جميع تفاعلات مستخدم معين
export const deleteUserInteractionsSchema = object.keys({
  userId: string.max(20).required()
});

// schema لحذف جميع تفاعلات خادم معين
export const deleteGuildInteractionsSchema = object.keys({
  guildId: string.max(20).required()
});

// schema لتحديث مستوى الدردشة
export const updateChatLevelSchema = object.keys({
  level: number.integer().min(1).required()
});

// schema لتحديث مستوى الصوت
export const updateVoiceLevelSchema = object.keys({
  level: number.integer().min(1).required()
});

// schema للحصول على إحصائيات التفاعلات
export const getInteractionStatsSchema = object.keys({
  guildId: string.max(20).optional()
});