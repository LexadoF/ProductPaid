import { config } from 'dotenv';

config();

export const dbHost: string = process.env.DB_HOST as string;
export const dbUser: string = process.env.DB_USERNAME as string;
export const dbPort: number = parseInt(process.env.DB_PORT as string, 10);
export const dbPassword: string = process.env.DB_PASSWORD as string;
export const dbName: string = process.env.DB_NAME as string;
export const appDefaultPort: number = parseInt(process.env.PORT as string, 10);
export const appPubKey: string = process.env.PUB_KEY as string;
export const appPrivKey: string = process.env.PRIV_KEY as string;
export const appIntegrationKey: string = process.env.ITG_KEY as string;
export const appBaseUrlIntegration: string = process.env
  .BASE_URL_INTEGRATION as string;
export const jwtSecret: string = process.env.JWT_SECRET as string;
