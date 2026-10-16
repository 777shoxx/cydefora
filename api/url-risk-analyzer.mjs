import { isIP } from "node:net";

export const URL_RISK_CONFIG = Object.freeze({
  maxInputLength: 4096,
  longUrlLength: 512,
  maxSubdomainDepth: 4,
  ruleWeights: Object.freeze({
    TRANSPORT_HTTP: 8,
    URL_UNUSUALLY_LONG: 8,
    HOST_DEEP_SUBDOMAINS: 10,
    HOST_IS_IP_ADDRESS: 18,
    URL_EMBEDDED_CREDENTIALS: 30,
    TRANSPORT_UNUSUAL_PORT: 12,
    URL_EXCESSIVE_ENCODING: 12,
    HOST_PUNYCODE: 8,
    HOST_BRAND_LOOKALIKE: 18,
    HOST_KNOWN_SHORTENER: 10,
    PATH_SENSITIVE_TERMS: 3,
    PATH_SUSPICIOUS_COMBINATION: 12,
    PATH_EXECUTABLE_DOWNLOAD: 14,
  }),
  thresholds: Object.freeze({ low: 19, medium: 39, high: 59 }),
  groupCaps: Object.freeze({
    transport: 15,
    structure: 10,
    host: 20,
    authority: 30,
    obfuscation: 12,
    path: 15,
    combination: 15,
  }),
});

export const SHORTENER_HOSTS = Object.freeze([
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "is.gd",
  "cutt.ly",
  "ow.ly",
  "buff.ly",
  "shorturl.at",
  "rebrand.ly",
  "lnkd.in",
]);

const BRAND_DOMAINS = Object.freeze({
  amazon: ["amazon.com", "amazon.co.uk"],
  apple: ["apple.com"],
  facebook: ["facebook.com"],
  google: ["google.com", "google.co.uk"],
  instagram: ["instagram.com"],
  microsoft: ["microsoft.com", "live.com", "outlook.com"],
  netflix: ["netflix.com"],
  paypal: ["paypal.com"],
});
const BRAND_LABELS = Object.freeze({
  microsoft: ["microsoft", "live", "outlook"],
});

const MESSAGES = Object.freeze({
  en: {
    invalid: {
      type: "Enter a URL as text.", empty: "Enter a URL to analyze.", tooLong: "The URL is too long to analyze.",
      invalidCharacters: "The URL contains invalid characters.", malformedPercent: "The URL contains malformed percent encoding.",
      unsupportedScheme: "Only HTTP and HTTPS URLs can be analyzed.", schemeDelimiter: "The URL must include // after its HTTP or HTTPS scheme.",
      invalidHostname: "The URL has an invalid or empty hostname.", invalidUrl: "Enter a valid HTTP or HTTPS URL with a valid port.",
    },
    explanations: {
      TRANSPORT_HTTP: "The URL uses HTTP, so the connection does not provide HTTPS transport encryption. This alone does not mean the site is malicious.",
      URL_UNUSUALLY_LONG: "The URL is unusually long, which can make its destination and parameters harder to inspect.",
      HOST_DEEP_SUBDOMAINS: "The hostname has {depth} subdomain levels. Deep nesting can make the registered domain harder to recognize.",
      HOST_IS_IP_ADDRESS: "The destination is an IP address rather than a conventional hostname.",
      URL_EMBEDDED_CREDENTIALS: "The URL authority contains user information before the hostname. This can be used to disguise the actual destination.",
      TRANSPORT_UNUSUAL_PORT: "The URL specifies non-standard port {port} instead of the usual HTTP or HTTPS port.",
      URL_EXCESSIVE_ENCODING: "The URL contains repeated or layered percent-encoding that can obscure its actual path or parameters.",
      HOST_PUNYCODE: "The hostname contains an IDN Punycode label. Internationalized domains can be legitimate, but their displayed characters may be visually confusable.",
      HOST_BRAND_LOOKALIKE: "The hostname uses the {brand} name outside its configured official domain. Verify the registered domain before proceeding.",
      HOST_KNOWN_SHORTENER: "The hostname is a configured URL-shortening service, so the final destination is not visible from this URL alone.",
      PATH_SENSITIVE_TERMS: "The path or query contains sensitive-action wording ({terms}). These words are common on legitimate sites and are not proof of phishing.",
      PATH_SUSPICIOUS_COMBINATION: "Sensitive-action wording appears together with another strong URL warning, a combination that deserves extra verification.",
      PATH_EXECUTABLE_DOWNLOAD: "The path ends in {extension}, a file extension commonly used for executable or installable downloads.",
    },
    recommendations: {
      TRANSPORT_HTTP: "Do not enter sensitive information unless you have independently verified the site and its connection.",
      URL_UNUSUALLY_LONG: "Inspect the hostname carefully and avoid opening the URL if you did not expect its parameters.",
      HOST_DEEP_SUBDOMAINS: "Read the hostname from right to left and verify the registered domain, not just a familiar-looking subdomain.",
      HOST_IS_IP_ADDRESS: "Verify the IP address through a trusted source before continuing.",
      URL_EMBEDDED_CREDENTIALS: "Do not open this URL directly. Verify its intended hostname independently before proceeding.",
      TRANSPORT_UNUSUAL_PORT: "Only continue if you expected this service and can verify why it uses this port.",
      URL_EXCESSIVE_ENCODING: "Treat the destination as opaque and verify it through a trusted channel before opening it.",
      HOST_PUNYCODE: "Check the displayed internationalized hostname carefully for characters that resemble familiar letters.",
      HOST_BRAND_LOOKALIKE: "Navigate to the brand using a saved bookmark or a known official address instead of this link.",
      HOST_KNOWN_SHORTENER: "Use a trusted preview or ask the sender for the full destination before opening the shortened link.",
      PATH_SENSITIVE_TERMS: "A sensitive word in a path is not proof of danger; verify the hostname and context before entering information.",
      PATH_SUSPICIOUS_COMBINATION: "Do not enter credentials or payment details until you have verified the destination independently.",
      PATH_EXECUTABLE_DOWNLOAD: "Do not download or run the file unless you expected it and trust its source.",
    },
    noFindings: "No configured risk indicators were found. Confirm the hostname independently before sharing sensitive information.",
    disclaimer: "Heuristic scoring does not prove that a URL is malicious or safe. No page was opened or fetched during this analysis.",
    invalidDisclaimer: "Heuristic scoring does not prove that a URL is malicious or safe.",
  },
  ru: {
    invalid: {
      type: "Введите URL в виде текста.", empty: "Введите URL для анализа.", tooLong: "URL слишком длинный для анализа.",
      invalidCharacters: "URL содержит недопустимые символы.", malformedPercent: "URL содержит некорректное percent-кодирование.",
      unsupportedScheme: "Можно анализировать только URL с HTTP или HTTPS.", schemeDelimiter: "После HTTP или HTTPS в URL должны идти символы //.",
      invalidHostname: "В URL указано пустое или некорректное имя хоста.", invalidUrl: "Введите корректный URL HTTP или HTTPS с допустимым портом.",
    },
    explanations: {
      TRANSPORT_HTTP: "URL использует HTTP, поэтому соединение не защищено шифрованием HTTPS. Само по себе это не означает, что сайт вредоносный.",
      URL_UNUSUALLY_LONG: "URL необычно длинный, поэтому его адрес и параметры сложнее проверить.",
      HOST_DEEP_SUBDOMAINS: "В имени хоста {depth} уровней поддоменов. Глубокая вложенность может затруднить распознавание основного домена.",
      HOST_IS_IP_ADDRESS: "В качестве адреса назначения используется IP-адрес, а не обычное доменное имя.",
      URL_EMBEDDED_CREDENTIALS: "Перед именем хоста в адресе указаны данные пользователя. Это может скрывать фактический адрес назначения.",
      TRANSPORT_UNUSUAL_PORT: "В URL указан нестандартный порт {port} вместо обычного порта HTTP или HTTPS.",
      URL_EXCESSIVE_ENCODING: "В URL используется повторное или многоуровневое percent-кодирование, которое может скрывать путь или параметры.",
      HOST_PUNYCODE: "В имени хоста есть метка Punycode (IDN). Такие домены могут быть легитимными, но их символы могут визуально имитировать другие.",
      HOST_BRAND_LOOKALIKE: "Имя {brand} встречается в хосте вне настроенного официального домена. Перед переходом проверьте основной домен.",
      HOST_KNOWN_SHORTENER: "Это настроенный сервис сокращения ссылок, поэтому конечный адрес не виден в самой ссылке.",
      PATH_SENSITIVE_TERMS: "В пути или параметрах есть слова, связанные с конфиденциальными действиями ({terms}). Они встречаются и на обычных сайтах, поэтому не доказывают фишинг.",
      PATH_SUSPICIOUS_COMBINATION: "Слова о конфиденциальных действиях сочетаются с другим сильным признаком риска; адрес стоит проверить дополнительно.",
      PATH_EXECUTABLE_DOWNLOAD: "Путь заканчивается на {extension} — расширение, часто используемое для исполняемых файлов или установщиков.",
    },
    recommendations: {
      TRANSPORT_HTTP: "Не вводите конфиденциальные данные, пока независимо не проверите сайт и соединение.",
      URL_UNUSUALLY_LONG: "Внимательно проверьте имя хоста и не открывайте неожиданный URL с длинными параметрами.",
      HOST_DEEP_SUBDOMAINS: "Проверяйте имя хоста справа налево и убедитесь в основном домене, а не только в знакомом поддомене.",
      HOST_IS_IP_ADDRESS: "Перед продолжением проверьте IP-адрес по надежному источнику.",
      URL_EMBEDDED_CREDENTIALS: "Не открывайте ссылку напрямую. Сначала независимо проверьте предполагаемое имя хоста.",
      TRANSPORT_UNUSUAL_PORT: "Продолжайте только если ожидали этот сервис и можете проверить причину нестандартного порта.",
      URL_EXCESSIVE_ENCODING: "Считайте адрес назначения скрытым и проверьте его через надежный канал перед переходом.",
      HOST_PUNYCODE: "Внимательно проверьте отображаемое международное имя хоста на похожие символы.",
      HOST_BRAND_LOOKALIKE: "Откройте сайт бренда через закладку или известный официальный адрес, а не по этой ссылке.",
      HOST_KNOWN_SHORTENER: "Используйте надежный предварительный просмотр или запросите у отправителя полный адрес.",
      PATH_SENSITIVE_TERMS: "Слово в пути не доказывает опасность; проверьте домен и контекст перед вводом данных.",
      PATH_SUSPICIOUS_COMBINATION: "Не вводите учетные или платежные данные, пока независимо не проверите адрес назначения.",
      PATH_EXECUTABLE_DOWNLOAD: "Не скачивайте и не запускайте файл, если вы его не ожидали или не доверяете источнику.",
    },
    noFindings: "Настроенные признаки риска не обнаружены. Перед передачей данных проверьте домен самостоятельно.",
    disclaimer: "Эвристическая оценка не доказывает, что URL вредоносный или безопасный. Страница не открывалась и не загружалась.",
    invalidDisclaimer: "Эвристическая оценка не доказывает, что URL вредоносный или безопасный.",
  },
  uz: {
    invalid: {
      type: "URL matn ko‘rinishida kiritilishi kerak.", empty: "Tahlil qilish uchun URL kiriting.", tooLong: "URL tahlil qilish uchun juda uzun.",
      invalidCharacters: "URL ichida yaroqsiz belgilar bor.", malformedPercent: "URL ichida noto‘g‘ri foizli kodlash mavjud.",
      unsupportedScheme: "Faqat HTTP va HTTPS URL manzillari tahlil qilinadi.", schemeDelimiter: "HTTP yoki HTTPS dan keyin URL da // bo‘lishi kerak.",
      invalidHostname: "URL da xost nomi yo‘q yoki noto‘g‘ri.", invalidUrl: "Yaroqli port bilan to‘g‘ri HTTP yoki HTTPS URL kiriting.",
    },
    explanations: {
      TRANSPORT_HTTP: "URL HTTP dan foydalanadi, shuning uchun ulanish HTTPS shifrlashini ta’minlamaydi. Bu holatning o‘zi sayt zararli ekanini bildirmaydi.",
      URL_UNUSUALLY_LONG: "URL odatdagidan uzun, shu sababli uning manzili va parametrlarini tekshirish qiyinroq.",
      HOST_DEEP_SUBDOMAINS: "Xost nomida {depth} ta subdomen darajasi bor. Chuqur tuzilma asosiy domenni tanishni qiyinlashtirishi mumkin.",
      HOST_IS_IP_ADDRESS: "Manzil sifatida odatiy domen nomi emas, IP manzil ishlatilgan.",
      URL_EMBEDDED_CREDENTIALS: "Xost nomidan oldin URL ichida foydalanuvchi ma’lumotlari bor. Bu haqiqiy manzilni yashirish uchun ishlatilishi mumkin.",
      TRANSPORT_UNUSUAL_PORT: "URL da odatiy HTTP yoki HTTPS porti o‘rniga {port} porti ko‘rsatilgan.",
      URL_EXCESSIVE_ENCODING: "URL da yo‘l yoki parametrlarni yashirishi mumkin bo‘lgan takroriy yoki ko‘p qatlamli kodlash bor.",
      HOST_PUNYCODE: "Xost nomida Punycode (IDN) yorlig‘i bor. Bunday domenlar qonuniy bo‘lishi mumkin, ammo belgilar ko‘zga o‘xshash ko‘rinishi ehtimoli bor.",
      HOST_BRAND_LOOKALIKE: "Xost nomida {brand} nomi uning sozlangan rasmiy domenidan tashqarida uchradi. Davom etishdan oldin asosiy domenni tekshiring.",
      HOST_KNOWN_SHORTENER: "Bu sozlangan qisqa havola xizmati; yakuniy manzil havolaning o‘zida ko‘rinmaydi.",
      PATH_SENSITIVE_TERMS: "Yo‘l yoki so‘rovda maxfiy amallarga oid so‘zlar bor ({terms}). Bu so‘zlar qonuniy saytlarda ham uchraydi va fishingni isbotlamaydi.",
      PATH_SUSPICIOUS_COMBINATION: "Maxfiy amalga oid so‘zlar boshqa kuchli xavf belgisi bilan birga uchradi; manzilni qo‘shimcha tekshirish lozim.",
      PATH_EXECUTABLE_DOWNLOAD: "Yo‘l {extension} bilan tugaydi; bu keng tarqalgan bajariluvchi yoki o‘rnatish fayli kengaytmasi.",
    },
    recommendations: {
      TRANSPORT_HTTP: "Sayt va ulanishni mustaqil tekshirmaguningizcha maxfiy ma’lumotlarni kiritmang.",
      URL_UNUSUALLY_LONG: "Xost nomini diqqat bilan tekshiring va kutilmagan uzun parametrlarga ega havolani ochmang.",
      HOST_DEEP_SUBDOMAINS: "Xost nomini o‘ngdan chapga tekshiring; tanish subdomen emas, asosiy domen to‘g‘ri ekaniga ishonch hosil qiling.",
      HOST_IS_IP_ADDRESS: "Davom etishdan oldin IP manzilni ishonchli manba orqali tekshiring.",
      URL_EMBEDDED_CREDENTIALS: "Bu havolani bevosita ochmang. Avval mo‘ljallangan xost nomini mustaqil tekshiring.",
      TRANSPORT_UNUSUAL_PORT: "Faqat xizmatni kutgan bo‘lsangiz va noodatiy port sababini tekshira olsangiz davom eting.",
      URL_EXCESSIVE_ENCODING: "Manzilni yashirilgan deb hisoblang va ochishdan oldin ishonchli kanal orqali tekshiring.",
      HOST_PUNYCODE: "Ko‘rsatilgan xalqaro xost nomida o‘xshash belgilar yo‘qligini diqqat bilan tekshiring.",
      HOST_BRAND_LOOKALIKE: "Havola o‘rniga saqlangan xatcho‘p yoki ma’lum rasmiy manzil orqali brend saytiga kiring.",
      HOST_KNOWN_SHORTENER: "Ishonchli havola oldindan ko‘rish xizmatidan foydalaning yoki yuboruvchidan to‘liq manzilni so‘rang.",
      PATH_SENSITIVE_TERMS: "Yo‘ldagi bitta so‘z xavfni isbotlamaydi; ma’lumot kiritishdan oldin domen va kontekstni tekshiring.",
      PATH_SUSPICIOUS_COMBINATION: "Manzilni mustaqil tekshirmaguningizcha login yoki to‘lov ma’lumotlarini kiritmang.",
      PATH_EXECUTABLE_DOWNLOAD: "Faylni kutmagan bo‘lsangiz yoki manbasiga ishonmasangiz, uni yuklab olmang va ishga tushirmang.",
    },
    noFindings: "Sozlangan xavf belgilari topilmadi. Maxfiy ma’lumot yuborishdan oldin domenni mustaqil tekshiring.",
    disclaimer: "Evristik ball URL zararli yoki xavfsiz ekanini isbotlamaydi. Tahlil vaqtida sahifa ochilmadi yoki yuklanmadi.",
    invalidDisclaimer: "Evristik ball URL zararli yoki xavfsiz ekanini isbotlamaydi.",
  },
});

const SENSITIVE_TERMS = ["login", "verify", "account", "password", "wallet", "confirm"];
const EXECUTABLE_EXTENSIONS = new Set([".apk", ".bat", ".cmd", ".exe", ".msi", ".ps1", ".scr"]);

function normalizeBrandLabel(label) {
  return label.toLowerCase().replace(/[0135]/g, (character) => ({
    "0": "o",
    "1": "l",
    "3": "e",
    "5": "s",
  })[character]);
}

const RULES = [
  {
    id: "TRANSPORT_HTTP",
    severity: "low",
    group: "transport",
    explanationKey: "TRANSPORT_HTTP",
    test: ({ url }) => url.protocol === "http:",
  },
  {
    id: "URL_UNUSUALLY_LONG",
    severity: "low",
    group: "structure",
    explanationKey: "URL_UNUSUALLY_LONG",
    test: ({ raw }) => raw.length > URL_RISK_CONFIG.longUrlLength,
  },
  {
    id: "HOST_DEEP_SUBDOMAINS",
    severity: "medium",
    group: "host",
    explanationKey: "HOST_DEEP_SUBDOMAINS",
    test: ({ host, ipVersion }) => !ipVersion && host.split(".").length - 2 > URL_RISK_CONFIG.maxSubdomainDepth,
  },
  {
    id: "HOST_IS_IP_ADDRESS",
    severity: "medium",
    group: "host",
    explanationKey: "HOST_IS_IP_ADDRESS",
    test: ({ ipVersion }) => ipVersion > 0,
  },
  {
    id: "URL_EMBEDDED_CREDENTIALS",
    severity: "high",
    group: "authority",
    explanationKey: "URL_EMBEDDED_CREDENTIALS",
    test: ({ hasAuthorityAt }) => hasAuthorityAt,
  },
  {
    id: "TRANSPORT_UNUSUAL_PORT",
    severity: "medium",
    group: "transport",
    explanationKey: "TRANSPORT_UNUSUAL_PORT",
    test: ({ url }) => Boolean(url.port),
  },
  {
    id: "URL_EXCESSIVE_ENCODING",
    severity: "medium",
    group: "obfuscation",
    explanationKey: "URL_EXCESSIVE_ENCODING",
    test: ({ raw, percentCount }) => percentCount >= 8 || /%25(?:2f|5c|3a|40|2e)/i.test(raw),
  },
  {
    id: "HOST_PUNYCODE",
    severity: "low",
    group: "host",
    explanationKey: "HOST_PUNYCODE",
    test: ({ host }) => host.split(".").some((label) => label.startsWith("xn--")),
  },
  {
    id: "HOST_BRAND_LOOKALIKE",
    severity: "high",
    group: "host",
    explanationKey: "HOST_BRAND_LOOKALIKE",
    test: ({ host }) => {
      const labels = host.split(".").flatMap((label) =>
        label.split("-").map(normalizeBrandLabel));
      for (const [brand, officialDomains] of Object.entries(BRAND_DOMAINS)) {
        const brandLabels = BRAND_LABELS[brand] || [brand];
        if (!brandLabels.some((label) => labels.includes(normalizeBrandLabel(label)))) continue;
        if (!officialDomains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return brand;
      }
      return false;
    },
  },
  {
    id: "HOST_KNOWN_SHORTENER",
    severity: "low",
    group: "host",
    explanationKey: "HOST_KNOWN_SHORTENER",
    test: ({ host }) => SHORTENER_HOSTS.includes(host),
  },
  {
    id: "PATH_SENSITIVE_TERMS",
    severity: "low",
    group: "path",
    explanationKey: "PATH_SENSITIVE_TERMS",
    test: ({ terms }) => terms.length > 0,
  },
  {
    id: "PATH_SUSPICIOUS_COMBINATION",
    severity: "medium",
    group: "combination",
    explanationKey: "PATH_SUSPICIOUS_COMBINATION",
    test: ({ terms, findings }) => terms.length > 0 && findings.some((finding) => [
      "URL_EMBEDDED_CREDENTIALS",
      "HOST_BRAND_LOOKALIKE",
      "HOST_KNOWN_SHORTENER",
    ].includes(finding.id)),
  },
  {
    id: "PATH_EXECUTABLE_DOWNLOAD",
    severity: "medium",
    group: "path",
    explanationKey: "PATH_EXECUTABLE_DOWNLOAD",
    test: ({ pathname }) => {
      const lastSegment = pathname.split("/").at(-1).toLowerCase();
      return [...EXECUTABLE_EXTENSIONS].find((extension) => lastSegment.endsWith(extension)) || false;
    },
  },
];

function formatMessage(language, section, key, values = {}) {
  return MESSAGES[language][section][key].replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
}

function invalidResult(reason, language) {
  return {
    normalizedUrl: null,
    score: 0,
    risk: "INVALID",
    findings: [],
    scoreBreakdown: [],
    recommendations: [formatMessage(language, "invalid", reason)],
    disclaimer: MESSAGES[language].invalidDisclaimer,
  };
}

function hasLoneSurrogate(value) {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

function parseUrl(input) {
  if (typeof input !== "string") return { error: "type" };
  const raw = input.trim();
  if (!raw) return { error: "empty" };
  if (raw.length > URL_RISK_CONFIG.maxInputLength) return { error: "tooLong" };
  if (hasLoneSurrogate(raw) || /[\u0000-\u001f\u007f]/.test(raw)) return { error: "invalidCharacters" };
  if (/%(?![0-9a-f]{2})/i.test(raw)) return { error: "malformedPercent" };

  let scheme = raw.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
  const hostPort = raw.match(/^([^/?#:]+):(\d+)(?:[/?#]|$)/);
  const hostPortIsUnambiguous = hostPort && (hostPort[1].includes(".") || hostPort[1].toLowerCase() === "localhost");
  if (scheme && scheme !== "http" && scheme !== "https" && !raw.includes("://") && hostPortIsUnambiguous) {
    scheme = null;
  }
  if (scheme && scheme !== "http" && scheme !== "https") return { error: "unsupportedScheme" };
  if (scheme && !/^https?:\/\//i.test(raw)) return { error: "schemeDelimiter" };

  const candidate = scheme ? raw : `https://${raw}`;
  const authority = candidate.match(/^https?:\/\/([^/?#]*)/i)?.[1];
  if (!authority || /\s/.test(authority)) return { error: "invalidHostname" };

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { error: "invalidUrl" };
  }
  if (!/^https?:$/.test(url.protocol) || !url.hostname || /\s/.test(url.hostname)) {
    return { error: "invalidHostname" };
  }

  const host = url.hostname.toLowerCase();
  const ipVersion = isIP(host.replace(/^\[|\]$/g, ""));
  if (!ipVersion) {
    const dnsHost = host.endsWith(".") ? host.slice(0, -1) : host;
    if (dnsHost.length > 253 || !dnsHost.split(".").every((label) =>
      label.length > 0 && label.length <= 63 && /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label))) {
      return { error: "invalidHostname" };
    }
  }

  return {
    raw,
    url,
    host: host.endsWith(".") ? host.slice(0, -1) : host,
    ipVersion,
    hasAuthorityAt: authority.includes("@"),
  };
}

function getSensitiveTerms(url) {
  let visiblePathAndQuery = `${url.pathname}${url.search}`;
  try {
    visiblePathAndQuery = decodeURIComponent(visiblePathAndQuery);
  } catch {
    // The raw URL was already checked for malformed percent escapes.
  }
  const normalized = visiblePathAndQuery.toLowerCase();
  return SENSITIVE_TERMS.filter((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i").test(normalized));
}

export function classifyRiskScore(score) {
  if (score <= URL_RISK_CONFIG.thresholds.low) return "LOW";
  if (score <= URL_RISK_CONFIG.thresholds.medium) return "MEDIUM";
  if (score <= URL_RISK_CONFIG.thresholds.high) return "HIGH";
  return "CRITICAL";
}

export function analyzeUrl(input, requestedLanguage = "en") {
  const language = Object.hasOwn(MESSAGES, requestedLanguage) ? requestedLanguage : "en";
  const parsed = parseUrl(input);
  if (parsed.error) return invalidResult(parsed.error, language);

  const { raw, url, host, ipVersion, hasAuthorityAt } = parsed;
  const percentCount = (raw.match(/%[0-9a-f]{2}/gi) || []).length;
  const terms = getSensitiveTerms(url);
  const hostnameParts = host.split(".");
  const context = {
    raw,
    url,
    host,
    ipVersion,
    hasAuthorityAt,
    port: url.port,
    percentCount,
    terms,
    pathname: url.pathname,
    subdomainDepth: Math.max(0, hostnameParts.length - 2),
  };
  const findings = [];

  for (const rule of RULES) {
    const result = rule.test({ ...context, findings });
    if (!result) continue;
    const values = {
      depth: context.subdomainDepth,
      port: context.port,
      brand: typeof result === "string" ? result : "",
      terms: context.terms.join(", "),
      extension: rule.id === "PATH_EXECUTABLE_DOWNLOAD" ? result : "",
    };
    findings.push({
      id: rule.id,
      severity: rule.severity,
      weight: URL_RISK_CONFIG.ruleWeights[rule.id],
      explanation: formatMessage(language, "explanations", rule.explanationKey, values),
    });
  }

  const contributions = new Map();
  for (const finding of findings) {
    const rule = RULES.find((item) => item.id === finding.id);
    contributions.set(rule.group, Math.max(contributions.get(rule.group) || 0, finding.weight));
  }
  const scoreBreakdown = [...contributions].map(([group, weight]) => ({
    group,
    contribution: Math.min(weight, URL_RISK_CONFIG.groupCaps[group]),
    cap: URL_RISK_CONFIG.groupCaps[group],
  }));
  const score = Math.min(100, scoreBreakdown.reduce((sum, item) => sum + item.contribution, 0));
  const recommendations = findings.length
    ? [...new Set(findings.map((finding) => formatMessage(language, "recommendations", finding.id)))]
    : [MESSAGES[language].noFindings];

  return {
    normalizedUrl: url.toString(),
    score,
    risk: classifyRiskScore(score),
    findings,
    scoreBreakdown,
    recommendations,
    disclaimer: MESSAGES[language].disclaimer,
  };
}