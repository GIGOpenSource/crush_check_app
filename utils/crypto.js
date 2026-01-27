import CryptoJS from 'crypto-js';
//和后端保持一致
const AES_CONFIG = {
  key: CryptoJS.enc.Utf8.parse('zhiliao'), 
  iv: CryptoJS.enc.Utf8.parse('1234567890123456'),  
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
};
//加密
export function aesEncrypt(data) {
  if (!data || typeof data !== 'string') {
    throw new Error('加密数据必须是非空字符串');
  }
  try {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(data),
      AES_CONFIG.key,
      {
        iv: AES_CONFIG.iv,
        mode: AES_CONFIG.mode,
        padding: AES_CONFIG.padding
      }
    );
    return encrypted.toString();
  } catch (error) {
    console.error('AES 加密失败：', error);
    throw error;
  }
}

/**
 * AES 解密
 * @param {string} encryptedStr 加密后的字符串
 * @returns {string} 解密后的原始字符串
 */
export function aesDecrypt(encryptedStr) {
  if (!encryptedStr || typeof encryptedStr !== 'string') {
    throw new Error('解密数据必须是非空字符串');
  }
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedStr,
      AES_CONFIG.key,
      {
        iv: AES_CONFIG.iv,
        mode: AES_CONFIG.mode,
        padding: AES_CONFIG.padding
      }
    );
    // 把解密后的二进制数据转回 UTF8 字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('AES 解密失败：', error);
    throw error;
  }
}