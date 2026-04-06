import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

export function generateTwoFactorSecret() {
  const secret = speakeasy.generateSecret({
    name: `LinkNest (${process.env.SMTP_USER || 'user@linknest.app'})`,
    issuer: 'LinkNest',
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url!,
  };
}

export async function generateQRCode(otpauthUrl: string): Promise<string> {
  return await QRCode.toDataURL(otpauthUrl);
}

export function verifyTwoFactorToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
}

/**
 * Generate cryptographically secure backup codes
 * Each code is 8 hex characters (32 bits of entropy from crypto.randomBytes)
 */
export function generateBackupCodes(count: number = 8): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex').toUpperCase()
  );
}
