# DiscordApi

```js
(async () => {
    const { DiscordApi } = require('discord-api');

    const d = new DiscordApi('AwesomeEmail@any-mail.com', 'AwesomeP@ssowrd');
    await d.auth();

    const msgs = 'Every word as one message >:) yeah, we\'ve to shaffle >:)'.split(' ').shaffle();

    const t = setInterval(() => {
        const msg = msgs.pop();
        if (!msg) return clearInterval(t);
        d.sendMessageToChannel(channelId, msg);
    }, 5000);
})();
```

___

## Exmaples

If you want to try something with this lib, check [exmaples](/examples)

If you pulled github repo, create .env file, add your meta, and try any example

___

## Docs?

This lib is simply as can. Just read the [code](/index.js)
