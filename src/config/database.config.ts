import { ConnectionOptions } from 'mysql2';

const access: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  connectTimeout: 60000,
};

export default access;
