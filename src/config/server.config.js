import joi from 'joi';
const types = joi.types();
const { string, number, object } = types;

// تعريف Schema للتحقق من الإعدادات
const serverSchema = object.keys({
  SERVER_HOST: string.hostname().default('0.0.0.0'),
  SERVER_PORT: number.integer().min(1).max(65535).default(3000),
  NODE_ENV: string
    .valid('development', 'production', 'testing')
    .default('development'),
  BASE_URL: string.uri().required(),
}).unknown();

const { value: serverConfig, error } = serverSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `Server configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}

export const {
  SERVER_HOST,
  SERVER_PORT,
  NODE_ENV,
  BASE_URL,
} = serverConfig;
