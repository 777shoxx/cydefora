import { handleLinkCheck, jsonResponse } from "../../api/check-link-handler.mjs";

export default async function handler(request) {
  let body;
  try { body = await request.text(); } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }
  const result = handleLinkCheck({ method: request.method, body, contentLength: request.headers.get("content-length") });
  return jsonResponse(result.status, result.body);
}
