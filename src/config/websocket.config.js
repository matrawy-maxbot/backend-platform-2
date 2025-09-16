import joi from 'joi';
const types = joi.types();
const { string, number, object } = types;

// تعريف Schema للتحقق من الإعدادات
const websocketSchema = object.keys({
  WEBSOCKET_PORT: number.integer().min(1).max(65535).default(8080),
  WEBSOCKET_PATH: string.default('/ws'),
  WEBSOCKET_ORIGIN: string.default('*'),
}).unknown();

const { value: websocketConfig, error } = websocketSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(
    `WebSocket configuration validation error: ${error.details.map((x) => x.message).join(', ')}`
  );
}

export const {
  WEBSOCKET_PORT,
  WEBSOCKET_PATH,
  WEBSOCKET_ORIGIN,
} = websocketConfig;
