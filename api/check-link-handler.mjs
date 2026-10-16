import { analyzeUrl } from "./url-risk-analyzer.mjs";

export const MAX_REQUEST_BYTES = 8192;

export function handleLinkCheck({ method, body, contentLength }) {
  if (method !== "POST") return { status: 405, body: { error: "Method not allowed." } };
  if (Number(contentLength) > MAX_REQUEST_BYTES) {
    return { status: 413, body: { error: "Request body is too large." } };
  }
  if (typeof body !== "string" || Buffer.byteLength(body, "utf8") > MAX_REQUEST_BYTES) {
    return { status: 400, body: { error: "Invalid request body." } };
  }

  let input;
  try {
    input = JSON.parse(body);
  } catch {
    return { status: 400, body: { error: "Request body must be valid JSON." } };
  }
  if (!input || typeof input !== "object" || Array.isArray(input) || typeof input.url !== "string") {
    return { status: 400, body: { error: "Request body must include a URL string." } };
  }

  return { status: 200, body: analyzeUrl(input.url, input.language) };
}

export function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}