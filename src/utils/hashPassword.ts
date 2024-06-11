import CryptoJS from 'crypto-js';

export function computeMD5Hash(password: string): string {
    return CryptoJS.MD5(password).toString().toUpperCase();
  }