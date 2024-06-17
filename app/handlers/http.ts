interface HttpRequest {
  headers: { [headerKey: string]: string };
  method: string;
  path: string;
  protocol: string;
  userAgent: string;
  body?: string;
}

interface HttpResponse {
  statusCode: number;
  statusMessage: string;
  headers: { [headerKey: string]: string };
  body?: string;
}
interface Builder {
  build(): void;
  setHeader(): void;
}
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

  public extractQuery(request: string): string {
    return request.split(" ")[1].split("/")[2];
  }

  public extractPath(request: string): {
    method: string;
    path: string;
    protocol: string;
  } {
    const lines = request.split("\r\n");
    const firstLine = lines[0];
    console.log("extractPath - firstLine: ", firstLine);
    const [method, path, protocol] = firstLine.split(" ");
    return {
      method,
      path,
      protocol,
    };
  }

  private HttpResponseBuilder(
    statusCode: number,
    statusMessage: string,
    headers: { [headerKey: string]: string },
    body?: string
  ): string {
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
