export default class HttpHandler {
  private readonly path: string;
  constructor(path: string) {
    this.path = path;
  }

  private extractHeader(request: string): { [headerKey: string]: string } {
    const headers: { [headerKey: string]: string } = {};
    const lines = request.split("\r\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === "") {
        break;
      }
      const [headerKey, headerValue] = line.split(": ");
      headers[headerKey] = headerValue;
    }
    return headers;
  }

  private extractPath(request: string): { 
    method: string,
    path: string[],
    protocol: string
 } {
    const lines = request.split("\r\n");
    const firstLine = lines[0];
    const [method, path, protocol] = firstLine.split(" ");
    return {
      method,
      path: path.split("/"),
      protocol,
    };
  }
}
