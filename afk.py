import discord
import asyncio

# BURAYA BİLGİLERİNİ YAZ
TOKEN = "MTIxMjc3NzIyMjQxNTMxOTA1MA.GLcefR.TbZJ2KjflJoGJ2_arGRCr8D0SXmggd-_LlYkRk"
ODA_OLUSTURMA_KANALI_ID = 1407413900764250174  # 'Oda Oluştur' yazan o ilk kanalın ID'si

class MyBot(discord.Client):
    async def on_ready(self):
        print(f'{self.user} olarak giriş yapıldı! Odaya bağlanılıyor...')
        await self.join_voice()

    async def join_voice(self):
        # Oda oluşturma kanalını buluyoruz
        channel = self.get_channel(ODA_OLUSTURMA_KANALI_ID)
        if channel:
            try:
                # O kanala giriş yapıyoruz
                await channel.connect(reconnect=True)
                print(f"{channel.name} kanalına girildi. Sunucu botu seni özel odaya çekecek.")
            except Exception as e:
                print(f"Bağlanırken hata oluştu: {e}")

    # Eğer sesten düşersen veya biri seni odadan atarsa otomatik tekrar girer
    async def on_voice_state_update(self, member, before, after):
        # Sadece kendi hesabımızın hareketlerini kontrol et
        if member.id == self.user.id:
            # Eğer sesten tamamen koptuysak (after.channel None ise)
            if after.channel is None:
                print("Sesten koptun! 5 saniye içinde tekrar giriliyor...")
                await asyncio.sleep(5)  # Ban yememek için 5 saniye bekle
                await self.join_voice()

client = MyBot()
client.run(TOKEN)