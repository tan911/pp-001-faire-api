import crypto from 'crypto';

function hashedToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default hashedToken;
