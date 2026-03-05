// src/utils/date.js
export const timestampToIsoUtc = (timestamp, customMs = 988) => {
  if (typeof timestamp !== 'number' || isNaN(timestamp)) return '';
  try {
    const date = new Date(timestamp);
    const baseIso = date.toISOString();
    const fixedMs = String(customMs).padStart(3, '0').slice(0, 3);
    return baseIso.replace(/\.\d{3}Z$/, `.${fixedMs}Z`);
  } catch (error) {
    console.error('时间戳转换失败：', error);
    return '';
  }
};

export const parseUTCToDateTime = (utcStr) => {
    if (!utcStr) return '';
  const date = new Date(utcStr);
  const pad = (num) => num.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}年${pad(date.getUTCMonth() + 1)}月${pad(date.getUTCDate())}日 ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;
};

export const convertUTCToTimestamp = (utcStr) => {
 if (!utcStr) return { seconds: '', milliseconds: '' };
      const date = new Date(utcStr);
      const milliseconds = date.getTime();
      return milliseconds
};