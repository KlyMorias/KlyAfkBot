import discord
import asyncio
from flask import Flask
from threading import Thread

# --- UYANIK TUTMA ---
app = Flask('')
@app.route('/')
def home(): return "AFK Sistemi Stabil."
def run(): app.run(host='0.0.0.0', port=8080)
def keep_alive(): Thread(target=run).start()

# --- AYARLAR ---
TOKEN = "MTIxMjc3NzIyMjQxNTMxOTA1MA.GLcefR.TbZJ2KjflJoGJ2_arGRCr8D0SXmggd-_LlYkRk"
ODA_OLUSTURMA_KANALI_ID = 1407413900764250174 

class MyBot(discord.Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.is_connecting = False # Çift bağlantıyı engellemek için kilit

    async def on_ready(self):
        print(f'{self.user} hazır. 10 saniye sonra odaya girmeye çalışacak...')
        await asyncio.sleep(10)
        await self.smart_join()

    async def smart_join(self):
        if self.is_connecting: return
        
        # Herhangi bir seste miyiz?
        if self.voice_clients:
            print("Zaten bir ses kanalındayım, işlem iptal.")
            return

        channel = self.get_channel(ODA_OLUSTURMA_KANALI_ID)
        if channel:
            try:
                self.is_connecting = True
                print(f"--> {channel.name} kanalına giriliyor. Beni taşıması için 30 saniye bekleyeceğim...")
                await channel.connect(reconnect=True, timeout=20)
                
                # JTC botunun bizi taşıması için uzun bir süre hiçbir şeye dokunmuyoruz
                await asyncio.sleep(30) 
                self.is_connecting = False
            except Exception as e:
                print(f"Bağlantı denemesi başarısız: {e}")
                self.is_connecting = False

    async def on_voice_state_update(self, member, before, after):
        if member.id == self.user.id:
            # Sadece sesten tamamen koparsak tetiklensin
            if after.channel is None:
                print("!!! Sesten atıldın veya düştün. 20 saniye sonra tekrar denenecek...")
                await asyncio.sleep(20)
                await self.smart_join()
            else:
                # Oda değişmişse (JTC bizi taşımışsa) sadece log yaz, bir şey yapma
                if before.channel and before.channel.id != after.channel.id:
                    print(f"Oda değişti: {after.channel.name}. Burada kalıyorum.")

keep_alive()
client = MyBot()
client.run(TOKEN)