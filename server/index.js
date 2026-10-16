import "dotenv/config";
import http from "node:http";
import { handleLinkCheck, MAX_REQUEST_BYTES } from "../api/check-link-handler.mjs";

const PORT = Number(process.env.PORT || 8787);

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let settled = false;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      if (settled) return;
      body += chunk;
      if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BYTES) {
        settled = true;
        reject(new Error("request_too_large"));
      }
    });
    request.on("end", () => { if (!settled) resolve(body); });
    request.on("error", (error) => { if (!settled) reject(error); });
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    return sendJson(response, 200, { ok: true });
  }
  if (request.url === "/check-link") {
    if (Number(request.headers["content-length"]) > MAX_REQUEST_BYTES) {
      request.resume();
      return sendJson(response, 413, { error: "Request body is too large." });
    }
    let body;
    try {
      body = await readRequestBody(request);
    } catch (error) {
      if (error.message === "request_too_large") {
        return sendJson(response, 413, { error: "Request body is too large." });
      }
      return sendJson(response, 400, { error: "Invalid request body." });
    }
    const result = handleLinkCheck({
      method: request.method,
      body,
      contentLength: request.headers["content-length"],
    });
    return sendJson(response, result.status, result.body);
  }
  return sendJson(response, 404, { error: "Not found." });
});

server.listen(PORT, () => {
  console.log(`Cydefora API listening on http://localhost:${PORT}`);
});