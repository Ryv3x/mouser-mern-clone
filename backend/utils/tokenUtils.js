import crypto from 'crypto';

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateVerificationTokenWithExpiry = () => {
  const token = generateVerificationToken();
  const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
  const expiresAt = new Date(Date.now() + expiresIn);
  
  return { token, expiresAt };
};
