const axios = require("axios");

module.exports = {
    name: "ai",
    alias: ["gemini", "gpt"],
    category: "ai",
    description: "KIRA AI Assistant",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const question = args.join(" ").trim();

        if (!question) {
            return await sock.sendMessage(jid, { text: "🩸 *KIRA AI*\n\nExample: .ai Tell me about India" }, { quoted: msg });
        }

        try {
            await sock.sendMessage(jid, { react: { text: "🧠", key: msg.key } });
            const thinking = await sock.sendMessage(jid, { text: "🩸 *_KIRA is thinking..._*" }, { quoted: msg });

            const prompt = `You are KIRA, an anime-style AI. Creator: Madhav. User: ${question}. Reply in detail.`;

            // API Endpoints
            const apis = [
                `https://eliteprotech-apis.zone.id/chatgpt?prompt=${encodeURIComponent(question)}`,
                `https://jerrycoder.oggyapi.workers.dev/ai/gemini?prompt=${encodeURIComponent(prompt)}`,
                `https://jerrycoder.oggyapi.workers.dev/ai/gpt?q=${encodeURIComponent(prompt)}`
            ];

            let reply = "";

            for (const url of apis) {
                try {
                    const res = await axios.get(url, { timeout: 30000 });
                    const data = res.data;
                    
                    // എല്ലാ സാധ്യതകളും പരിശോധിക്കുന്നു
                    if (data.reply) { reply = data.reply; break; }
                    if (data.response) { reply = data.response; break; }
                    if (data.result) { reply = data.result; break; }
                    if (data.text) { reply = data.text; break; }
                    if (data.message) { reply = data.message; break; }
                    
                } catch (e) {
                    console.log("API FAILED:", url);
                    continue;
                }
            }

            if (!reply) throw new Error("No response from any API");

            // Clean output
            reply = reply.replace(/ChatGPT|Gemini|Google AI/gi, "KIRA");

            const message = `╭━━━〔 K I R A • A I 〕━━━⬣\n\n👤 ${question}\n\n┈┈┈┈┈┈┈┈┈┈\n\n${reply}\n\n┈┈┈┈┈┈┈┈┈┈\n🩸 Justice Never Sleeps.\n╰━━━━━━━━━━━━━━⬣`;

            await sock.sendMessage(jid, { text: message, edit: thinking.key }).catch(async () => {
                await sock.sendMessage(jid, { text: message }, { quoted: msg });
            });

            await sock.sendMessage(jid, { react: { text: "✨", key: msg.key } });

        } catch (err) {
            console.log("AI ERROR:", err.message);
            await sock.sendMessage(jid, { react: { text: "❌", key: msg.key } });
            await sock.sendMessage(jid, { text: "🩸 *KIRA AI*\n\nI couldn't answer, Senpai. Try again later." }, { quoted: msg });
        }
    }
};