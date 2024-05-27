import * as net from "net";
import { root } from "./routes/root";
import { echo } from "./routes/echo";
import { userAgent } from "./routes/user-agent";
import { files } from "./routes/files";
import { postFiles } from "./routes/post-files";

type Route = {
  matcher: string | ((inputTarget: string) => boolean);
  method: string;
  func: (socket: net.Socket, target: string, headers: string[], data:string|undefined) => void;
};
const ROUTES: Route[] = [
  {
    matcher: "",
    method: "GET",
    func: root,
  },
  {
    matcher: "/",
    method: "GET",
    func: root,
  },
  {
    matcher: (inputTarget: string) => {
      return inputTarget.startsWith("/echo/");
    },
    method: "GET",
    func: echo,
  },
  {
    matcher: "/user-agent",
    method: "GET",
    func: userAgent,
  },
  {
    matcher: (inputTarget: string) => {
      return inputTarget.startsWith("/files/");
    },
    method: "GET",
    func: files,
  },
  {
    matcher: (inputTarget: string) => {
      return inputTarget.startsWith("/files/");
    },
    method: "POST",
    func: postFiles,
  },
];

function getRoute(inputMethod: string, inputTarget: string) {
  return ROUTES.find(({ matcher, method }) => {
    let matched = false;
    if (typeof matcher === "string") {
      matched = inputTarget === matcher;
    } else if (typeof matcher === "function") {
      matched = matcher(inputTarget);
    }
    return inputMethod === method && matched;
  });
}

function readRequest(socket: net.Socket) {
  socket.on("data", (buffer) => {
    const input = buffer.toString();

    const [infoBlock, data] = input.split("\r\n\r\n");
    const [requestLine, ...headers] = infoBlock.split("\r\n");

    const [method, target, protocol] = requestLine.split(" ");

    const route = getRoute(method, target);
    if (route) {
      console.log(`Executing route: ${route.matcher}`);
      route.func(socket, target, headers, data);
    } else {
      socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
    }

    socket.end();
  });
}

const server = net.createServer((socket) => {
  readRequest(socket);
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
