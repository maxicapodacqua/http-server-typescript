import * as net from 'net';
export function echo(socket: net.Socket, target: string, headers: string) {
    const responseBody = target.slice('/echo/'.length);
    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`);
}