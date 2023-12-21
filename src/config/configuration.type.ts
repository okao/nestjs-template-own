export type ConfigTypes = {
  port: number;
  apiPrefix: string;
  database: {
    host: string;
    port: number;
    url: string;
  };
  redis: {
    host: string;
    port: number;
    prefix: string;
    encryption_key: string;
  };
  cors: {
    origin: string;
  };
  auth: {
    accessTokenExpiresIn: string;
    accessTokenSecret: string;
    refreshTokenExpiresIn: string;
    refreshTokenSecret: string;
    emailVerificationTokenExpiresIn: string;
    emailVerificationTokenLength: number;
    emailVerificationTokenPrefix: string;
  };
  session: {
    secret: string;
  };
};
