const { Client } = require('discord.js-selfbot-v13');

// Hata veren ayar okumasını devre dışı bırakmak için bu ayarla başlatıyoruz
const client = new Client({
    checkUpdate: false,
    patchVoice: true // Ses kanalları için ekstra kararlılık
});

const TOKEN = process.env.DISCORD_TOKEN;
const ODA_ID = "1407413900764250174";

client.on('ready', async () => {
    console.log(`${client.user.tag} aktif!`);
    connectToVoice();
});

async function connectToVoice() {
    const channel = client.channels.cache.get(ODA_ID);
    if (!channel) return;
    
    try {
        const { joinVoiceChannel } = require('@discordjs/voice');
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log("Sese girildi.");
    } catch (e) {
        console.error("Hata:", e);
    }
}

// Sesten atılınca 15 saniye bekleme mantığı
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        setTimeout(() => {
            if (!client.voice.adapters.size) connectToVoice();
        }, 15000);
    }
});

client.login(TOKEN);
