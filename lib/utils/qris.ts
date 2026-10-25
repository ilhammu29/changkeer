import QRCode from 'qrcode';

/**
 * Default Base Static QRIS String from Merchant
 * Source: /home/ilhammu29/barcode_pembayaran.jpeg
 * NMID: ID1026598652240 | Merchant: OXID PROJECT / CHANGKEER
 */
export const DEFAULT_STATIC_QRIS =
  '00020101021126570011ID.DANA.WWW011893600915303526827802090352682780303UMI51440014ID.CO.QRIS.WWW0215ID10265986522400303UMI5204899953033605802ID5912OXID PROJECT6010Kota Jambi6105361426304ABF4';

/**
 * Standard EMVCo / ASPI CRC16-CCITT algorithm (Polynomial: 0x1021, Initial: 0xFFFF)
 */
export function calculateCRC16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Convert Static QRIS into Dynamic QRIS with exact locked amount (Tag 54)
 */
export function generateDynamicQRIS(
  amount: number,
  baseQRIS: string = DEFAULT_STATIC_QRIS
): string {
  let raw = baseQRIS.trim();

  // 1. Strip existing checksum (6304 + 4 hex chars)
  if (raw.includes('6304')) {
    raw = raw.substring(0, raw.lastIndexOf('6304'));
  }

  // 2. Switch Point of Initiation Method: 010211 (static) -> 010212 (dynamic)
  raw = raw.replace('010211', '010212');

  // 3. Remove existing Tag 54 if any was present
  raw = raw.replace(/54\d{2}\d+/, '');

  // 4. Build Tag 54 (Transaction Amount)
  const amountStr = Math.max(1, Math.round(amount)).toString();
  const tag54 = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;

  // 5. Insert Tag 54 before Tag 58 (Country Code: 5802ID)
  if (raw.includes('5802ID')) {
    const parts = raw.split('5802ID');
    raw = `${parts[0]}${tag54}5802ID${parts.slice(1).join('5802ID')}`;
  } else {
    raw += tag54;
  }

  // 6. Append CRC tag identifier and calculate CRC16-CCITT
  raw += '6304';
  const checksum = calculateCRC16(raw);

  return `${raw}${checksum}`;
}

/**
 * Render QR Code to High-Resolution Data URL (PNG base64)
 */
export async function generateQRCodeDataUrl(
  text: string,
  options?: { width?: number; margin?: number }
): Promise<string> {
  const width = options?.width || 360;
  const margin = options?.margin !== undefined ? options.margin : 2;

  return QRCode.toDataURL(text, {
    width,
    margin,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#111113',
      light: '#FFFFFF',
    },
  });
}
