import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '@config/logger.config';
import { ErrorHandler } from './error.util';

export async function sign(payload: Record<string, unknown>): Promise<string> {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

export async function verify(
  token: string | undefined,
): Promise<JwtPayload | string> {
  try {
    return jwt.verify(token as string, process.env.JWT_SECRET_KEY as string);
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler('Invalid token. Please log in again!', 401);
  }
}
