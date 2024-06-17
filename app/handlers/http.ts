export default class HttpHandler {
  // private readonly path: string;
  // constructor(path: string) {
  //   this.path = path;
  // }

  public extractHeader(request: string): { [headerKey: string]: string } {
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

  public extractPath(request: string): { 
    method: string,
    path: string,
    protocol: string
 } {
    const lines = request.split("\r\n");
    const firstLine = lines[0];
    const [method, path, protocol] = firstLine.split(" ");
    return {
      method,
      path,
      protocol,
    };
  }

  public extractQuery(request: string):  string {
    const lines = request.split("\r\n")[2];
    return lines.split("/")[1];
  }
  
  private HttpResponseBuilder (
    statusCode: number,
    statusMessage: string,
    headers: { [headerKey: string]: string },
    body?: string
  ) : string {
    const headerLines = Object.keys(headers).map((headerKey) => {
      return `${headerKey}: ${headers[headerKey]}`;
    });
    const response = [
      `HTTP/1.1 ${statusCode} ${statusMessage}`,
     ...headerLines,
      "",
      body,
    ].join("\r\n");
    return response;
  }

}
