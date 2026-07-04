const axios = require("axios");

module.exports = {
    name: "insta",
    alias: ["ig", "instagram"],
    category: "downloader",
    description: "Instagram Downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        // URL from command
        let url = (args || []).join(" ").trim();

        // Reply support
        const context =
            msg.message?.extendedTextMessage?.contextInfo ||
            msg.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo ||
            msg.message?.viewOnceMessage?.message?.extendedTextMessage?.contextInfo;

        const quoted = context?.quotedMessage;

        if (!url && quoted) {
            const text =
                quoted.conversation ||
                quoted.extendedTextMessage?.text ||
                quoted.imageMessage?.caption ||
                quoted.videoMessage?.caption ||
                quoted.documentMessage?.caption ||
                "";

            const match =
                text.match(/https?:\/\/[^\s]+/i);

            if (match) {
                url = match[0];
            }
        }

        if (!url || !url.startsWith("http")) {
            return sock.sendMessage(
                jid,
                {
                    text:
                        "❌ Example:\n.insta https://instagram.com/reel/xxxxx\n\nor reply to an Instagram link with .insta"
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
                `https://api-aswin-sparky.koyeb.app/api/downloader/igdl?url=${encodeURIComponent(url)}`;

            const { data } = await axios.get(api, {
                timeout: 20000
            });

            console.log(JSON.stringify(data, null, 2));
            console.log("INSTA RESPONSE:", data);

            

            const items = data?.data || [];

            if (!items.length) {
                throw new Error("No media found");
            }

            for (const item of items) {
                const media = item.url;
                const type = item.type || "video";

                if (!media) continue;

                if (type.toLowerCase() === "image") {
                    await sock.sendMessage(
                        jid,
                        {
                            image: { url: media },
                            caption:
`${postCaption}

> *Downloaded by KIRA X MD*`
                        },
                        { quoted: msg }
                    );
                } else {
                    await sock.sendMessage(
                        jid,
                        {
                            video: { url: media },
                           caption:
`${postCaption}

> *Downloaded by KIRA X MD*`
                        },
                        { quoted: msg }
                    );
                }
            }

            await sock.sendMessage(jid, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });

        } catch (err) {
            console.log("INSTA ERROR:", err.message);

            await sock.sendMessage(
                jid,
                {
                    text: "❌ Download Failed"
                },
                { quoted: msg }
            );

            await sock.sendMessage(jid, {
                react: {
                    text: "❌",
                    key: msg.key
                }
            });
        }
    }
};