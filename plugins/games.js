// plugins/games.js – KIRA X MD (Lobby & Game Engine)
const globalGames = global.gameSessions = {}; // ലobby ഡാറ്റ ഇവിടെ സൂക്ഷിക്കും

module.exports = [
    // 1. GAME LOBBY (Start)
    {
        name: 'game',
        category: 'game',
        description: 'Start a game (math, quiz, word, anime, ttt)',
        usage: '.game math',
        async execute(sock, msg, args) {
            const jid = msg.key.remoteJid;
            const type = args[0]?.toLowerCase();
            const allowedGames = ['math', 'quiz', 'word', 'anime', 'ttt'];
            
            if (!allowedGames.includes(type)) return await sock.sendMessage(jid, { text: '⚠️ *Available:* math, quiz, word, anime, ttt' });
            if (globalGames[jid]) return await sock.sendMessage(jid, { text: '⚠️ *A game is already active in this group! Use .stop to end it.*' });

            globalGames[jid] = { type, players: [], status: 'waiting', ans: null };
            await sock.sendMessage(jid, { text: `🎮 *GAME LOBBY OPENED: ${type.toUpperCase()}*\n\nType *.join* to enter.\nGame will auto-start in 20 seconds!\n\n⚠️ *Use .stop to end the game anytime.*` });

            // 20 സെക്കൻഡ് ടൈമർ
            setTimeout(async () => {
                if (!globalGames[jid] || globalGames[jid].status === 'running') return;
                if (globalGames[jid].players.length === 0) {
                    await sock.sendMessage(jid, { text: '❌ *No players joined! Game cancelled.*' });
                    delete globalGames[jid];
                } else {
                    globalGames[jid].status = 'running';
                    await sock.sendMessage(jid, { text: `🚀 *Game Starting!* Players: ${globalGames[jid].players.map(p => p.name).join(', ')}\n\n⚠️ *Admin/Players can use .stop to end.*` });
                    triggerGame(sock, jid, type);
                }
            }, 20000);
        }
    },
    // 2. JOIN
    {
        name: 'join',
        category: 'game',
        description: 'Join the lobby',
        usage: '.join',
        async execute(sock, msg) {
            const jid = msg.key.remoteJid;
            const sender = msg.key.participant || jid;
            const name = msg.pushName || "Player";
            if (!globalGames[jid] || globalGames[jid].status !== 'waiting') return;
            if (globalGames[jid].players.find(p => p.id === sender)) return;
            globalGames[jid].players.push({ id: sender, name });
            await sock.sendMessage(jid, { text: `✅ *${name} joined the game!*` });
        }
    },
    // 3. STOP
    {
        name: 'stop',
        category: 'game',
        description: 'Stop the game',
        usage: '.stop',
        async execute(sock, msg, args, isOwner) {
            const jid = msg.key.remoteJid;
            const sender = msg.key.participant || jid;
            const session = globalGames[jid];
            if (!session) return;

            const meta = await sock.groupMetadata(jid);
            const isAdmin = meta.participants.some(p => p.id === sender && p.admin);
            const isPlayer = session.players.find(p => p.id === sender);

            if (isOwner || isAdmin || isPlayer) {
                delete globalGames[jid];
                await sock.sendMessage(jid, { text: '🛑 *Game stopped successfully!*' });
            } else {
                await sock.sendMessage(jid, { text: '❌ *Only Admins or Players can stop the game!*' });
            }
        }
    }
];

// ─── GAME LOGIC ───
async function triggerGame(sock, jid, type) {
    const session = globalGames[jid];
    if (type === 'math') {
        const a = Math.floor(Math.random()*50)+10, b = Math.floor(Math.random()*50)+10;
        session.ans = (a + b).toString();
        await sock.sendMessage(jid, { text: `🧮 *MATHS (Hard)*\n${a} + ${b} = ?` });
    } else if (type === 'quiz') {
        session.ans = "delhi";
        await sock.sendMessage(jid, { text: `❓ *QUIZ (Medium)*\nCapital of India?` });
    } else if (type === 'word') {
        session.ans = "kira";
        await sock.sendMessage(jid, { text: `🔠 *WORD FINDER*\nStarts with: K | Total Letters: 4` });
    } else if (type === 'anime') {
        session.ans = "naruto";
        await sock.sendMessage(jid, { text: `👺 *ANIME GUESS*\nStarts with: N | Total Letters: 6` });
    } else if (type === 'ttt') {
        await sock.sendMessage(jid, { text: `❌⭕ *TicTacToe*\nGame started! (Use .ttt 1-9 to play)` });
    }
}