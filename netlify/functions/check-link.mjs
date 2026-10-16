import { handleLinkCheck, jsonResponse } from "../../api/check-link-handler.mjs";

function getHeader(headers, name) {
  if (typeof headers?.get === "function") return headers.get(name);
  const entry = Object.entries(headers || {}).find(([key]) => key.toLowerCase() === name);
  return entry?.[1];
}

export async function handler(event = {}) {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body ?? "";
  const result = handleLinkCheck({
    method: event.httpMethod || event.method,
    body,
    contentLength: getHeader(event.headers, "content-length"),
  });

  return {
    statusCode: result.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(result.body),
  };
}

export default async function netlifyFunction(request) {
  if (typeof request?.text !== "function") return handler(request);

  let body;
  try {
    body = await request.text();
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }
  const result = handleLinkCheck({
    method: request.method,
    body,
    contentLength: getHeader(request.headers, "content-length"),
  });
  return jsonResponse(result.status, result.body);
}
