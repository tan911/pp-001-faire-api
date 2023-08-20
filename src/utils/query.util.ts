import mysql, { RowDataPacket } from 'mysql2/promise';
import access from '../config/database.config';

async function query(sql: string): Promise<RowDataPacket> {
  const connection = await mysql.createConnection(access);
  const data = await connection.query<RowDataPacket[]>(sql);
  return JSON.parse(JSON.stringify(data[0]));
}

export { query };
