import mysql, { RowDataPacket } from 'mysql2/promise';
import access from '../config/database.config';

async function query(sql: string): Promise<any> {
  const connection = await mysql.createConnection(access);
  return await connection.query<RowDataPacket[]>(sql);
}

export { query };
