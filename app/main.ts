import * as net from "net";
import fs from "node:fs";

//  * Normal Request: GET /index.html HTTP/1.1\r\nHost: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
// Request Line: GET /index.html HTTP/1.1\r\n
// Headers: Host: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
//  * GET /echo/abc HTTP/1.1\r\n Host: localhost:4221\r\nUser-Agent: curl/7.64.1\r\nAccept: */*\r\n\r\n
//  * Normal Response with body: HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: 3\r\n\r\nabc

async function readFileFromDir(query: string) {
  try {
    const data = fs.readFileSync(query);
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function searchDirectory(query: string, file: string) {
  try {
    console.log(`==== CURRENT PATH: ${query} ====`);
    console.log(`==== FILE: ${file} ====`);
    const objects_in_dir = fs.readdirSync(query);
    if (objects_in_dir.length > 0) {
      console.log(`All objects current in dir: `, objects_in_dir);
      for (const object of objects_in_dir) {
        console.log(`-- object in dir: `, object);
        const statObject = fs.statSync(query + object);
        if (statObject.isDirectory()) {
          searchDirectory(query + object + "/", file);
        } else if (statObject.isFile()) {
          if (object === file) {
            console.log(`founded object file: ${file}`, object);
            return true;
          }
        } else {
          return false;
        }
      }
    } else {
      console.log("No objects in dir");
      return false;
    }
  } catch (err) {
    console.log("searchDirectory Error Log: ", err);
  }
}

const server = net.createServer((socket: any) => {
  socket.on("data", (data: any) => {
    try {
      const req = data.toString();
      const path = req.split("\r\n")[0].split(" ")[1];
      const query = req.split(" ")[1].split("/")[2];
      const userAgent = req.split("\r\n")[2].split(" ")[1];
      const method = req.split(" ")[0];
      const content = req.split("\r\n")[req.split("\r\n").length - 1];
      const compression = req.split("\r\n")[2].split(" ")[1];
      console.log("REQUEST: ", req);
      console.log("-- path: ", path);
      console.log("-- User Agent: ", userAgent);
      console.log("-- query: ", query);
      console.log("-- method: ", method);
      console.log("-- content: ", content);
      console.log("-- compression: ", compression);
      let res = "";
      if (path === "/") {
        res = `HTTP/1.1 200 OK\r\n\r\n`;
      } else if (path === `/echo/${query}`) {
        if (compression in ["gzip", "deflate"]) {
          res = `HTTP/1.1 200 OK\r\nContent-Encoding: ${compression}\r\nContent-Type: text/plain\r\nContent-Length: ${query.length}\r\n\r\n${query}`;
        } else {
          res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${query.length}\r\n\r\n${query}`;
        }

        // if (compression !== 'invalid-encoding') {
        //   res = `HTTP/1.1 200 OK\r\nContent-Encoding: ${compression}\r\nContent-Type: text/plain\r\nContent-Length: ${query.length}\r\n\r\n${query}`;
        // }
        // else res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${query.length}\r\n\r\n${query}`;
      } else if (path === `/user-agent`) {
        res = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
      } else if (path === `/files/${query}`) {
        try {
          if (method == "POST") {
            try {
              console.log("Creating file...");
              fs.writeFileSync(
                `/tmp/data/codecrafters.io/http-server-tester/${query}`,
                content,
                "utf8"
              );
              res = `HTTP/1.1 201 Created\r\n\r\n`;
              console.log("Created and saved file.");
            } catch (error) {
              console.log("Something wrong with POST file.");
              res = `HTTP/1.1 404 Not Found\r\n\r\n`;
            }
          } else {
            const [___, absPath] = process.argv.slice(2);
            const filePath = absPath + "/" + query;
            try {
              const content = fs.readFileSync(filePath);
              res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`;
            } catch (error) {
              console.log("Something wrong with GET file.");
              res = `HTTP/1.1 404 Not Found\r\n\r\n`;
            }
          }
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
