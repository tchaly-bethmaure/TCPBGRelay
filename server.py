import socket

HOST = "0.0.0.0"  # Standard loopback interface address (localhost)
PORT = 999
conns = []
addrs = []

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((socket.getaddrinfo(HOST, 80)[0][4][0], PORT))
    s.listen()
    if len(addrs) < 2:
        conn, addr = s.accept()
        conns.append(conn)
        addrs.append(addr)
        with conn:
            print(f"Connected by {addr}")
            while True:
                data = conn.recv(10)
                for add in addrs:
                    if add == addrs[0]:
                        conn.sendto(data, addrs[1])
                    else:
                        conn.sendto(data, addrs[0])
    else:
        print("Maximum connection attained.")

