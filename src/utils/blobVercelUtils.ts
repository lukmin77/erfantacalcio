import { put, head } from '@vercel/blob';
import { base64ToBuffer } from './stringUtils';

export async function uploadFile(fileData: string, fileName: string, folder: string) {
  const arrayBuffer = base64ToBuffer(fileData);
  const blob = await put(`${folder}/${fileName}`, arrayBuffer, {
    access: 'public',
    addRandomSuffix: false
  });
  return blob;
}

export async function readFile(blobUrl: string){
  const file = await head(blobUrl);
  return file;
}