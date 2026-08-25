import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Link2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import { checkLink } from "../api/linkChecker";

const riskColors = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  unknown: "#a3a3aa",
};

export function LinkChecker({ t }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function runCheck(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      setResult(await checkLink(url.trim()));
    } catch (requestError) {
      setError(requestError.message || t.linkError);
    } finally {
      setLoading(false);
    }
  }

  const sensitiveInfo = result?.sensitiveInfo || {};
  const indicators = [
    ["credentials", t.credentials],
    ["payment", t.payment],
    ["personalInformation", t.personalInformation],
    ["cryptocurrency", t.cryptocurrency],
  ];

  return (
    <main className="page">
      <div className="pageHead">
        <span className="eyebrow">
          <Link2 size={16} />
          LINK CHECKER
        </span>
        <h1>{t.linkTitle}</h1>
        <p>{t.linkDesc}</p>
      </div>

      <div className="passwordLayout linkLayout">
        <section className="passwordBox">
          <form onSubmit={runCheck}>
            <label htmlFor="link-url">{t.linkInput}</label>
            <div className="bigInput">
              <input
                id="link-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="linkNotice error" role="alert">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button className="primary full" type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
              {loading ? t.linkLoading : t.checkLink}
            </button>
          </form>

          <small className="privacy">
            <ShieldCheck size={15} />
            {t.linkPrivacy}
          </small>
        </section>

        <aside className="tips">
          <h3>{t.linkHow}</h3>
          <p>{t.linkHowDesc}</p>
          <div className="tip">
            <CheckCircle2 />
            {t.linkTip1}
          </div>
          <div className="tip">
            <CheckCircle2 />
            {t.linkTip2}
          </div>
        </aside>
      </div>

      {result && (
        <section className="linkResult" aria-live="polite">
          <div className="linkResultHeader">
            <div>
              <span className="eyebrow">{t.linkResult}</span>
              <h2>{result.title || url}</h2>
            </div>
            <strong style={{ color: riskColors[result.risk] || riskColors.unknown }}>
              {t.risk}: {result.risk}
            </strong>
          </div>

          <div className="linkFacts">
            <div><span>{t.websiteType}</span><b>{result.websiteType || "—"}</b></div>
            <div><span>{t.purpose}</span><b>{result.purpose || "—"}</b></div>
            <div><span>{t.confidence}</span><b>{result.confidence || "unknown"}</b></div>
          </div>

          <div className="linkSummary">
            <span>{t.summary}</span>
            <p>{result.summary || "—"}</p>
          </div>

          <div className="linkIndicators">
            <span>{t.sensitiveInfo}</span>
            <div className="checksGrid">
              {indicators.map(([key, label]) => (
                <span className={sensitiveInfo[key] ? "ok" : ""} key={key}>
                  <CheckCircle2 />
                  {label}: {sensitiveInfo[key] ? t.detected : t.notDetected}
                </span>
              ))}
            </div>
          </div>

          {result.warnings?.length > 0 && (
            <div className="linkWarnings">
              <span><AlertTriangle size={16} />{t.warnings}</span>
              <ul>
                {result.warnings.map((warning, index) => <li key={`${warning}-${index}`}>{warning}</li>)}
              </ul>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
