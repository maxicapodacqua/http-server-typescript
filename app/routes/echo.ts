import * as net from "net";

const validEncodings = ["gzip"];
export function echo(socket: net.Socket, target: string, headers: string[]) {
  const responseBody = target.slice("/echo/".length);

  let contentEncodingHeader ='';
  for (const headerLine of headers) {
      const [name, value] = headerLine.split(":");
      if (
        name.toLowerCase() === "accept-encoding" &&
        validEncodings.includes(value.trim().toLowerCase())
      ) {
        contentEncodingHeader = `Content-Encoding:  ${value.trim()}\r\n`;
      }
  }

  

  socket.write(
    `HTTP/1.1 200 OK\r\n${contentEncodingHeader}Content-Type: text/plain\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`
  );
}
