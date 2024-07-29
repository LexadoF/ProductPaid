declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USERNAME: string;
      DB_PORT: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      PORT: string;
    }
  }
}
export {};
