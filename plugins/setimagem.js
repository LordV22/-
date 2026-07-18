const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "setimagem",
    alias: ["setmenuimage", "setimgmenu", "menuimage"],
    category: "owner",
    description: "Define a imagem do menu do bot",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const isOwner = msg.key.fromMe;
        const sender = msg.key.participant || jid;
        const senderJid = sender.includes('@') ? sender : sender + '@s.whatsapp.net';

        // Verificar se é dono ou sudo
        const isSudo = global.sudoUsers && global.sudoUsers.includes(senderJid);
        if (!isOwner && !isSudo) {
            return await sock.sendMessage(jid, { text: "❌ *Apenas o dono e administradores podem usar este comando!*" }, { quoted: msg });
        }

        // Verificar se há imagem (respondida ou na própria mensagem)
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        let mediaMsg = null;

        if (quoted) {
            // Respondeu a uma mensagem
            if (quoted.imageMessage) mediaMsg = quoted;
            else if (quoted.viewOnceMessageV2?.message?.imageMessage) mediaMsg = quoted.viewOnceMessageV2.message;
            else if (quoted.viewOnceMessage?.message?.imageMessage) mediaMsg = quoted.viewOnceMessage.message;
        } else if (msg.message.imageMessage) {
            // Enviou imagem direto com legenda
            mediaMsg = msg.message;
        }

        if (!mediaMsg) {
            return await sock.sendMessage(jid, { 
                text: `📸 *Como usar:*\n\nEnvie ou responda a uma imagem com:\n/setimagem`
            }, { quoted: msg });
        }

        try {
            // Baixar a imagem
            const buffer = await downloadMediaMessage(
                { message: mediaMsg },
                "buffer",
                {},
                { logger: console, reuploadRequest: sock.updateMediaMessage }
            );

            if (!buffer) {
                return await sock.sendMessage(jid, { text: "❌ *Erro ao baixar a imagem!*" }, { quoted: msg });
            }

            // Salvar a imagem localmente
            const mediaDir = path.join(__dirname, '..', 'media');
            if (!fs.existsSync(mediaDir)) {
                fs.mkdirSync(mediaDir, { recursive: true });
            }
            fs.writeFileSync(path.join(mediaDir, 'menu-image.jpg'), buffer);

            await sock.sendMessage(jid, { 
                text: `✅ *Imagem do menu atualizada com sucesso!*\n\nDigite /menu para ver o resultado.`
            }, { quoted: msg });

        } catch (err) {
            console.error("SETIMAGEM ERROR:", err);
            await sock.sendMessage(jid, { 
                text: `❌ *Erro ao processar a imagem:* ${err.message}`
            }, { quoted: msg });
        }
    }
};
