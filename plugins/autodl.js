module.exports = {
    name: "autodl",
    alias: ["adl"],
    category: "owner",
    description: "Auto Downloader",

    async execute(sock, msg, args) {
        const jid = msg.key.remoteJid;

        global.autoDlChats =
            global.autoDlChats || [];

        global.autoDlAllGroups =
            global.autoDlAllGroups || false;

        global.autoDlAllDms =
            global.autoDlAllDms || false;

        const action =
            (args[0] || "").toLowerCase();

        const target =
            (args[1] || "").toLowerCase();

        if (action === "on") {

            if (target === "groups") {
                global.autoDlAllGroups = true;

                return sock.sendMessage(
                    jid,
                    {
                        text:
                            "✅ AutoDL enabled for all groups."
                    },
                    { quoted: msg }
                );
            }

            if (target === "dms") {
                global.autoDlAllDms = true;

                return sock.sendMessage(
                    jid,
                    {
                        text:
                            "✅ AutoDL enabled for all DMs."
                    },
                    { quoted: msg }
                );
            }

            if (
                !global.autoDlChats.includes(
                    jid
                )
            ) {
                global.autoDlChats.push(
                    jid
                );
            }

            return sock.sendMessage(
                jid,
                {
                    text:
                        "✅ AutoDL enabled in this chat."
                },
                { quoted: msg }
            );
        }

        if (action === "off") {

            if (target === "groups") {
                global.autoDlAllGroups =
                    false;

                return sock.sendMessage(
                    jid,
                    {
                        text:
                            "❌ AutoDL disabled for all groups."
                    },
                    { quoted: msg }
                );
            }

            if (target === "dms") {
                global.autoDlAllDms =
                    false;

                return sock.sendMessage(
                    jid,
                    {
                        text:
                            "❌ AutoDL disabled for all DMs."
                    },
                    { quoted: msg }
                );
            }

            global.autoDlChats =
                global.autoDlChats.filter(
                    x => x !== jid
                );

            return sock.sendMessage(
                jid,
                {
                    text:
                        "❌ AutoDL disabled in this chat."
                },
                { quoted: msg }
            );
        }

        if (action === "status") {
            return sock.sendMessage(
                jid,
                {
                    text:
`╭──〔 AUTO DL STATUS 〕
├ Chat : ${
global.autoDlChats.includes(
jid
)
? "ON"
: "OFF"
}
├ Groups : ${
global.autoDlAllGroups
? "ON"
: "OFF"
}
├ DMs : ${
global.autoDlAllDms
? "ON"
: "OFF"
}
╰────────────`
                },
                { quoted: msg }
            );
        }

        return sock.sendMessage(
            jid,
            {
                text:
`╭──〔 AUTO DL 〕
├ .autodl on
├ .autodl off
├ .autodl status
├ .autodl on groups
├ .autodl off groups
├ .autodl on dms
╰ .autodl off dms`
            },
            { quoted: msg }
        );
    }
};

async function handleAutoDownload(
    text,
    sock,
    msg
) {
    try {
        const jid =
            msg.key.remoteJid;

        const isGroup =
            jid.endsWith("@g.us");

        const commands =
            global.commands || [];

        const enabled =
            global.autoDlChats?.includes(
                jid
            ) ||
            (
                global.autoDlAllGroups &&
                isGroup
            ) ||
            (
                global.autoDlAllDms &&
                !isGroup
            );

        if (
            !enabled ||
            !text
        ) {
            return false;
        }

        const url =
            text.trim();

        console.log(
            "🔍 AUTO DL:",
            url
        );

        // Instagram
        if (
            /instagram\.com/i.test(
                url
            )
        ) {
            const cmd =
                commands.find(
                    c =>
                        c.name ===
                        "insta"
                );

            if (cmd) {
                await cmd.execute(
                    sock,
                    msg,
                    [url]
                );

                return true;
            }
        }

        // Facebook
        if (
            /facebook\.com|fb\.watch/i
            .test(url)
        ) {
            const cmd =
                commands.find(
                    c =>
                        c.name ===
                        "fb"
                );

            if (cmd) {
                await cmd.execute(
                    sock,
                    msg,
                    [url]
                );

                return true;
            }
        }

        // YouTube
        if (
            /youtube\.com|youtu\.be/i
            .test(url)
        ) {
            const cmd =
                commands.find(
                    c =>
                        c.name ===
                        "ytv"
                );

            if (cmd) {
                await cmd.execute(
                    sock,
                    msg,
                    [url]
                );

                return true;
            }
        }

        // TikTok
        if (
            /tiktok\.com|vt\.tiktok|vm\.tiktok/i
            .test(url)
        ) {
            const cmd =
                commands.find(
                    c =>
                        c.name ===
                        "tiktok"
                );

            if (cmd) {
                await cmd.execute(
                    sock,
                    msg,
                    [url]
                );

                return true;
            }
        }

        // Twitter / X
        if (
            /twitter\.com|x\.com/i
            .test(url)
        ) {
            const cmd =
                commands.find(
                    c =>
                        c.name ===
                        "twitter"
                );

            if (cmd) {
                await cmd.execute(
                    sock,
                    msg,
                    [url]
                );

                return true;
            }
        }

        return false;

    } catch (err) {
        console.log(
            "AUTO DL ERROR:",
            err
        );

        return false;
    }
}

module.exports.handleAutoDownload =
    handleAutoDownload;