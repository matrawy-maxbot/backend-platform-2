// src/modules/api/v1/restful/validators/profile.validator.js
import joi from 'joi';
const types = joi.types();
const { string, object, number } = types;

export const createProfileSchema = object.keys({
  id: string.required(),
  credits: number.min(0).default(0),
  xp: number.integer().min(0).default(0),
  level: number.integer().min(1).default(1),
  country: string.max(30).allow(null),
  city: string.max(50).allow(null),
  backgrounds: string.default('[]'),
  active_background: string.allow(null)
});

export const updateProfileSchema = object.keys({
  credits: number.min(0),
  xp: number.integer().min(0),
  level: number.integer().min(1),
  country: string.max(30).allow(null),
  city: string.max(50).allow(null),
  backgrounds: string,
  active_background: string.allow(null)
});

export const getProfileSchema = object.keys({
  id: string.required()
});