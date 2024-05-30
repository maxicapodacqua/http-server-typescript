import * as net from "net";

const validEncodings = ["gzip"];
export function echo(socket: net.Socket, target: string, headers: string[]) {
  const responseBody = target.slice("/echo/".length);

  let contentEncodingHeader = "";
  for (const headerLine of headers) {
    const [name, rawValues] = headerLine.split(":");
    const value = rawValues
      .split(",")
      .find((v) => validEncodings.includes(v.trim()));
    if (name.toLowerCase() === "accept-encoding" && value !== undefined) {
      contentEncodingHeader = `Content-Encoding:  ${value.trim()}\r\n`;
    }
  }

  socket.write(
    `HTTP/1.1 200 OK\r\n${contentEncodingHeader}Content-Type: text/plain\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`
  );
}
