import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  owmApiKey: requireEnv('OWM_API_KEY'),
  owmBaseUrl: process.env.OWM_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  isDev: process.env.NODE_ENV === 'development',
};
