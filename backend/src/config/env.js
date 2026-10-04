import 'dotenv/config';

const required = ['JWT_ACCESS_SECRET', 'DATABASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Env ${key} belum diisi. Salin .env.example ke .env dulu.`);
    process.exit(1);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  ACCESS_TTL: process.env.ACCESS_TTL || '15m',
  REFRESH_TTL_DAYS: Number(process.env.REFRESH_TTL_DAYS) || 30,
  CORS_ORIGINS: (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_SSL: process.env.DATABASE_SSL === 'true',
  GOOGLE_CLIENT_IDS: (process.env.GOOGLE_CLIENT_ID || '').split(',').map((s) => s.trim()).filter(Boolean),
};
