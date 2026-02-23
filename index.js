const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({ checkUpdate: false });
const TOKEN = process.env.DISCORD_TOKEN;
const ODA_ID = "1407413900764250174";

client.on('ready', async () => {
    console.log(`${client.user.tag} aktif! Kanala bağlanılıyor...`);
    connectToVoice();
});

function connectToVoice() {
    const channel = client.channels.cache.get(ODA_ID);
    if (!channel) return console.log("HATA: Kanal bulunamadı.");

    try {
        // Doğru v13 bağlantı metodu
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
        console.log("--> Ses kanalına başarıyla girildi.");
    } catch (err) {
        console.error("Bağlantı hatası oluştu:", err);
        setTimeout(connectToVoice, 10000);
    }
}

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log("Bağlantı kesildi, tekrar deneniyor...");
        setTimeout(connectToVoice, 15000);
    }
});

client.login(TOKEN);
