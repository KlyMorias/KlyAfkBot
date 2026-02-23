const { Client } = require('discord.js-selfbot-v13');
// Bu ayarlar hatayı aşmanı sağlar
const client = new Client({ 
    checkUpdate: false 
});

const TOKEN = process.env.DISCORD_TOKEN;
const ODA_ID = "1407413900764250174";

client.on('ready', async () => {
    console.log(`${client.user.tag} giriş yaptı!`);
    joinVoice();
});

async function joinVoice() {
    const channel = client.channels.cache.get(ODA_ID);
    if (!channel) return console.log("Kanal bulunamadı, ID doğru mu?");
    
    try {
        const { joinVoiceChannel } = require('@discordjs/voice');
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log("Sese bağlanıldı.");
    } catch (e) {
        console.error("Bağlantı hatası:", e);
    }
}

// Atılınca 15 saniye bekleme mantığı
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log("Sesten düştüm, 15 saniye bekleniyor...");
        setTimeout(() => {
            if (!client.voice.adapters.size) joinVoice();
        }, 15000);
    }
});

client.login(TOKEN);
