import { t } from '@/i18n/index.js';
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
  try {
    const date = new Date(utcStr);
    const milliseconds = date.getTime();
    if (isNaN(milliseconds)) return '';
    const localDate = new Date(milliseconds);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${localDate.getFullYear()}${t('start.year')}${pad(localDate.getMonth() + 1)}${t('start.month')}${pad(localDate.getDate())}${t('start.day')} ${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  } catch (error) {
    console.error('UTC解析失败：', error);
    return '';
  }
};

export const convertUTCToTimestamp = (utcStr) => {
 if (!utcStr) return { seconds: '', milliseconds: '' };
      const date = new Date(utcStr);
      const milliseconds = date.getTime();
      return milliseconds
};