import { sendMessage } from '../httpsRequest.js';
import { COMMANDS } from '../constants.js';

const getCommandStr = ({ command, description }) =>
  `${command} — ${description};\n`;

const sendHelp = async ({ chatId }) => {
  const { bank } = Object.values(COMMANDS).reduce(
    (acc, { type, command, description }) => {
      switch (type) {
        case 'bank':
          acc.bank += getCommandStr({ command, description });
          break;
        default:
          break;
      }

      return acc;
    },
    { bank: '' }
  );

  const text =
    'Бот умеет всякое\n\n' + '<strong>Банковские дела</strong>\n\n' + bank;

  sendMessage({ chatId, text });
};

export default sendHelp;
