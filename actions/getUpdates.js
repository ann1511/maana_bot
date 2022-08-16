import httpsRequest from '../httpsRequest.js';
import {getPath, getQuery} from '../utils.js';

const getUpdates = (processing, query) => {
    const params = {
        host: 'api.telegram.org',
        method: 'GET',
        path: `/${getPath('getUpdates')}?${getQuery(query)}`,
    };

    return httpsRequest(params)
        .then(processing)
        .then((offset) => setTimeout(() => getUpdates(processing, {offset}), 3000));
}

export default getUpdates;