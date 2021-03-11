const axios = require('axios');

const API_HOST = 'https://discord.com/api/v8/';

/** Initialize logging */
const loggingDecorator = (() => {
    if (!process.env.DEBUG)
        return (field, func) => (...args) => func(...args);

    const debugLvl = process.env.DEBUG_LEVEL;

    console.log('DiscordApi: DEBUG enabled');
    debugLvl && console.log('DiscordApi: DEBUG LEVEL = ' + debugLvl);

    return (field, func) => (...args) => {
        console.log(`DiscordApi.${field} call: ${JSON.stringify(args)}`);

        const result = new Promise(resolve => resolve(func(...args)));

        if (result instanceof Promise && debugLvl == '2')
            result
                .then(res => (console.log(`DiscordApi.${field} result: ${res}`, res)))
                .catch(error => console.error(`DiscordApi.${field} error: ${error}`));

        return result;
    }
})();

exports.DiscordApi = class {
    constructor(email, password, host = API_HOST) {
        this._host = host;

        this._email = email;
        this._password = password;
    }

    init = loggingDecorator('init', (email, password) => {
        this._email = email;
        this._password = password;
    });

    auth = loggingDecorator('auth', async () => {
        const result = await axios.post(this._host + 'auth/login', {
            login: this._email,
            password: this._password
        });

        const { token } = result.data;

        this._instance = axios.create({
            baseURL: this._host,
            headers: { authorization: token }
        });

        return token;
    });

    sendMessageToChannel = loggingDecorator('sendMessageToChannel', (channelId, content) =>
        this._instance.post(`channels/${channelId}/messages`, {
            tts: false,
            content
        })
    );

    deleteMessageFromChannel = loggingDecorator('deleteMessageFromChannel', (channelId, messageId) =>
        this._instance.delete(`channels/${channelId}/messages/${messageId}`)
    );

    getMessagesFromChannel = loggingDecorator('getMessageFromChannel', (channelId, before) =>
        this._instance.get(`channels/${channelId}/messages${before ? `?before=${before}` : ''}`).then(e => e.data)
    );

    getEveryMessagesFromChannel = loggingDecorator('getEveryMessagesFromChannel', async (channelId) => {
        let before;
        const messages = [];
        while (true) {
            const newMessages = await this.getMessagesFromChannel(channelId, before);
            messages.push(...newMessages);

            if (newMessages.length === 0) break;
            before = newMessages.pop().id;
        }

        return messages;
    });
};
