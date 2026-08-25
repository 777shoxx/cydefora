export async function checkLink(url) {
  const response = await fetch("/check-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || "The link could not be analyzed.");
  }

  return result;
}