import * as net from 'net';


function readRequest(socket:net.Socket ) {
    socket.on('data', (data) => {
        const input = data.toString()
        console.log(`request: ${input}`);

        const [requestLine, header] = input.split('\r\n');
        
        const [method, target, protocol] = requestLine.split(' ');

        const isRoot = target === '' || target === '/';
        if (method === 'GET' && isRoot) {
            socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
        } else {
            socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`);
        }


        socket.end();
    })
}


const server = net.createServer((socket) => {
    readRequest(socket);
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(4221, 'localhost', () => {
    console.log('Server is running on port 4221');
});