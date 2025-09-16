import joi from 'joi';
const types = joi.types();
const { string, number, object } = types;

// تعريف Schema للتحقق من الإعدادات
const fileStorageSchema = object.keys({
  FILE_STORAGE_PATH: string.required(),
  MAX_FILE_SIZE: number.integer().min(1).required(),
  AWS_ACCESS_KEY: string.optional(),
  AWS_SECRET_KEY: string.optional(),
  AWS_BUCKET_NAME: string.optional(),
}).unknown(); // السماح بمتغيرات إضافية

// التحقق من القيم
const { value: fileStorageConfig, error } = fileStorageSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `File Storage configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}

export const {
  FILE_STORAGE_PATH,
  MAX_FILE_SIZE,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} = fileStorageConfig;
