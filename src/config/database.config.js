import joi from 'joi';
const types = joi.types();
const { string, number, object } = types;

// تعريف Schema للتحقق من المتغيرات لكل نوع من قواعد البيانات
const databaseSchema = object.keys({
  // MySQL
  MYSQL_HOST: string.hostname().required(),
  MYSQL_PORT: number.integer().min(1).max(65535).required(),
  MYSQL_USER: string.required(),
  MYSQL_PASSWORD: string.allow('').required(),
  MYSQL_DB: string.required(),

  // PostgreSQL
  POSTGRES_HOST: string.hostname().required(),
  POSTGRES_PORT: number.integer().min(1).max(65535).required(),
  POSTGRES_USER: string.required(),
  POSTGRES_PASSWORD: string.allow('').required(),
  POSTGRES_DB: string.required(),

  // MongoDB
  MONGO_URI: string.uri().required(),

  // Redis (للتخزين المؤقت والطوابير)
  REDIS_HOST: string.hostname().required(),
  REDIS_PORT: number.integer().min(1).max(65535).required(),
  REDIS_PASSWORD: string.allow('').required(),
  REDIS_DB: number.integer().min(0).default(0),
}).unknown(); // السماح بوجود متغيرات أخرى

// التحقق من المتغيرات
const { value: databaseConfig, error } = databaseSchema.validate(process.env, {
  abortEarly: false, // عرض جميع الأخطاء
});

if (error) {
  throw new Error(
    `Database configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}

// تصدير الإعدادات لكل نوع من قواعد البيانات
export const mysql = {
    host: databaseConfig.MYSQL_HOST,
    port: databaseConfig.MYSQL_PORT,
    user: databaseConfig.MYSQL_USER,
    password: databaseConfig.MYSQL_PASSWORD,
    database: databaseConfig.MYSQL_DB,
};
export const postgresql = {
    host: databaseConfig.POSTGRES_HOST,
    port: databaseConfig.POSTGRES_PORT,
    user: databaseConfig.POSTGRES_USER,
    password: databaseConfig.POSTGRES_PASSWORD,
    database: databaseConfig.POSTGRES_DB,
};
export const mongodb = {
    uri: databaseConfig.MONGO_URI,
};
export const redis = {
    host: databaseConfig.REDIS_HOST,
    port: databaseConfig.REDIS_PORT,
    password: databaseConfig.REDIS_PASSWORD,
    db: databaseConfig.REDIS_DB,
};
