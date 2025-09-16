import joi from 'joi';
const types = joi.types();
const { string, object } = types;

// تعريف Schema للتحقق من الإعدادات
const securitySchema = object.keys({
  // JWT
  JWT_SECRET: string.required(),
  JWT_EXPIRES_IN: string.default('1h'),

  // CORS
  CORS_ORIGIN: string.required(),
  CORS_METHODS: string.default('GET,POST,PUT,DELETE'),
  CORS_HEADERS: string.default('Content-Type,Authorization'),
}).unknown();

const { value: securityConfig, error } = securitySchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `Security configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}

export const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  CORS_METHODS,
  CORS_HEADERS,
} = securityConfig;
