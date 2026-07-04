const axios = require("axios");

module.exports = {
    name: "ytv",
    alias: ["yt", "youtube"],
    category: "downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const url = args.join(" ").trim();

        if (!url) {
            return sock.sendMessage(
                jid,
                {
                    text:
                        "❌ Example:\n.ytv <youtube url>"
                },
                { quoted: msg }
            );
        }

        try {
            await sock.sendMessage(jid, {
                react: {
                    text: "⏳",
                    key: msg.key
                }
            });

            const apis = [
                `https://jerrycoder.oggyapi.workers.dev/down/ytmp4-v1?url=${encodeURIComponent(url)}`,
                `https://eliteprotech-apis.zone.id/ytmp4?url=${encodeURIComponent(url)}`
            ];

            let video = null;

            for (const api of apis) {
                try {
                    const { data } =
                        await axios.get(api);

                    video =

                        data?.data?.dl ||
                        data?.data?.url ||
                        data?.result?.url ||
                        data?.result?.video ||
                        data?.url;

                    title =
    data?.data?.title ||
    data?.result?.title ||
    data?.title ||
    title;

                    if (video)
                        break;

                } catch {}
            }

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

> *Downloaded by KIRA X MD*`
                },
                { quoted: msg }
            );

            await sock.sendMessage(jid, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });

        } catch (e) {
            console.log(e);

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