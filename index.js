const axios = require('axios');

const API_HOST = 'https://discord.com/api/v8/';

exports.DiscordApi = class {
    constructor(email, password, host = API_HOST) {
        this._host = host;

        this._email = email;
        this._password = password;
    }

    init = (email, password) => {
        this._email = email;
        this._password = password;
    }

    auth = async () => {
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
    };

    sendMessageToChannel = (channelId, content) =>
        this._instance.post(`channels/${channelId}/messages`, {
            tts: false,
            content
        })
            .then(() => console.log(`send content: ${content} ${`channels/${channelId}/messages`}`))
            .catch((e) => console.error(`content didnt send: ${content}; ${`channels/${channelId}/messages`} \n ${e}`));

    deleteMessageFromChannel = (channelId, messageId) =>
        this._instance.delete(`channels/${channelId}/messages/${messageId}`);

    getMessagesFromChannel = (channelId, before) =>
        this._instance.get(`channels/${channelId}/messages${before ? `?before=${before}` : ''}`).then(e => e.data);

    getEveryMessagesFromChannel = async (channelId) => {
        let before;
        const messages = [];
        while (true) {
            const newMessages = await this.getMessagesFromChannel(channelId, before);
            messages.push(...newMessages);

            if (newMessages.length === 0) break;
            before = newMessages.pop().id;
        }

        return messages;
    }
};
