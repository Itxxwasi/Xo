const config = require('../config');
const { cmd, commands } = require('../command');

const cooldown = new Map(); // Anti-spam (10 sec par utilisateur)

cmd({
    pattern: "",
    alias: [],
    react: "👑",
    desc: "Réponse automatique à 'dyby'",
    category: "main",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const msg = body?.toLowerCase()?.trim();

        // Ne répondre que si "dyby" est présent mais pas "dybytech"
        if (!msg.includes("dyby") || msg.includes("dybytech")) return;

        // Anti-spam : 10 sec entre deux réponses par utilisateur
        const last = cooldown.get(sender);
        if (last && (Date.now() - last < 10000)) return;
        cooldown.set(sender, Date.now());

        const about = `
*╭┈───────────────•*
*𝗁𝗂 𝖽𝖾𝖺𝗋 👋 ${pushname}*
*╰┈───────────────•*
*╭┈───────────────•*
*│  ◦* *ᴄʀᴇᴀᴛᴇᴅ ʙʏ: ᴅʏʙʏ ᴛᴇᴄʜ*
*│  ◦* *ʀᴇᴀʟ ɴᴀᴍᴇ➠ ᴅʏʙʏ*
*│  ◦* *ɴɪᴄᴋɴᴀᴍᴇ➠ ᴅʏʙʏ ᴛᴇᴄʜ*
*│  ◦* *ᴀɢᴇ➠ ❌*
*│  ◦* *ᴄɪᴛʏ➠ Lɪʙʀᴇᴠɪʟʟᴇ*
*│  ◦* *ᴀ ᴘᴀꜱꜱɪᴏɴᴀᴛᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ᴅᴇᴠ*
*╰┈───────────────•*

*[ • ᴍᴇɢᴀʟᴏᴅᴏɴ-ᴍᴅ - ᴘʀᴏᴊᴇᴄᴛ • ]*

*╭┈───────────────•*
*│  ◦* *▢➠ᴅʏʙʏ-ᴛᴇᴄʜ*
*│  ◦* *▢➠ᴏɴʟʏ 1 ᴅᴇᴠᴇʟᴏᴘᴇʀ*
*╰┈───────────────•*

*•────────────•⟢*
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*
*•────────────•⟢*
`

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/roubzi.jpg' },
            caption: about,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363401051937059@newsletter',
                    newsletterName: '𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
