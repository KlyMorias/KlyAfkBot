const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const TOKEN = process.env.DISCORD_TOKEN;
const ODA_ID = "1407413900764250174";

client.on('ready', async () => {
    console.log(`${client.user.tag} aktif! Kanala bağlanılıyor...`);
    connectToVoice();
});

async function connectToVoice() {
    const channel = client.channels.cache.get(ODA_ID);
    if (!channel) return console.log("HATA: Belirtilen kanal bulunamadı.");

    try {
        // Selfbot library handles voice internally much better
        const connection = await channel.join();
        
        // Ses ayarlarını yap (Susturma/Sağırlaştırma)
        await connection.voice.setSelfDeaf(true);
        await connection.voice.setSelfMute(false);

        console.log("--> Ses kanalına başarıyla giriş yapıldı.");
    } catch (err) {
        console.error("Bağlantı hatası oluştu:", err);
        // Hata durumunda 10 saniye sonra tekrar dene
        setTimeout(connectToVoice, 10000);
    }
}

// Bağlantı düşerse otomatik tekrar bağlan
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log("Bağlantı kesildi, 15 saniye içinde tekrar bağlanılacak...");
        setTimeout(connectToVoice, 15000);
    }
});

client.login(TOKEN);
