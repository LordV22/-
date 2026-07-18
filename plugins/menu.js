const fs = require('fs');
const path = require('path');

module.exports = {
    name: "menu",
    alias: ["help", "commands", "cmds", "ajuda"],
    category: "main",

    async execute(sock, msg, args) {
        const config = require('../config');
        const jid = msg.key.remoteJid;
        const pushname = msg.pushName || "Usuário";
        const prefix = process.env.PREFIX || ".";
        const mode = process.env.MODE || "public";
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        const uptimeText = `${h}h ${m}m ${s}s`;
        const commands = global.commands || [];
        const categories = {};

        // Tradução das categorias
        const catTranslation = {
            "AI": "🤖 INTELIGÊNCIA ARTIFICIAL",
            "ANIME": "🎌 ANIME",
            "DOWNLOADER": "📥 DOWNLOADER",
            "GAME": "🎮 JOGOS",
            "GROUP": "👥 GRUPO",
            "INFO": "ℹ️ INFORMAÇÕES",
            "LOGO": "🎨 LOGO",
            "MAIN": "📋 PRINCIPAL",
            "MEDIA": "🎬 MÍDIA",
            "OWNER": "⚙️ DONO",
            "SEARCH": "🔍 PESQUISA",
            "STICKER": "🖼️ FIGURINHA",
            "TOOL": "🛠️ FERRAMENTAS",
            "TOOLS": "🛠️ FERRAMENTAS",
            "UTILITY": "🔧 UTILIDADES",
            "UTILS": "🔧 UTILIDADES",
            "OTHER": "📌 OUTROS",
            "OUTROS": "📌 OUTROS"
        };

        for (const cmd of commands) {
            const catRaw = (cmd.category || "outros").toUpperCase();
            const cat = catTranslation[catRaw] || catRaw;
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(`✦ ${prefix}${cmd.name}`);
        }

        // Menu tema roxo neon 💜
        let menu = `💜✨ *𝗔𝗞𝗜𝗥𝗔 𝗕𝗢𝗧* ✨💜
╔══════════════════════════╗
║ 👤 *Usuário* : ${pushname}
║ 🎯 *Prefixo* : ${prefix}
║ 🔧 *Dev* : 𝒀𝒖𝒓𝒊 𝑫𝒆𝒗 ✦
║ ⏰ *Uptime* : ${uptimeText}
║ 📦 *Plugins* : ${commands.length}
╚══════════════════════════╝`;

        for (const category of Object.keys(categories).sort()) {
            menu += `\n\n💜🟣 *${category}* 🟣💜`;
            menu += `\n┌──────────────────────────┐`;
            for (const cmd of categories[category]) {
                menu += `\n│ ${cmd}`;
            }
            menu += `\n└──────────────────────────┘`;
        }

        menu += `\n\n💜✨ *𝗔𝗸𝗶𝗿𝗮 𝗕𝗼𝘁* ✦ *𝗬𝘂𝗿𝗶 𝗗𝗲𝘃* ✨💜
════════════════════════════`;

        // Verificar se tem imagem salva
        const localImagePath = path.join(__dirname, '..', 'media', 'menu-image.jpg');
        if (fs.existsSync(localImagePath)) {
            await sock.sendMessage(jid, {
                image: fs.readFileSync(localImagePath),
                caption: menu
            }, { quoted: msg });
        } else if (config.MENU_IMAGE) {
            await sock.sendMessage(jid, {
                image: { url: config.MENU_IMAGE },
                caption: menu
            }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, {
                text: menu
            }, { quoted: msg });
        }
    }
};
