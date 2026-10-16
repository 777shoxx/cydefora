function requestError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function checkLink(url, { language = "en", signal } = {}) {
  let response;
  try {
    response = await fetch("/check-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, language }),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw requestError("LINK_NETWORK_ERROR", "The analysis service could not be reached. Please try again.");
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) throw requestError(`HTTP_${response.status}`, result?.error || "The link could not be analyzed.");
  if (
    !result ||
    !["LOW", "MEDIUM", "HIGH", "CRITICAL", "INVALID"].includes(result.risk) ||
    !Number.isInteger(result.score) ||
    !Array.isArray(result.findings) ||
    !Array.isArray(result.scoreBreakdown) ||
    !Array.isArray(result.recommendations) ||
    typeof result.disclaimer !== "string"
  ) {
    throw requestError("LINK_UNEXPECTED_RESPONSE", "The analysis service returned an unexpected response.");
  }
  return result;
}