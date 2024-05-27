import * as net from 'net';
export function userAgent(socket: net.Socket, target: string, headers: string[]) {
    let responseBody = '';

    const headerPrefix = 'user-agent:';
    const uaHeader = headers.find((h) => h.toLowerCase().startsWith(headerPrefix));
    if (uaHeader) {
        responseBody = uaHeader.slice(headerPrefix.length);
    }

    console.log(responseBody);


    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`);
}