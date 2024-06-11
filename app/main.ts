import * as net from "net";
import fs from "node:fs";

//  * Normal Request: GET /index.html HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
// Request Line: GET /index.html HTTP/1.1\r\n
// Headers: Host: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
//  * GET /echo/abc HTTP/1.1\r\n Host: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
//  * Normal Response with body: HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\nabc

async function readFileFromDir(query:string) {
  try {
    const data = fs.readFileSync(query);
    return data;
  } catch (e) {
    console.log(e)
    return null;
  }
}

function searchDirectory(query:string, file:string) {
  try {
    const objects_in_dir = fs.readdirSync(query);
    for (const object of objects_in_dir) {
      console.log(`object in dir: `, object);
      console.log(typeof object)
      const statObject = fs.statSync(object);
      if (statObject.isDirectory()) {
        searchDirectory(query + "/" + object, file);
      } else if (statObject.isFile()) {
        if (object === file) {
          console.log(`founded object file: ${file}`, object);
          return true;
        }
      } else {
        return false;
      }
    }
  } catch (err) {
    console.log("searchDirectory Error Log: ", err);
  }

}

const server = net.createServer((socket: any) => {
  socket.on("data", (data: any) => {
    try {
      const req = data.toString();
      console.log("Request: ", req);
      const path = req.split("\r\n")[0].split(" ")[1];
      console.log("path: ", path);
      const query = req.split(" ")[1].split("/")[2];
      const userAgent = req.split("\r\n")[2].split(" ")[1];
      console.log("User Agent: ", userAgent);
      console.log("query: ", query);
      let res = "";
      if (path === "/") {
        res = `HTTP/1.1 200 OK\r\n\r\n`;
        console.log("Response: ", res);
      } else if (path === `/echo/${query}`) {
        res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${query.length}\r\n\r\n${query}`;
        console.log("Response: ", res);
      } else if (path === `/user-agent`) {
        res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      } else if (path === `/files/${query}`) {
        try {
          // const data = readFileFromDir(query);
          searchDirectory("./", "main.ts")
          res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${query.length}\r\n\r\nHello, World!`;
        } catch (error) {
          res = `HTTP/1.1 404 Not Found\r\n\r\n`;
        }
      } else {
        res = `HTTP/1.1 404 Not Found\r\n\r\n`;
        console.log("Response: ", res);
      }
      socket.write(res);
      socket.end();
    } catch (error) {
      var string = data.toString();
      console.log(string);
    }
  });
});

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.listen(4221, "localhost", () => {
  console.log("Server is running on port 4221");
});
