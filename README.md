# Cydefora

Cydefora is a Vite and React cybersecurity learning application with a small Node API. The Link Checker uses a deterministic, offline URL heuristic analyzer. It parses the submitted text and does not open, fetch, resolve, or follow the URL.

## Run And Test

Install dependencies with `npm install`. In separate terminals, run `npm run api` and `npm run dev`; the Vite development server proxies `/check-link` to the local API on port 8787. Run the analyzer and API handler tests with `npm test`, and create a production frontend build with `npm run build`.

The same `/check-link` contract is used by the local Node server, Netlify function, and Vercel API route. A POST body must be JSON with a string `url` property. Invalid URL text returns an `INVALID` analysis result; malformed request JSON or a missing URL field returns HTTP 400, unsupported methods return 405, and oversized request bodies return 413.

The current interface language (`uz`, `ru`, or `en`) is included in the request. Validation messages, rule explanations, recommendations, disclaimers, and checker labels are returned or displayed in that language; unknown locales fall back to English.

## Rules And Weights

Weights are adjustable in `api/url-risk-analyzer.mjs`. Findings include a stable identifier, severity, configured weight, and explanation.

| Rule | Weight | Trigger |
| --- | ---: | --- |
| `TRANSPORT_HTTP` | 8 | URL uses HTTP rather than HTTPS; this alone is not proof of maliciousness. |
| `URL_UNUSUALLY_LONG` | 8 | Input exceeds 512 characters. |
| `HOST_DEEP_SUBDOMAINS` | 10 | More than four subdomain levels. |
| `HOST_IS_IP_ADDRESS` | 18 | IPv4 or IPv6 destination instead of a hostname. |
| `URL_EMBEDDED_CREDENTIALS` | 30 | The authority contains user information before the host. |
| `TRANSPORT_UNUSUAL_PORT` | 12 | A non-default HTTP or HTTPS port is present. |
| `URL_EXCESSIVE_ENCODING` | 12 | At least eight encoded bytes or a configured layered-encoding pattern. |
| `HOST_PUNYCODE` | 8 | A hostname label uses the `xn--` IDN form. |
| `HOST_BRAND_LOOKALIKE` | 18 | A configured brand label appears outside its configured official domains. |
| `HOST_KNOWN_SHORTENER` | 10 | Host matches the configured shortener list. |
| `PATH_SENSITIVE_TERMS` | 3 | Path or query contains a standalone `login`, `verify`, `account`, `password`, `wallet`, or `confirm` term. |
| `PATH_SUSPICIOUS_COMBINATION` | 12 | A sensitive-action term appears with embedded credentials, a brand lookalike, or a shortener. |
| `PATH_EXECUTABLE_DOWNLOAD` | 14 | Final path segment ends in a configured executable or installer extension. |

The shortener list currently covers `bit.ly`, `t.co`, `tinyurl.com`, `is.gd`, `cutt.ly`, `ow.ly`, `buff.ly`, `shorturl.at`, `rebrand.ly`, and `lnkd.in`. The configured brand comparisons cover Amazon, Apple, Facebook, Google, Instagram, Microsoft, Netflix, and PayPal domains. They compare hostname labels with explicit brand labels, normalizing only `0` to `o`, `1` to `l`, `3` to `e`, and `5` to `s`, including hyphen-separated labels. They do not use general edit-distance matching. These lists are explicit and should be reviewed as they are maintained.

To reduce correlated double-counting, only the strongest finding in each scoring group contributes to the score. Group caps are transport 15, structure 10, host 20, authority 30, obfuscation 12, path 15, and combinations 15. The final score is clamped to 0-100.

| Classification | Score |
| --- | ---: |
| LOW | 0-19 |
| MEDIUM | 20-39 |
| HIGH | 40-59 |
| CRITICAL | 60-100 |
| INVALID | URL validation failed; no risk score is assigned. |

These thresholds are heuristic bands, not calibrated probabilities. A LOW score does not certify safety, and a high score is not proof of malicious intent. URL shortener and brand lists can become stale. The analyzer does not use registration-age data, general-purpose homograph detection, DNS, reputation services, or page content. It never sends analyzed URLs to third parties. Jena and Gemini are not required by or connected to the Link Checker.
