
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const pkg = require('../package.json');

cmd({
    pattern: "uptime",
    alias: ["runtime", "run"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const uptime = runtime(process.uptime());
        const seconds = Math.floor(process.uptime());
        const startTime = new Date(Date.now() - seconds * 1000);
        const version = pkg.version || "1.0.0";

        const styles = [
`╭───『 UPTIME 』───⳹
│ ⏱️ ${uptime}
│ 🧭 ${seconds} seconds
│ 🚀 Started: ${startTime.toLocaleString()}
╰────────────────⳹
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`,

`🅤🅟🅣🅘🅜🅔 🅢🅣🅢🅣🅤🅢

♢ ʀᴜɴɴɪɴɢ: ${uptime}
♢ sᴇᴄᴏɴᴅs: ${seconds}
♢ sɪɴᴄᴇ: ${startTime.toLocaleDateString()}
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`,

`┌──────────────────────┐
│  ⚡ UPTIME STATUS ⚡  
├─────────────────────
│ • ᴛɪᴍᴇ: ${uptime}
│ • sᴇᴄᴏɴᴅs: ${seconds}
│ • sᴛᴀʀᴛᴇᴅ: ${startTime.toLocaleString()}
│ • ᴠᴇʀsɪᴏɴ: ${version}
└──────────────────────┘`,

`▰▰▰▰▰ 🅤🅟🅣🅘🅜🅔 ▰▰▰▰▰

> ⏳ ${uptime}
> 🕰️ ${startTime.toLocaleString()}
> 🔢 ${seconds} seconds
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ*`,

`╔══════════════════════╗
║   𝐌𝐄𝐆𝐀𝐋𝐎𝐃𝐎𝐍-𝐌𝐃 UPTIME    
╠══════════════════════
║  ʀᴜɴᴛɪᴍᴇ: ${uptime}
║  sᴇᴄᴏɴᴅs: ${seconds}
║  sɪɴᴄᴇ: ${startTime.toLocaleString()}
╚══════════════════════╝`
        ];

        let selectedStyle;
        if (args[0] && args[0].toLowerCase().startsWith("style")) {
            const index = parseInt(args[0].replace("style", "")) - 1;
            if (!isNaN(index) && styles[index]) {
                selectedStyle = styles[index];
            } else {
                return reply(`❌ sᴛʏʟᴇ ɴᴏᴛ ғᴏᴜɴᴅ.\n✅ ᴜsᴇ: sᴛʏʟᴇ1 ᴛᴏ sᴛʏʟᴇ${styles.length}`);
            }
        } else {
            selectedStyle = styles[Math.floor(Math.random() * styles.length)];
        }

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/w1l8b0.jpg' },
            caption: selectedStyle,
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
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
