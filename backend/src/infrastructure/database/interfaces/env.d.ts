declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USERNAME: string;
      DB_PORT: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      PORT: string;
      PUB_KEY: string;
      PRIV_KEY: string;
      ITG_KEY: string;
      BASE_URL_INTEGRATION: string;
      JWT_SECRET: string;
    }
  }
}
export {};
