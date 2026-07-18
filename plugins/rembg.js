// plugins/rembg.js – AKIRA-BOT (Remove background from image)
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'rembg',
    alias: ['removebg', 'bgremove'],
    category: 'media',
    description: 'Remove background from an image (reply to an image)',
    usage: `${process.env.PREFIX || '.'}rembg (reply to an image)`,

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted || !quoted.imageMessage) {
            await sock.sendMessage(jid, { text: '❌ *Reply to an image*' }, { quoted: msg });
            return;
        }

        await sock.sendMessage(jid, { react: { text: '⏳', key: msg.key } });
        const statusMsg = await sock.sendMessage(jid, { text: '🔄 *Processing image...*' });

        let tempFile = null;
        try {
            // 1. Download the image
            const buffer = await downloadMediaMessage({ message: quoted }, 'buffer', {}, { logger: console });
            if (!buffer) throw new Error('Failed to download image');

            // 2. Upload to catbox.moe to get a public URL
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
            tempFile = path.join(tempDir, `rembg_${Date.now()}.jpg`);
            fs.writeFileSync(tempFile, buffer);

            const form = new FormData();
            form.append('reqtype', 'fileupload');
            form.append('fileToUpload', fs.createReadStream(tempFile));

            const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, {
                headers: form.getHeaders(),
                timeout: 20000
            });
            const imageUrl = uploadRes.data.trim();
            if (!imageUrl.startsWith('http')) throw new Error('Upload failed');

            // 3. Call the rembg API
            const apiUrl = `https://jerrycoder.oggyapi.workers.dev/tool/rembg?url=${encodeURIComponent(imageUrl)}`;
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer', timeout: 30000 });
            const resultBuffer = Buffer.from(response.data);

            // 4. Send the result as image
            await sock.sendMessage(jid, { image: resultBuffer, caption: '✨ *Background removed*\n\n> *AKIRA-BOT*' });

            await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
            await sock.sendMessage(jid, { text: '✅ *Done*', edit: statusMsg.key });
        } catch (err) {
            console.error('Rembg error:', err);
            await sock.sendMessage(jid, { text: '❌ *Failed to remove background*', edit: statusMsg.key });
            await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
        } finally {
            if (tempFile && fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        }
    }
};