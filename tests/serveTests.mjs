import http from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import url from "node:url";

import esbuild from "esbuild";

const port = 8080;

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const extensionContentTypeMap = {
  mp4: "video/mp4",
  webm: "video/webm",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
  html: "text/html",
  vtt: "text/vtt",
};

// Build the test page
await esbuild.build({
  entryPoints: [path.resolve(__dirname, "index.tsx")],
  outfile: path.resolve(__dirname, "./index.js"),
  bundle: true,
  format: "esm",
  target: "es6",
  logLevel: "info",
});

const filePathRegex = /\.[a-z0-9]{2,4}$/;

http
  .createServer((request, response) => {
    // If a request path ends with a file extension, just serve the file for that path;
    // otherwise, we'll assume it's a request for a page so we should just serve the index.html file.
    const requestPath = request.url.match(filePathRegex)
      ? request.url
      : "/index.html";

    const pathname = `${__dirname}${requestPath}`;

    const exists = existsSync(pathname);

    if (!exists) {
      // if the file is not found, return 404
      response.statusCode = 404;
      response.end(`File ${pathname} not found`);
      return;
    }

    response.statusCode = 200;

    // Website you wish to allow to connect
    response.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    response.setHeader("Access-Control-Allow-Methods", "GET");

    // Request headers you wish to allow
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );

    const contentType = extensionContentTypeMap[pathname.split(".").pop()];

    response.setHeader("Content-Type", contentType);

    const fileData = readFileSync(pathname);

    if (contentType.startsWith("video")) {
      const { size } = statSync(pathname);

      response.statusCode = 206;
      response.setHeader("Accept-Ranges", "bytes");
      response.setHeader("Content-Length", size);
      response.setHeader("Content-Range", `bytes 0-${size - 1}/${size}`);
    }

    response.end(fileData);
  })
  .listen(port);

// eslint-disable-next-line no-console
console.log(`Serving test assets at http://localhost:${port}/`);
