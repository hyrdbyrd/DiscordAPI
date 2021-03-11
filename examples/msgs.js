require('dotenv').config();

Array.prototype.shaffle = function() {
    return this.slice().sort(() => Math.random() > 0.5 ? 1 : -1);
};

(async () => {
    const { DiscordApi } = require('../index');

    const channelId = process.env.CHANNEL_ID;

    const d = new DiscordApi(process.env.EMAIL, process.env.PASSWORD);
    await d.auth();

    const msgs = 'Every word as one message >:) yeah, we\'ve to shaffle >:)'.split(' ').shaffle();

    const t = setInterval(() => {
        const msg = msgs.pop();
        if (!msg) return clearInterval(t);
        d.sendMessageToChannel(channelId, msg);
    }, 5000);
})();
