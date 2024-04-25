from websockets.server import serve
from threading import Thread
import asyncio
from time import sleep

WAITING_TIME = 0.1
buffer =[[]*2]*1
websockets_list = []
client_list = []

class Client:
    def __init__(self, id, ws):
        self.id = id
        self.mywebsocket = ws
        websockets_list.append(ws)

    async def on_message(self):
        data = websockets_list[self.id].recv() # GB A
        print("Receiverd ",data, " ... storing for GB ", self.id)
        buffer[self.id-1%1].append(data) # to GB B

    async def clearing_buffer(self):
        if(len(buffer[self.id]) > 0):
            data = buffer[self.id].pop()
            print("Sending ", data, " to GB ", self.id + 1 % 1)
            websockets_list[data]
    async def run(self):
        while True:
            await self.on_message()
            await self.clearing_buffer()
            sleep(WAITING_TIME)

async def serve_for_good(websocket):
    c = Client(len(websockets_list), websocket)
    client_list.append(c)
    await c.run()

async def main():
    async with serve(serve_for_good, "192.168.1.1", 7777):
        await asyncio.Future() # loop
asyncio.run(main())

