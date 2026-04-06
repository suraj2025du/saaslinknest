import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const R2_CLIENT = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET = process.env.R2_BUCKET || 'linknest-uploads';
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

/**
 * Upload a file to Cloudflare R2
 * @param file Buffer of file data
 * @param fileName Original file name
 * @param folder Subfolder (e.g., 'avatars', 'covers')
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(file: Buffer, fileName: string, folder: string = 'uploads'): Promise<{ url: string; key: string }> {
  const ext = fileName.split('.').pop() || 'bin';
  const key = `${folder}/${uuidv4()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file,
    ContentType: getContentType(ext),
    CacheControl: 'public, max-age=31536000', // 1 year cache
  });

  await R2_CLIENT.send(command);

  return {
    url: `${R2_PUBLIC_URL}/${key}`,
    key,
  };
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });
  await R2_CLIENT.send(command);
}

/**
 * Generate a signed URL for direct browser upload (useful for client-side uploads)
 */
export async function generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  });
  return await getSignedUrl(R2_CLIENT, command, { expiresIn });
}

/**
 * Generate a presigned PUT URL for client-side direct uploads
 */
export async function generatePresignedPutUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
  // Note: S3 presigned PUT requires a different approach
  // For now, we'll use server-side upload
  throw new Error('Use uploadToR2 for server-side uploads, or implement presigned PUT separately');
}

/**
 * Extract the R2 key from a URL
 */
export function getKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/').filter(Boolean);
    // Expected format: /folder/uuid.ext
    if (parts.length >= 2) {
      return parts.join('/');
    }
    return null;
  } catch {
    return null;
  }
}

function getContentType(ext: string): string {
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    pdf: 'application/pdf',
  };
  return types[ext.toLowerCase()] || 'application/octet-stream';
}
