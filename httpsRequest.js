import https from 'https';
import { getQuery, token } from './utils.js';

// передавать сюда кастомные обработчики - ?
const httpsRequest = (params, postData) =>
  new Promise(function (resolve, reject) {
    const req = https.request(params, function (res) {
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode));
      }
      // cumulate data
      let body = [];
      res.on('data', function (chunk) {
        body.push(chunk);
      });
      // resolve on end
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    // reject on request error
    req.on('error', function (err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    // IMPORTANT
    req.end();
  });

export default httpsRequest;

export const makeRequest = ({ method, text, chatId, ...rest }) => {
  const query = text
    ? getQuery({
        chat_id: chatId,
        text,
        parse_mode: 'html',
        ...rest,
      })
    : getQuery({ chat_id: chatId, ...rest });

  const params = {
    host: 'api.telegram.org',
    // косвенный признак, но пока так
    method: text ? 'POST' : 'GET',
    path: `/bot${token}/${method}?${query}`,
  };

  httpsRequest(params).then(function (response) {
    // console.log({ response: JSON.stringify(response.result) });
  });
};

export const sendMessage = ({ chatId, text }) =>
  makeRequest({ method: 'sendMessage', chatId, text });
