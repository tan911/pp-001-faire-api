import jwt, { JwtPayload } from 'jsonwebtoken';

import { ErrorHandler } from './error.util';
import logger from '../config/logger.config';

export async function sign(payload: Record<string, unknown>): Promise<string> {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

export async function verify(token: any): Promise<JwtPayload | string> {
  try {
    const decoded: JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    );
    return decoded;
  } catch (err) {
    logger.error(err);
    throw new ErrorHandler('Invalid token. Please log in again!', 401);
  }
}
