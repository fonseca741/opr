import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = (file: string) =>
  path.join(path.dirname(require.main.filename), '..', file);

dotenv.config({ path: envPath(`.${process.env.NODE_ENV}.env`) });

export const config = {
  api: {
    port: process.env.PORT,
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  auth: {
    secret: process.env.AUTH_SECRET,
    expiresIn: process.env.AUTH_EXPIRES_IN,
  },
  orcid: {
    apiUrl: process.env.API_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  },
  mail: {
    smtp: process.env.MAIL_SMTP,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
};
