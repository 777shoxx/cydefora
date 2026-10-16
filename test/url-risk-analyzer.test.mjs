import assert from "node:assert/strict";
import test from "node:test";
import { analyzeUrl, classifyRiskScore, URL_RISK_CONFIG } from "../api/url-risk-analyzer.mjs";
import { handleLinkCheck } from "../api/check-link-handler.mjs";
import vercelHandler from "../api/check-link.mjs";
import netlifyHandler from "../netlify/functions/check-link.mjs";

const findingIds = (result) => result.findings.map((finding) => finding.id);

test("normal HTTPS URL has no warnings and normalizes hostname", () => {
  const result = analyzeUrl("HTTPS://Example.COM/path");
  assert.equal(result.normalizedUrl, "https://example.com/path");
  assert.equal(result.score, 0);
  assert.equal(result.risk, "LOW");
  assert.deepEqual(result.findings, []);
});

test("normal HTTP is noted but is not classified malicious by itself", () => {
  const result = analyzeUrl("http://example.com/");
  assert.equal(result.risk, "LOW");
  assert.ok(findingIds(result).includes("TRANSPORT_HTTP"));
});

test("detects IP, credentials, punycode, long URLs, and deep subdomains", () => {
  assert.ok(findingIds(analyzeUrl("http://192.0.2.10/" )).includes("HOST_IS_IP_ADDRESS"));
  assert.ok(findingIds(analyzeUrl("https://user:pass@example.com/" )).includes("URL_EMBEDDED_CREDENTIALS"));
  assert.ok(findingIds(analyzeUrl("https://xn--e1afmkfd.example/" )).includes("HOST_PUNYCODE"));
  assert.ok(findingIds(analyzeUrl(`https://example.com/${"a".repeat(520)}`)).includes("URL_UNUSUALLY_LONG"));
  assert.ok(findingIds(analyzeUrl("https://a.b.c.d.e.f.example.com/" )).includes("HOST_DEEP_SUBDOMAINS"));
});

test("does not treat an at sign in the query as authority credentials", () => {
  const result = analyzeUrl("https://example.com/search?q=user@example.com");
  assert.ok(!findingIds(result).includes("URL_EMBEDDED_CREDENTIALS"));
});

test("detects configured shorteners and sensitive path wording", () => {
  assert.ok(findingIds(analyzeUrl("https://bit.ly/abc123")).includes("HOST_KNOWN_SHORTENER"));
  assert.ok(findingIds(analyzeUrl("https://example.com/login?next=account")).includes("PATH_SENSITIVE_TERMS"));
});

test("does not overstate a legitimate login path", () => {
  const result = analyzeUrl("https://accounts.google.com/login");
  assert.equal(result.risk, "LOW");
  assert.ok(!findingIds(result).includes("HOST_BRAND_LOOKALIKE"));
  assert.ok(!findingIds(result).includes("PATH_SUSPICIOUS_COMBINATION"));
});

test("detects brand lookalikes and executable download paths", () => {
  assert.ok(findingIds(analyzeUrl("https://paypal.com.attacker.example/login")).includes("HOST_BRAND_LOOKALIKE"));
  assert.ok(findingIds(analyzeUrl("https://g00gle.example/login")).includes("HOST_BRAND_LOOKALIKE"));
  assert.ok(findingIds(analyzeUrl("https://example.com/download/setup.exe")).includes("PATH_EXECUTABLE_DOWNLOAD"));
  assert.ok(!findingIds(analyzeUrl("https://pineapple.example/login")).includes("HOST_BRAND_LOOKALIKE"));
});

test("validates schemes, hostnames, ports, length, and percent escapes", () => {
  for (const input of ["", "javascript:alert(1)", "javascript:123", "ftp:21", "https://bad host.example/", "https://example.com:99999/", "https://example.com/%ZZ", "https://example.com/\uD800", `https://example.com/${"a".repeat(5000)}`]) {
    assert.equal(analyzeUrl(input).risk, "INVALID", input);
  }
  assert.equal(analyzeUrl("https://example.com").risk, "LOW");
  assert.equal(analyzeUrl("example.com").normalizedUrl, "https://example.com/");
  assert.equal(analyzeUrl("example.com:8443/path").normalizedUrl, "https://example.com:8443/path");
  assert.equal(analyzeUrl("localhost:8787").normalizedUrl, "https://localhost:8787/");
  assert.ok(findingIds(analyzeUrl("https://example.com:8443/path")).includes("TRANSPORT_UNUSUAL_PORT"));
  assert.ok(findingIds(analyzeUrl("https://example.com/%252Faccount")).includes("URL_EXCESSIVE_ENCODING"));
});

test("supports IPv4 and IPv6 addresses", () => {
  assert.ok(findingIds(analyzeUrl("https://203.0.113.8/path")).includes("HOST_IS_IP_ADDRESS"));
  assert.ok(findingIds(analyzeUrl("https://[2001:db8::1]/path")).includes("HOST_IS_IP_ADDRESS"));
});

test("misleading hostname text is evaluated as hostname labels", () => {
  const result = analyzeUrl("https://trusted.example.attacker.com/path");
  assert.ok(!findingIds(result).includes("HOST_BRAND_LOOKALIKE"));
  assert.ok(result.normalizedUrl.includes("trusted.example.attacker.com"));
});

test("deduplicates findings and keeps scores inside configured bounds", () => {
  const result = analyzeUrl("http://user:pass@paypal.com.attacker.example:8080/login?next=verify");
  assert.equal(new Set(findingIds(result)).size, result.findings.length);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.equal(result.score, Math.min(100, result.scoreBreakdown.reduce((sum, group) => sum + group.contribution, 0)));
  assert.equal(result.risk, "CRITICAL");
  assert.equal(analyzeUrl("https://example.com").score, 0);
  assert.deepEqual(URL_RISK_CONFIG.thresholds, { low: 19, medium: 39, high: 59 });
});

test("classifies every configured score boundary", () => {
  assert.deepEqual(
    [0, 19, 20, 39, 40, 59, 60, 100].map(classifyRiskScore),
    ["LOW", "LOW", "MEDIUM", "MEDIUM", "HIGH", "HIGH", "CRITICAL", "CRITICAL"],
  );
});

test("API handler validates request shape and returns INVALID separately from HTTP errors", () => {
  assert.equal(handleLinkCheck({ method: "GET", body: "" }).status, 405);
  assert.equal(handleLinkCheck({ method: "POST", body: "{" }).status, 400);
  assert.equal(handleLinkCheck({ method: "POST", body: "{}" }).status, 400);
  assert.equal(handleLinkCheck({ method: "POST", body: "{}", contentLength: 9000 }).status, 413);

  const result = handleLinkCheck({
    method: "POST",
    body: JSON.stringify({ url: "javascript:alert(1)" }),
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.risk, "INVALID");
  assert.equal(typeof result.body.disclaimer, "string");
});

test("Netlify and Vercel adapters return the shared analyzer response", async () => {
  const requestBody = JSON.stringify({ url: "https://example.com/" });
  const netlifyResponse = await netlifyHandler(new Request("https://local.test/check-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  }));
  assert.equal(netlifyResponse.status, 200);
  assert.equal((await netlifyResponse.json()).risk, "LOW");

  const vercelResponse = {
    statusCode: 0,
    headers: {},
    body: "",
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; },
  };
  await vercelHandler({
    method: "POST",
    headers: { "content-length": String(requestBody.length) },
    body: { url: "https://example.com/" },
  }, vercelResponse);
  assert.equal(vercelResponse.statusCode, 200);
  assert.equal(JSON.parse(vercelResponse.body).risk, "LOW");
});

test("analysis results are deterministic", () => {
  const input = "https://bit.ly/login?next=%252Faccount";
  assert.deepEqual(analyzeUrl(input), analyzeUrl(input));
});

test("findings, recommendations, invalid reasons, and disclaimers follow the selected language", () => {
  const uz = analyzeUrl("https://bit.ly/login", "uz");
  assert.match(uz.findings[0].explanation, /Bu sozlangan/);
  assert.match(uz.recommendations[0], /Ishonchli/);
  assert.match(uz.disclaimer, /Evristik/);

  const ru = analyzeUrl("https://bit.ly/login", "ru");
  assert.match(ru.findings[0].explanation, /настроенный сервис/);
  assert.match(ru.recommendations[0], /надежный предварительный просмотр/);
  assert.match(ru.disclaimer, /Эвристическая оценка/);
  assert.equal(analyzeUrl("", "ru").recommendations[0], "Введите URL для анализа.");

  const apiResult = handleLinkCheck({
    method: "POST",
    body: JSON.stringify({ url: "https://bit.ly/login", language: "uz" }),
  });
  assert.match(apiResult.body.findings[0].explanation, /Bu sozlangan/);
});

test("every implemented rule has localized explanation and recommendation text", () => {
  const fixtures = [
    `http://user:pass@g00gle.a.b.c.d.e.example:8080/a/%252F/login/setup.exe?x=${"a".repeat(520)}`,
    "https://xn--e1afmkfd.example/",
    "https://192.0.2.1/",
    "https://bit.ly/",
  ];
  for (const language of ["uz", "ru", "en"]) {
    for (const fixture of fixtures) {
      const result = analyzeUrl(fixture, language);
      for (const finding of result.findings) {
        assert.ok(finding.explanation.length > 0, `${language}: ${finding.id} explanation`);
      }
      assert.ok(result.recommendations.every((recommendation) => recommendation.length > 0));
    }
  }
});