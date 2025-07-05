const config = require('../config');
const { cmd } = require('../command');

// Map des menus
const menuMap = {
  "1": "download",
  "2": "group",
  "3": "fun",
  "4": "owner",
  "5": "ai",
  "6": "anime",
  "7": "convert",
  "8": "other",
  "9": "reactions",
  "10": "main"
};

// Message selon l'heure
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "🌅 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ";
  if (hour >= 12 && hour < 18) return "🌞 ɢᴏᴏᴅ ᴀꜰᴛᴇʀɴᴏᴏɴ";
  return "🌙 ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ";
}

// Enregistrement des IDs de menu envoyés
const menuMessageIds = {};

cmd({
  pattern: "menu2",
  react: "📘",
  desc: "Show interactive category menu",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, sender, reply }) => {
  try {
    // Générer le menu
    let menu = {};
    for (let i = 0; i < commands.length; i++) {
      if (commands[i].pattern && !commands[i].dontAddCommandList) {
        let cat = commands[i].category || 'other';
        if (!menu[cat]) menu[cat] = '';
        menu[cat] += `┃◈ ${commands[i].pattern}\n`;
      }
    }

    const madeMenu = `*┌──◆*
*│ 『 𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎ɴ-𝐌𝐃 』*
*└─┬◆*
*┌─┤ ${getGreeting()}*
*│  ╰────────────────╯*
*│◓ ᴜsᴇʀ : ${pushname}*
*│◓ ᴏᴡɴᴇʀ : ${config.OWNER_NAME}*
*│◓ ʙᴀɪʟʏs : ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ*
*│◓ ᴛʏᴘᴇ : ɴᴏᴅᴇᴊs*
*│◓ ᴅᴇᴠ : ᴅʏʙʏ ᴛᴇᴄʜ*
*│◓ ᴍᴏᴅᴇ : ${config.MODE}*
*│◓ ᴘʀᴇғɪx : 「 ${config.PREFIX} 」*
*│◓ ᴠᴇʀsɪᴏɴ : 1.0.0 ʙᴇᴛᴀ*
*╰─────────────────⊷*

> *╭∘━━* *𝐌𝐄𝐍𝐔*
> *│☆* ❶ *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
> *│☆* ❷ *ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
> *│☆* ❸ *ғᴜɴ ᴍᴇɴᴜ*
> *│☆* ❹ *ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
> *│☆* ❺ *ᴀɪ ᴍᴇɴᴜ*
> *│☆* ❻ *ᴀɴɪᴍᴇ ᴍᴇɴᴜ*
> *│☆* ❼ *ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
> *│☆* ❽ *ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
> *│☆* ❾ *ʀᴇᴀᴄᴛɪᴏɴs ᴍᴇɴᴜ*
> *│☆* ➓ *ᴍᴀɪɴ ᴍᴇɴᴜ*
> *╰─────────────┈⊷*

_ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ (1–10) ᴛᴏ ᴏᴘᴇɴ ᴀ ᴄᴀᴛᴇɢᴏʀʏ._

*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: `https://files.catbox.moe/roubzi.jpg` },
      caption: madeMenu,
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401051937059@newsletter',
          newsletterName: '𝐌𝐄𝐆𝐀ʟᴏᴅᴏɴ-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Enregistre le message pour l'interaction
    if (!menuMessageIds[from]) menuMessageIds[from] = [];
    menuMessageIds[from].push(sentMsg.key.id);

  } catch (e) {
    console.error("Error in menu2:", e);
    reply("❌ Error while showing the menu.");
  }
});

// Gestion des réponses au menu
conn.ev.on("messages.upsert", async ({ messages }) => {
  try {
    const msg = messages?.[0];
    if (!msg?.message || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') return;

    const from = msg.key.remoteJid;
    const reply_to = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const selected = text.trim();

    // Si la réponse correspond à un message de menu
    if (reply_to && menuMessageIds[from]?.includes(reply_to)) {
      if (!menuMap[selected]) {
        return conn.sendMessage(from, {
          text: "❌ ɪɴᴠᴀʟɪᴅ ᴏᴘᴛɪᴏɴ. ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ғʀᴏᴍ 1 ᴛᴏ 10."
        }, { quoted: msg });
      }

      const category = menuMap[selected];
      const cmds = commands.filter(cmd => cmd.category === category && cmd.pattern && !cmd.dontAddCommandList);

      if (!cmds.length) {
        return conn.sendMessage(from, {
          text: `❌ ɴᴏ ᴄᴏᴍᴍᴀɴᴅs ғᴏᴜɴᴅ ɪɴ "${category}" ᴍᴇɴᴜ.`
        }, { quoted: msg });
      }

      let result = `╭───〔 *${category.toUpperCase()} MENU* 〕───╮\n`;
      for (let cmd of cmds) {
        result += `┃◈ ${cmd.pattern}\n`;
      }
      result += `╰──────────────────────⊷\n`;
      result += `\n_ʀᴇǫᴜᴇsᴛᴇᴅ ʙʏ: ${msg.pushName || msg.key.participant?.split('@')[0]}_`;

      await conn.sendMessage(from, { text: result }, { quoted: msg });
    }

  } catch (err) {
    console.error("Error in menu2 reply handler:", err);
  }
});
