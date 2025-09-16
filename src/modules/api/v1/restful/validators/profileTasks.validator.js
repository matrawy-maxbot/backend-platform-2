// src/modules/api/v1/restful/validators/profileTasks.validator.js
import joi from 'joi';
const types = joi.types();
const { string, object, number } = types;

// schema لإنشاء مهمة ملف شخصي جديدة
export const createProfileTaskSchema = object.keys({
  guild_id: string.max(20).required(),
  profile_ch_id: string.max(20).required(),
  tasks_ch_id: string.max(20).required(),
  profile_id: string.max(20).required(),
  bot_dur: string.max(20).required(),
  s_members: string.max(20).required(),
  s_online: string.max(20).required(),
  s_boosts: string.max(20).required(),
  s_votes: string.max(20).required(),
  s_chat: string.max(20).required(),
  bd_shard: number.integer().min(0).required(),
  sm_shard: number.integer().min(0).required(),
  so_shard: number.integer().min(0).required(),
  sb_shard: number.integer().min(0).required(),
  sv_shard: number.integer().min(0).required(),
  si_shard: number.integer().min(0).required()
});

// schema لتحديث مهمة ملف شخصي
export const updateProfileTaskSchema = object.keys({
  guild_id: string.max(20),
  profile_ch_id: string.max(20),
  tasks_ch_id: string.max(20),
  profile_id: string.max(20),
  bot_dur: string.max(20),
  s_members: string.max(20),
  s_online: string.max(20),
  s_boosts: string.max(20),
  s_votes: string.max(20),
  s_chat: string.max(20),
  bd_shard: number.integer().min(0),
  sm_shard: number.integer().min(0),
  so_shard: number.integer().min(0),
  sb_shard: number.integer().min(0),
  sv_shard: number.integer().min(0),
  si_shard: number.integer().min(0)
});

// schema للحصول على مهمة ملف شخصي بواسطة المعرف
export const getProfileTaskSchema = object.keys({
  id: number.integer().positive().required()
});

// schema للحصول على مهام الملفات الشخصية بواسطة معرف الملف الشخصي
export const getProfileTasksByProfileIdSchema = object.keys({
  profileId: string.max(20).required()
});

// schema للحصول على مهمة ملف شخصي بواسطة معرف الخادم
export const getProfileTasksByGuildIdSchema = object.keys({
  guildId: string.max(20).required()
});