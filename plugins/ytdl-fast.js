const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const fetch = require('node-fetch');
const ytsearch = require('yt-search');

// MP4 video download


cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "download", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʏᴏᴜᴛᴜʙᴇ ᴜʀʟ ᴏʀ ᴠɪᴅᴇᴏ ɴᴀᴍᴇ.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `📹 *ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*
🎬 *ᴛɪᴛʟᴇ:* ${yts.title}
⏳ *ᴅᴜʀᴀᴛɪᴏɴ:* ${yts.timestamp}
👀 *ᴠɪᴇᴡs:* ${yts.views}
👤 *ᴀᴜᴛʜᴏʀ:* ${yts.author.name}
🔗 *ʟɪɴᴋ:* ${yts.url}
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅʏʙʏ ᴛᴇᴄʜ `;

        // Send video directly with caption
        await conn.sendMessage(
            from, 
            { 
                video: { url: data.result.download_url }, 
                caption: ytmsg,
                mimetype: "video/mp4"
            }, 
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});
// MP3 song download 




cmd({ 
    pattern: "play", 
    alias: ["song02", "mp3"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "download", 
    use: '.song <query>', 
    filename: __filename 
}, async (conn, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴏɴɢ ɴᴀᴍᴇ ᴏʀ ʏᴏᴜᴛᴜʙᴇ ʟɪɴᴋ.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("Download failed. Try again later.");

    await conn.sendMessage(from, {
    audio: { url: data.result.downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${song.title}.mp3`}, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});
