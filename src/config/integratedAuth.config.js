import joi from 'joi';
const types = joi.types();
const { string, object } = types;

// تعريف Schema للتحقق من الإعدادات
const authSchema = object.keys({
  GOOGLE_CLIENT_ID: string.required(),
  GOOGLE_CLIENT_SECRET: string.required(),
  FACEBOOK_CLIENT_ID: string.required(),
  FACEBOOK_CLIENT_SECRET: string.required(),
  GITHUB_CLIENT_ID: string.required(),
  GITHUB_CLIENT_SECRET: string.required(),
}).unknown();

const { value: integratedAuthConfig, error } = authSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `Integrated Authentication configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}


export const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = integratedAuthConfig;
