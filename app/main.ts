import * as net from "net";

const server = net.createServer((socket: any) => {
  // socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
  socket.on("data", (data: any) => {
    try {
      console.log(data.toString());
      socket.write(`HTTP/1.1 200 OK\r\n\r\n`);
      socket.end();
    } catch (error) {
      var string = data.toString();
      console.log(string);
    }
  });
  socket.on("error", (error: any) => {
    console.log(error);
    throw error;
  });
  socket.end();
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});

server.listen("/index.html", "localhost", (req : any, res : any) => {
    console.log("getting index.html...");
});
