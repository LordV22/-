const axios = require("axios");

module.exports = {
    name: "tiktok",
    alias: ["tt", "ttdl"],
    category: "downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const url = args.join(" ").trim();

        if (!url) {
            return sock.sendMessage(
                jid,
                {
                    text:
                        "❌ Example:\n.tiktok https://vt.tiktok.com/xxxxx"
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

            const api =
                `https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${encodeURIComponent(url)}`;

            const { data } =
                await axios.get(api);
const postCaption =
    data?.result?.title ||
    data?.result?.caption ||
    data?.data?.title ||
    data?.data?.caption ||
    data?.title ||
    "🎵 TikTok Downloader";

            const video =
                data?.result?.video ||
                data?.data?.video ||
                data?.video;

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