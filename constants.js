export const COMMAND_START = '/start';
export const COMMAND_HELP = '/help';
export const COMMAND_BALANCE = '/balance';
export const COMMAND_INCOME = '/income';
export const COMMAND_EXPENSE = '/expense';
export const COMMAND_HISTORY = '/history';
// export const COMMAND_
// export const COMMAND_
// export const COMMAND_

export const TYPE_COMMAND = {
  common: 'common',
  bank: 'bank',
  notification: 'notification',
};

export const COMMANDS = {
  start: {
    name: 'start',
    command: COMMAND_START,
    description: 'Запустить бота',
    engDescription: 'start',
    type: TYPE_COMMAND.common,
  },
  help: {
    name: 'help',
    command: COMMAND_HELP,
    description: 'Посмотреть, что умеет бот',
    engDescription: 'show help',
    type: TYPE_COMMAND.common,
  },
  balance: {
    name: 'balance',
    command: COMMAND_BALANCE,
    description: 'Посмотреть, что умеет бот',
    engDescription: 'show help',
    type: TYPE_COMMAND.bank,
  },
  expense: {
    name: 'expense',
    command: COMMAND_EXPENSE,
    description: 'Добавить трату',
    engDescription: 'add expense',
    type: TYPE_COMMAND.bank,
  },
  income: {
    name: 'income',
    command: COMMAND_INCOME,
    description: 'Добавить поступление',
    engDescription: 'add income',
    type: TYPE_COMMAND.bank,
  },
  history: {
    name: 'history',
    command: COMMAND_HISTORY,
    description: 'Посмотреть историю операций',
    engDescription: 'show history',
    type: TYPE_COMMAND.bank,
  },
};
