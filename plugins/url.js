const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");
const FormData = require("form-data");

module.exports = {
    name: "url",
    alias: ["upload", "link"],
    category: "tools",
    description: "Convert media to a direct URL link",
    usage: ".url (reply to media)",

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        // 1. മീഡിയ റിപ്ലൈ ഉണ്ടോ എന്ന് നോക്കുന്നു
        if (!quoted) {
            return await sock.sendMessage(jid, { text: "⚠️ *Reply to an image, video, or audio file!*" }, { quoted: msg });
        }

        try {
            await sock.sendMessage(jid, { react: { text: "⏳", key: msg.key } });

            // 2. മീഡിയ ഡൗൺലോഡ് ചെയ്യുന്നു
            const mediaBuffer = await downloadMediaMessage({ message: quoted }, "buffer", {}, {});
            
            // 3. Catbox-ലേക്ക് അപ്‌ലോഡ് ചെയ്യുന്നു
            const form = new FormData();
            form.append("reqtype", "fileupload");
            form.append("fileToUpload", mediaBuffer, { filename: "kira_file.tmp" });

            const res = await axios.post("https://catbox.moe/user/api.php", form, {
                headers: form.getHeaders()
            });

            // 4. റിസൾട്ട് അയക്കുന്നു
            const link = res.data;
            if (!link.startsWith("http")) throw new Error("Upload failed");

            // ലിങ്ക് മാത്രം അയക്കുന്നു
            await sock.sendMessage(jid, { text: link }, { quoted: msg });

            await sock.sendMessage(jid, { react: { text: "✅", key: msg.key } });

        } catch (err) {
            console.log("URL UPLOAD ERROR:", err);
            await sock.sendMessage(jid, { text: "❌ *Failed to generate link.*" }, { quoted: msg });
            await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
        }
    }
};