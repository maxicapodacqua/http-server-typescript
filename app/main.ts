import * as net from "net";
import { root } from "./routes/root";

type Route = {
    matcher: string|((inputTarget:string) => boolean),
    method: string,
    func: ((socket: net.Socket, headers:string) => void),
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
    matcher: (inputTarget :string) => {
        return inputTarget.startsWith('/echo/');
    },
    method: "GET",
    func: root,
  },
];

function getRoute(inputMethod: string, inputTarget: string) {
  return ROUTES.find(({ matcher, method }) => {
    let matched = false;
    if (typeof matcher === 'string') {
        matched = inputTarget === matcher;
    } else if (typeof matcher === 'function') {
        matched = matcher(inputTarget);
    }
    return inputMethod === method && matched;
  });
}

function readRequest(socket: net.Socket) {
  socket.on("data", (data) => {
    const input = data.toString();
    console.log(`request: ${input}`);

    const [requestLine, header] = input.split("\r\n");

    const [method, target, protocol] = requestLine.split(" ");

    const route = getRoute(method, target);
    if (route) {
      route.func(socket, header);
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
