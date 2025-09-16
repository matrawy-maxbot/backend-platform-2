// src/modules/api/v1/restful/validators/topThree.validator.js
import joi from 'joi';
const types = joi.types();
const { string, object } = types;

// schema لإنشاء عنصر أفضل ثلاثة جديد
export const createTopThreeSchema = object.keys({
  id: string.required(),
  name: string.min(1).max(100).required(),
  description: string.min(1).max(500).required()
});

// schema لتحديث عنصر أفضل ثلاثة
export const updateTopThreeSchema = object.keys({
  name: string.min(1).max(100),
  description: string.min(1).max(500)
});

// schema للحصول على عنصر أفضل ثلاثة بواسطة المعرف
export const getTopThreeByIdSchema = object.keys({
  id: string.required()
});

// schema للبحث في عناصر أفضل ثلاثة
export const searchTopThreeSchema = object.keys({
  searchTerm: string.min(1).max(100).required()
});