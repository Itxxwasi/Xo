const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "bcgroup",
  alias: ["bcgc"],
  desc: "Broadcast a message to all groups (owner only)",
  category: "owner",
  react: "📢",
  filename: __filename
}, async (conn, m, msg, { text, prefix, command, isCreator, reply, isOwner }) => {
  try {
    if (!isCreator && !isOwner) return reply("❌ *ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.*");

    if (!text) return reply(`❗ *ᴘʟᴇᴀsᴇ ᴇɴᴛᴇʀ ᴀ ᴍᴇssᴀɢᴇ ᴛᴏ ʙʀᴏᴀᴅᴄᴀsᴛ.*\n\nExample: ${prefix + command} ʜᴇʟʟᴏ ᴇᴠᴇʀʏᴏɴᴇ!`);

    const groupsData = await conn.groupFetchAllParticipating();
    const groups = Object.entries(groupsData).map(entry => entry[1]);
    const groupJids = groups.map(group => group.id);

    reply(`📢 sᴇɴᴅɪɴɢ ʙʀᴏᴀᴅᴄᴀsᴛ ᴛᴏ *${groupJids.length}* ɢʀᴏᴜᴘs...\n⏳ ᴇsᴛɪᴍᴀᴛᴇᴅ ᴛɪᴍᴇ: ~${(groupJids.length * 1.5).toFixed(1)} seconds`);

    for (const jid of groupJids) {
      await sleep(1500);

      const message = `\`\`\`\n${text}\n\`\`\`\n\n_ʙʀᴏᴀᴅᴄᴀsᴛ ғʀᴏᴍ ᴏᴡɴᴇʀ_`;

      await conn.sendMessage(jid, {
        text: message,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: 'Broadcast by Owner',
            body: `To ${groupJids.length} groups`,
            mediaType: 1,
            thumbnailUrl: 'https://files.catbox.moe/iuexn4.jpg',
            sourceUrl: global.link,
            renderLargerThumbnail: true
          }
        }
      });
    }

    reply(`✅ *ʙʀᴏᴀᴅᴄᴀsᴛ sᴇɴᴛ ᴛᴏ ${groupJids.length} ɢʀᴏᴜᴘs sᴜᴄᴄᴇssғᴜʟʟʏ.*`);
  } catch (e) {
    console.error(e);
    reply("❌ *An error occurred while broadcasting.*");
  }
});
