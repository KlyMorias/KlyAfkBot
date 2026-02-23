const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const TOKEN = process.env.DISCORD_TOKEN;
const ODA_ID = "1407413900764250174";

client.on('ready', async () => {
    console.log(`${client.user.tag} aktif! Odaya giriliyor...`);
    connectToVoice();
});

async function connectToVoice() {
    const channel = client.channels.cache.get(ODA_ID);
    if (!channel) return console.log("HATA: Kanal bulunamadı. ID doğru mu?");

    try {
        // Selfbot-v13 için en stabil bağlanma yöntemi
        await channel.join(); 
        
        // Mikrofonu kapatma/açma (opsiyonel)
        const voice = channel.guild.me.voice;
        await voice.setSelfDeaf(true);
        await voice.setSelfMute(false);

        console.log("--> Ses kanalına başarıyla girildi.");
    } catch (err) {
        console.error("Bağlantı hatası:", err);
        // Hata durumunda 10 saniye sonra tekrar dene
        setTimeout(connectToVoice, 10000);
    }
}

// Bağlantı koparsa otomatik tekrar bağlanma
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log("Bağlantı kesildi, 15 saniye sonra tekrar denenecek...");
        setTimeout(connectToVoice, 15000);
    }
});

client.login(TOKEN);
