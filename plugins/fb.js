const axios = require("axios");

module.exports = {
    name: "fb",
    alias: ["facebook"],
    category: "downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const url = args.join(" ").trim();

        if (!url) {
            return sock.sendMessage(
                jid,
                { text: "❌ Example:\n.fb <facebook url>" },
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

            const api =
                `https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(url)}`;

            const { data } =
                await axios.get(api);

                const postCaption =
    data?.data?.caption ||
    data?.result?.caption ||
    data?.data?.title ||
    data?.result?.title ||
    "📘 KIRA X MD Facebook Downloader";

            const video =
                data?.data?.high ||
                data?.data?.hd ||
                data?.data?.sd ||
                data?.result?.high ||
                data?.result?.hd ||
                data?.result?.sd ||
                data?.url;

            if (!video)
                throw new Error("No video");

            await sock.sendMessage(
                jid,
                {
                    video: {
                        url: video
                    },
                    caption:
`${postCaption}

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