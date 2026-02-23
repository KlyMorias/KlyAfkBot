const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

// AYARLAR
const TOKEN = process.env.DISCORD_TOKEN; // Güvenlik için tokenı panelden ekleyeceğiz
const ODA_ID = "1407413900764250174"; // Senin kanal ID'n

client.on('ready', async () => {
  console.log(`${client.user.tag} aktif!`);
  connectToVoice();
});

async function connectToVoice() {
  const channel = client.channels.cache.get(ODA_ID);
  if (!channel) return console.log("Kanal bulunamadı!");

  try {
    const { joinVoiceChannel } = require('@discordjs/voice');
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: true // Hoparlörü kapatır (AFK kalmak için daha iyi)
    });
    console.log("--> Ses kanalına girildi.");
  } catch (err) {
    console.error("Bağlantı hatası:", err);
  }
}

// SESTEN ATILMA KONTROLÜ
client.on('voiceStateUpdate', async (oldState, newState) => {
  // Sadece kendi hesabımızı kontrol et
  if (oldState.member.id !== client.user.id) return;

  // Eğer sesten tamamen koptuysak (newState.channelId null ise)
  if (!newState.channelId) {
    console.log("!!! Sesten düşüldü. 15 saniye bekleniyor...");
    
    // 15 saniye bekle (Taşınma payı)
    setTimeout(() => {
      // 15 saniye sonra hala seste değilsek tekrar bağlan
      if (!client.voice.adapters.size) {
        console.log("Hala seste değilim, tekrar bağlanılıyor...");
        connectToVoice();
      } else {
        console.log("Sistem beni odaya taşımış, işlem iptal.");
      }
    }, 15000); 
  }
});

client.login(TOKEN);
