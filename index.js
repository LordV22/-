require("dotenv").config();
const fs = require('fs');
const http = require('http');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");
const P = require("pino");

const { commands, loadPlugins } = require("./lib/plugins");
loadPlugins();
global.commands = commands;

// Railway-യിൽ ബോട്ട് ഉണർന്നിരിക്കാൻ
http.createServer((req, res) => res.end('KIRA-X-MD Online')).listen(process.env.PORT || 8080);

async function startKira() {
    // SESSION_ID ഉണ്ടെങ്കിൽ അത് ഫയൽ ആയി മാറ്റുന്നു
    if (process.env.SESSION_ID && !fs.existsSync("./session/creds.json")) {
        console.log("🔄 Loading session from SESSION_ID...");
        if (!fs.existsSync("./session")) fs.mkdirSync("./session");
        fs.writeFileSync("./session/creds.json", Buffer.from(process.env.SESSION_ID, 'base64').toString());
    }

    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: P({ level: "silent" }),
        auth: state,
        printQRInTerminal: true 
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.BOT_NUMBER;
        if (phoneNumber) {
            setTimeout(async () => {
                let code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
                console.log("\n🔑 *YOUR PAIRING CODE:* " + code + "\n");
            }, 3000);
        }
    }

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "open") {
            console.log("✅ KIRA X MD Connected Successfully!");
            
            // സെഷൻ ഐഡി സ്വന്തം നമ്പറിലേക്ക് അയക്കാൻ
            if (fs.existsSync('./session/creds.json')) {
                const sessionData = fs.readFileSync('./session/creds.json', 'utf8');
                const sessionId = Buffer.from(sessionData).toString('base64');
                const ownerNumber = process.env.BOT_NUMBER + "@s.whatsapp.net";
                
                await sock.sendMessage(ownerNumber, { text: "🚀 *YOUR SESSION ID:*\n\n" + sessionId });
                console.log("✅ Session ID sent to your WhatsApp!");
            }
        }

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startKira();
            else console.log("❌ Logged Out. Delete session folder and scan again.");
        }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message) return;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            const prefix = process.env.PREFIX || ".";
            if (!text.startsWith(prefix)) return;

            const commandName = text.slice(prefix.length).trim().split(" ")[0].toLowerCase();
            const args = text.slice(prefix.length + commandName.length).trim().split(/ +/).filter(Boolean);
            const command = commands.find(cmd => cmd.name === commandName || (cmd.alias && cmd.alias.includes(commandName)));

            if (command) await command.execute(sock, msg, args);
        } catch (err) {
            console.log("Command Error:", err);
        }
    });
}

startKira();