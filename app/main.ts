import * as net from "net";

const server = net.createServer((socket: any) => {
  // socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
  socket.on("data", (data: any) => {
    try {
      console.log(data.toString());
      // socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
      const req = data.toString();
      const path = req.split(' ')[1];
      const res = path === '/' ? `HTTP/1.1 200 OK\r\n\r\n` : "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(res);
      socket.end();
    } catch (error) {
      var string = data.toString();
      console.log(string);
    }
  });
  // socket.on("error", (error: any) => {
  //   console.log(error);
  //   throw error;
  // });
  // socket.end();
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
