import {sendMessage} from '../httpsRequest.js';

const processing = (message) => {
    const chatId = message?.chat?.id;

    if (message.photo) {
        return sendMessage({
            chatId,
            text: 'Я не умею распознавать картинки.',
        });
    } else if (message.voice) {
        return sendMessage({
            chatId,
            text: 'Я не понимаю голосовые сообщения, только текст, только по старинке.',
        });
    } else if (message.document) {
        return sendMessage({
            chatId,
            text: 'Я не умею парсить документы.',
        });
    } else if (message.video_note || message.video) {
        return sendMessage({
            chatId,
            text: 'Я не могу посмотреть видео.',
        });
    } else {
        return sendMessage({
            chatId,
            text: 'Я тебя не понимамю, воспользуйся командой /help, чтоб узнать, что я умею.',
        });
    }
}

export default processing;