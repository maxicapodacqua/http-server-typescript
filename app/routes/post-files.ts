import * as net from "net";
import * as fs from "fs";

export function postFiles(socket: net.Socket, target: string, headers: string[], data: string | undefined) {
  let directory = process.argv[3] ?? null;

  const filename = target.slice("/files/".length);

  try {
    let responseBody = "";
    fs.writeFileSync(directory + filename, data + "");
    socket.write(
      `HTTP/1.1 201 Created\r\nContent-Type: application/octet-stream\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`
    );
  } catch (e) {
    socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
  }
}
