import jwt from 'jsonwebtoken';

export async function sign(payload: Record<string, unknown>): Promise<string> {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}
