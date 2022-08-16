import process from 'node:process';
import fs from 'fs';

import getUpdates from './actions/getUpdates.js';
import setMyCommands from './actions/setMyCommands.js';
import sendHelp from './actions/sendHelps.js';
import sendUnprocessedUserInputResponse from './actions/sendUnprocessedUserInputResponse.js';
import { sendMessage } from './httpsRequest.js';
import { formatDate, splitCountAndComment, getHistoryStr } from './utils.js';

import { COMMANDS } from './constants.js';

let rawdata = fs.readFileSync('./app_data.json', { encoding: 'utf8' });

let APP_DATA;
try {
  APP_DATA = JSON.parse(rawdata);
} catch (err) {
  console.log('Can not parse APP_DATA, error:', err.message);
}

// наверно плохо делать глобальную переменную, но почему? Да и что лучше?
let CURRENT_OPERATION = null;

const MULTIPLIER_BY_CURRENT_OPERATION = {
  [COMMANDS.expense.name]: -1,
  [COMMANDS.income.name]: 1,
};

const processingCommand = (message) => {
  // сбрасываем текущую операцию;
  if (message.text !== '/income' || message.text !== '/expense') {
    CURRENT_OPERATION = null;
  }

  switch (message.text) {
    case COMMANDS.start.command:
      if (APP_DATA.data[message.from.id]) {
        // логируем старичков на всякий
        APP_DATA.logData[message.from.id] = APP_DATA.data[message.from.id];
      }
      APP_DATA.data[message.from.id] = {
        bank: {
          balance: 0,
          history: [],
        },
        user: { ...message.from, ...message.chat },
      };
      return;

    case COMMANDS.help.command:
      return sendHelp({ chatId: message.chat.id });

    case COMMANDS.balance.command: {
      const balance = APP_DATA.data[message.from.id].bank.balance;
      const text = `Ваш баланс равен ${balance} условных единиц`;

      return sendMessage({
        chatId: message.chat.id,
        text,
      });
    }

    case COMMANDS.income.command: {
      const balance = APP_DATA.data[message.from.id].bank.balance;
      const text = `Ваш баланс равен ${balance} условных единиц, введите сумму поступления и через пробел комментарий для истории`;
      CURRENT_OPERATION = 'income';

      return sendMessage({
        chatId: message.chat.id,
        text,
      });
    }

    case COMMANDS.expense.command: {
      const balance = APP_DATA.data[message.from.id].bank.balance;
      const text = `Ваш баланс равен ${balance} условных единиц, введите сумму списания и через пробел комментарий для истории`;
      CURRENT_OPERATION = 'expense';

      return sendMessage({
        chatId: message.chat.id,
        text,
      });
    }

    case COMMANDS.history.command: {
      const history = APP_DATA.data[message.from.id].bank.history;
      const text = getHistoryStr(history);

      return sendMessage({
        chatId: message.chat.id,
        text,
      });
    }

    default:
      return sendMessage({
        chatId: message?.chat?.id,
        //TODO: мб назвать как-то бота - ?
        text: `Бот не знает команду ${message?.text}, нажми на /help, чтоб посмотреть, что умеет бот`,
      });
  }
};

// ожидаем !число! для банковских манипуляций.
// по идее нужно сделать что-то вроде "режим банк", но я не знаю как
// TODO: тут на любую неудачу нужно писать пользователю, что он косяк - исправляй
const processingBankOperation = (message) => {
  const id = message?.chat?.id;
  const multiplier = MULTIPLIER_BY_CURRENT_OPERATION[CURRENT_OPERATION];

  if (!CURRENT_OPERATION || !multiplier) {
    return sendMessage({
      chatId: id,
      // мб назвать как-то бота - ?
      text: 'Я тебя не понимаю, если хочешь изменить банковский баланс выбери команды /income или /expense',
    });
  }

  const [valueStr, comment] = splitCountAndComment(message.text);

  const count = multiplier * parseInt(valueStr);

  APP_DATA.data[id].bank.balance += count;
  APP_DATA.data[id].bank.history.push({
    value: parseInt(valueStr),
    type: CURRENT_OPERATION,
    comment,
    time: formatDate(new Date()),
  });

  const text = `Баланс ${
    // TODO: тоже заменить на текст из константы MULTIPLIER_BY_CURRENT_OPERATION
    CURRENT_OPERATION === 'expense' ? 'уменьшин' : 'увеличен'
  } на ${valueStr}, Ваш текущий баланс  ${APP_DATA.data[id].bank.balance}`;

  return sendMessage({
    chatId: id,
    text,
  });
};

const mainProcessing = ({ result }) => {
  result.forEach(({ message, callback_query, ...rest }) => {
    // New incoming message of any kind - text, photo, sticker, etc.
    // проверяем, что это действительно команда
    if (message?.text && message.text[0] === '/') {
      processingCommand(message);
    } else if (parseInt(message.text)) {
      processingBankOperation(message);
    } else sendUnprocessedUserInputResponse(message);
  });

  return result[0] && result[result.length - 1].update_id + 1;
};

async function subscribe() {
  await setMyCommands();

  getUpdates(mainProcessing);
}

// process.on('uncaughtException', function (error) {
//   console.log('\x1b[31m', 'Exception: ', error, '\x1b[0m');
// });
//
// process.on('unhandledRejection', function (error, p) {
//   console.log('\x1b[31m', 'Error: ', error.message, '\x1b[0m');
// });

process.on('SIGINT', () => {
  let data = JSON.stringify(APP_DATA);
  fs.writeFileSync('./app_data.json', data);

  console.log('Received SIGINT');
  process.exit();
});

process.on('SIGTERM', () => console.log('Received SIGTERM SIGTERM SIGTERM'));

subscribe();
