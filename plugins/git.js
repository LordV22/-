module.exports = {
    name: "git",
    alias: ["repo", "github"],

    async execute(sock, msg) {
        const jid = msg.key.remoteJid;

        const text = `
╔══════════════════════════╗
   ⚡ *AKIRA-BOT - REPO* ⚡
╚══════════════════════════╝

💠 *GitHub Repository*
📂 https://github.com/LordV22/-

🤖 *Session Generator API*
🌐 https://kira-session-generator-api.onrender.com

💬 *Support Community*
🔗 https://chat.whatsapp.com/C3hbXjblNLiF7CoDYJ8lwY

━━━━━━━━━━━━━━━━━━━━
✨ *AKIRA-BOT* | _Powered by AKIRA-BOT_
⭐ *Don't forget to Star & Fork!*
🚀 *Keep coding, keep evolving.*
━━━━━━━━━━━━━━━━━━━━
`;

        await sock.sendMessage(
            jid,
            { 
                text,
                contextInfo: {
                    externalAdReply: {
                        title: "AKIRA-BOT - OFFICIAL REPO",
                        body: "Get the latest updates here",
                        thumbnailUrl: "https://files.catbox.moe/kriz_logo.jpg", // നിന്റെ ലോഗോ ലിങ്ക് ഇവിടെ നൽകുക
                        mediaType: 1,
                        mediaUrl: "https://github.com/LordV22/-",
                        sourceUrl: "https://github.com/LordV22/-"
                    }
                }
            },
            { quoted: msg }
        );
    }
};