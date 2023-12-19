export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  database: {
    provider: process.env.DATABASE_PROVIDER || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    url:
      process.env.POSTGRES_URL ||
      // 'postgres://postgres:postgres@localhost:5432/postgres',
      'postgres://postgres:postgres@localhost:5432/postgres?schema=public',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    prefix: process.env.REDIS_PREFIX || 'template',
    encryption_key: process.env.REDIS_ENCRYPTION_KEY || 'encryption_key',
  },
  cors: {
    origin: [process.env.CORS_ORIGIN || 'http://localhost:3000'],
  },
  auth: {
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '5m',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'access-token-secret',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '1d',
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret',
    emailVerificationTokenExpiresIn:
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRES_IN || '1d',
    emailVerificationTokenLength:
      parseInt(process.env.EMAIL_VERIFICATION_TOKEN_LENGTH, 10) || 32,
    emailVerificationTokenPrefix:
      process.env.EMAIL_VERIFICATION_TOKEN_PREFIX || 'ev',
  },
});
