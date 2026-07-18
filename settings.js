import 'dotenv/config';

const settings = {
/* ================= DATABASE ================= */

DATABASE_URL: process.env.DATABASE_URL || '',
    
/* ================= BOT IDENTITY ================= */

botName: process.env.BOT_NAME || 'AKIRA BOT',
botOwner: process.env.BOT_OWNER || 'Yuri Dev',
ownerNumber: process.env.OWNER_NUMBER || '5531995808773',
author: process.env.AUTHOR || 'Yuri Dev',
packname: process.env.PACKNAME || 'AKIRA BOT',
description: process.env.DESCRIPTION || 'Multi-device WhatsApp bot',

/* ================= SESSION ================= */

sessionId: process.env.SESSION_ID || '',
pairingNumber: process.env.PAIRING_NUMBER || '',
CDN: 'https://media.mrfrankofc.gleeze.com'

};

if (settings.DATABASE_URL && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = settings.DATABASE_URL;
}

export default settings;
