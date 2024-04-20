# host.py
import time
from machine import UART
from time import sleep
import _thread
import socket

HOST = "0.0.0.0"
PORT = 999

uart = UART(1, 9600)                         # init with given baudrate
uart.init(9600, bits=10, parity=None, stop=1) # init with given parameters
s = socket.socket(AF_INET, SOCK_STREAM)
s.connect((HOST,PORT))
buffer_in = []
buffer_out = []
WAITING_TIME = 0.05

# read incoming uart from GB and writting to buffer out
def core1_thread():
    while True:
        socket.send(buffer_out.pop())
        data = uart.read(buffer_out.pop())
        time.sleep(WAITING_TIME)
        
# receive data from server and writte it to bufffer; then write it to uart
def core0_thread():
    while True:
        uart.write(buffer_in.pop())
        buffer_in.append(socket.recv(10))
        time.sleep(WAITING_TIME)

if __name__ == "__main__":
    try:
        second_thread = _thread.start_new_thread(core1_thread, ())
        core0_thread()
    except KeyboardInterrupt:
        pass
