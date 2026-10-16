import { handleLinkCheck, jsonResponse } from "./check-link-handler.mjs";

export default async function handler(request, response) {
	if (response) {
		const result = handleLinkCheck({
			method: request.method,
			body: typeof request.body === "string" ? request.body : JSON.stringify(request.body ?? {}),
			contentLength: request.headers?.["content-length"],
		});
		response.status(result.status).setHeader("Content-Type", "application/json; charset=utf-8");
		response.setHeader("Cache-Control", "no-store");
		return response.end(JSON.stringify(result.body));
	}

	let body;
	try {
		body = await request.text();
	} catch {
		return jsonResponse(400, { error: "Invalid request body." });
	}
	const result = handleLinkCheck({
		method: request.method,
		body,
		contentLength: request.headers.get("content-length"),
	});
	return jsonResponse(result.status, result.body);
}
