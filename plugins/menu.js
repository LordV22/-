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

        // Mapa de tradução das categorias
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
            categories[cat].push(`${prefix}${cmd.name}`);
        }

        let menu = `
╭──────────────────────
│      K I R A   X   M D
├──────────────────────
│ 👤 Usuário : ${pushname}
│ 🎯 Prefixo : ${prefix}
│ 🔧 Modo    : ${mode.toUpperCase()}
│ ⏰ Uptime  : ${uptimeText}
│ 📦 Plugins : ${commands.length}
╰──────────────────────
`;

        for (const category of Object.keys(categories).sort()) {
            menu += `\n┌─ ${category}\n`;
            for (const cmd of categories[category]) {
                menu += `│ ${cmd}\n`;
            }
            menu += `└────────────────`;
        }

        menu += `\n\n━━━━━━━━━━━━━━━━━━━━━━\n      KIRA X MD • By Liliane\n━━━━━━━━━━━━━━━━━━━━━━`;

        if (config.MENU_IMAGE) {
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
