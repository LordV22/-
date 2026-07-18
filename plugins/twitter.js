const axios = require("axios");

module.exports = {
    name: "twitter",
    alias: ["tw", "x"],
    category: "downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const url = args.join(" ").trim();

        if (!url)
            return sock.sendMessage(
                jid,
                {
                    text:
                        "❌ Example:\n.twitter https://x.com/..."
                },
                { quoted: msg }
            );

        try {
            const api =
                `https://api-aswin-sparky.koyeb.app/api/downloader/twiter?url=${encodeURIComponent(url)}`;

            const { data } =
                await axios.get(api);

            const video =
                data?.result?.video ||
                data?.data?.url ||
                data?.url;

            if (!video)
                throw new Error();

            await sock.sendMessage(
                jid,
                {
                    video: {
                        url: video
                    },
                    caption:
`${title}

> *Downloaded by AKIRA-BOT*`
                },
                { quoted: msg }
            );

        } catch (e) {
            await sock.sendMessage(
                jid,
                {
                    text:
                        "❌ Download Failed"
                },
                { quoted: msg }
            );
        }
    }
};