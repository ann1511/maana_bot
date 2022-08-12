export const token = '5431529759:AAGP0efE8_qMYDhG2afCJpnjrKV7n04_Kbw';

export const getPath = (method) => `bot${token}/${method}`;

export const getQuery = (obj = {}) => {
  return Object.entries(obj)
    .map(([key, value]) => key + '=' + encodeURI(value))
    .join('&');
};

export const formatDate = (date) => {
  const dateStr = date
    .toLocaleString('ru-RU', {
      dateStyle: 'short',
      timeStyle: 'short',
      hour12: false,
    })
    .split(', ')
    .join(' в ');

  // как посчитать время в UTC: hours + currentTimeZoneOffsetInHours;
  const currentTimeZoneOffsetInHours = date.getTimezoneOffset() / 60;

  return {
    dateStr,
    currentTimeZoneOffsetInHours,
  };
};
export const splitCountAndComment = (str) =>
  str
    .split(/(^\d+)/)
    // фильтруем пустые строки
    .filter((el) => el.length != 0);

export const getHistoryStr = (history) =>
  `<strong>История банковских оппераций\n\n</strong>` +
  history
    .map((item) => {
      // TODO: убрать тернарник на что-то константное
      const action = item.type === 'expense' ? 'трата' : 'поступление';

      return `<strong>${action}</strong> ${
        item?.time?.dateStr ? item.time.dateStr : ''
      } на сумму ${item.value} — ${item.comment || 'комментарий отсутствует'}`;
    })
    .join('\n');
