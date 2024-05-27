import * as net from 'net';
export function root(socket: net.Socket, headers: string) {
    socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
}