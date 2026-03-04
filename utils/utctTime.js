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