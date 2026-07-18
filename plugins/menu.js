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

        for (const cmd of commands) {
            const cat = (cmd.category || "outros").toUpperCase();
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

        // Send with image if configured
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
