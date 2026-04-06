import QRCode from 'qrcode';

/**
 * Generate a QR code as a base64 data URL
 */
export async function generateQRCode(data: string): Promise<string> {
  return await QRCode.toDataURL(data, {
    width: 256,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF',
    },
  });
}

/**
 * Generate a QR code as SVG
 */
export async function generateQRCodeSVG(data: string): Promise<string> {
  return await QRCode.toString(data, {
    type: 'svg',
    width: 256,
    margin: 2,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF',
    },
  });
}
