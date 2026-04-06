import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

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
    window: 1, // Allow 1 step before/after for time drift
  });
}

export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
}
