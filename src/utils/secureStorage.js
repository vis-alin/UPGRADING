import CryptoJS from 'crypto-js';

const DEFAULT_KEY = (import.meta?.env?.VITE_STORAGE_KEY) || 'upsc-portal-local-key';

const getKey = () => DEFAULT_KEY;

const setItem = (key, value) => {
  try {
    const plaintext = typeof value === 'string' ? value : JSON.stringify(value);
    const ciphertext = CryptoJS.AES.encrypt(plaintext, getKey()).toString();
    localStorage.setItem(key, ciphertext);
    return true;
  } catch (e) {
    console.error('secureStorage.setItem error', e);
    return false;
  }
};

const getItem = (key) => {
  try {
    const ciphertext = localStorage.getItem(key);
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, getKey());
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    try {
      return JSON.parse(plaintext);
    } catch (_) {
      return plaintext;
    }
  } catch (e) {
    console.error('secureStorage.getItem error', e);
    return null;
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (_) {}
};

export default { setItem, getItem, removeItem };





