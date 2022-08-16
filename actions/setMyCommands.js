import {makeRequest} from '../httpsRequest.js';
import {COMMANDS} from '../constants.js';

const setMyCommands = async () => {
    makeRequest({
        method: 'setMyCommands',
        commands: JSON.stringify(
            Object.values(COMMANDS).map(({ command, engDescription }) => ({
                command,
                description: engDescription,
            }))
        ),
    });
};

export default setMyCommands;