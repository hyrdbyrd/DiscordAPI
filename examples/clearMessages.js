require('dotenv').config();

(async () => {
    const { DiscordApi } = require('../index');

    const channelId = process.env.CHANNEL_ID;

    const d = new DiscordApi(process.env.EMAIL, process.env.PASSWORD);

    await d.auth();

    async function clear() {
        const messages = await d.getEveryMessagesFromChannel(channelId);
        if (!messages.length) return;

        const t = setInterval(() => {
            const message = messages.pop();
            if (!message) {
                clear();
                return clearInterval(t);
            }

            d.deleteMessageFromChannel(channelId, message.id);
        }, 2000);
    }

    clear();
})();
