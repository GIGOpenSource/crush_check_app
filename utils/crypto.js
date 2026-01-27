import CryptoJS from 'crypto-js';
const keyStr = 'zhiliao';
const keyHashHex = CryptoJS.MD5(keyStr).toString();
const key = keyHashHex.substring(0, 16);

const AES_CONFIG = {
  key: CryptoJS.enc.Utf8.parse(key), 
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

//解密
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
    const result = decrypted.toString(CryptoJS.enc.Utf8);

    if (!result) {
      console.warn('解密结果为空，请检查key和iv是否与后端一致');
    }
    
    return result;
  } catch (error) {
    console.error('AES 解密失败：', error);
    throw error;
  }
}