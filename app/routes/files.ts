import * as net from "net";
import * as fs from "fs";

export function files(socket: net.Socket, target: string, headers: string[]) {
  let directory = process.argv[3] ?? null;

  const filename = target.slice("/files/".length);

  try {
    let responseBody = "";
    const file = fs.readFileSync(directory + filename);

    responseBody = file.toString();
    socket.write(
      `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`
    );
  } catch (e) {
    // TODO: double check exception to make sure the error is that the file doesn't exist
    socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
  }
}
