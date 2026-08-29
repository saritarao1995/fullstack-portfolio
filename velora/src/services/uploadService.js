import { apiRequest } from './api';

const MAX_EDGE = 2400;
const JPEG_QUALITY = 0.86;
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read that photo.'));
    reader.readAsDataURL(blob);
  });

const fitImage = async (file) => {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bitmap = await createImageBitmap(file);
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
  });

  if (!blob) throw new Error('Could not prepare that photo.');
  return blob;
};

export const uploadImage = async (file) => {
  if (!file) throw new Error('Choose a photo from your computer.');

  let prepared;
  try {
    prepared = await fitImage(file);
  } catch {
    throw new Error('Use a photo file (JPG, PNG, or WEBP). Any size is fine.');
  }

  if (prepared.size > MAX_UPLOAD_BYTES) {
    throw new Error('That photo is still too heavy after resize. Try another shot.');
  }

  const data = await blobToDataUrl(prepared);
  const payload = await apiRequest('/api/uploads', {
    method: 'POST',
    auth: true,
    body: { name: `${file.name || 'photo'}.jpg`, type: 'image/jpeg', data },
  });
  return payload.url;
};
