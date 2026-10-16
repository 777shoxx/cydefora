import React, { useEffect, useRef, useState } from "react";
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
  LOW: "#22c55e",
  MEDIUM: "#f59e0b",
  HIGH: "#ef4444",
  CRITICAL: "#ef4444",
  INVALID: "#a3a3aa",
};

export function LinkChecker({ t, lang }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const activeCheck = useRef(0);
  const lastCheckedUrl = useRef(null);

  function getRequestErrorMessage(requestError) {
    const code = requestError.code;
    return t.linkRequestErrors?.[code] ||
      (code?.startsWith("HTTP_") ? t.linkError : requestError.message || t.linkError);
  }

  useEffect(() => () => { activeCheck.current += 1; }, []);

  useEffect(() => {
    if (lastCheckedUrl.current === null) return undefined;
    const checkId = ++activeCheck.current;
    setLoading(true);
    setError("");
    setResult(null);

    checkLink(lastCheckedUrl.current, { language: lang })
      .then((nextResult) => {
        if (activeCheck.current === checkId) setResult(nextResult);
      })
      .catch((requestError) => {
        if (activeCheck.current === checkId) {
          setError(getRequestErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (activeCheck.current === checkId) setLoading(false);
      });

    return () => {
      if (activeCheck.current === checkId) activeCheck.current += 1;
    };
  }, [lang]);

  async function runCheck(event) {
    event.preventDefault();
    const checkId = ++activeCheck.current;
    setError("");
    setResult(null);
    setLoading(true);
    lastCheckedUrl.current = url;

    try {
      const nextResult = await checkLink(url, { language: lang });
      if (activeCheck.current === checkId) setResult(nextResult);
    } catch (requestError) {
      if (activeCheck.current === checkId) {
        setError(getRequestErrorMessage(requestError));
      }
    } finally {
      if (activeCheck.current === checkId) setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="pageHead">
        <span className="eyebrow">
          <Link2 size={16} />
          {t.linkEyebrow}
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
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                autoComplete="url"
                aria-describedby="link-privacy"
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

          <small className="privacy" id="link-privacy">
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
        <section className={`linkResult risk-${result.risk.toLowerCase()}`} aria-live="polite">
          <div className="linkResultHeader">
            <div>
              <span className="eyebrow">{t.linkResult}</span>
              <h2>{result.normalizedUrl || url.trim() || t.invalidInput}</h2>
            </div>
            <strong style={{ color: riskColors[result.risk] || riskColors.INVALID }}>
              {result.risk === "INVALID"
                ? t.invalidRisk
                : `${t.risk}: ${t.riskValues?.[result.risk] || result.risk}`}
            </strong>
          </div>

          <div className="linkScore">
            <div className="linkScoreHeading">
              <span>{t.linkScore}</span>
              <strong>{result.risk === "INVALID" ? "—" : `${result.score} / 100`}</strong>
            </div>
            <div
              className="linkScoreTrack"
              role="progressbar"
              aria-label={t.linkScore}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={result.score}
            >
              <span style={{ width: `${result.score}%` }} />
            </div>
            <small>{t.linkThresholds}</small>
            <small>
              {t.linkScoreFormula} {result.scoreBreakdown.map(({ group, contribution, cap }) =>
                `${t.linkScoreGroups?.[group] || group} +${contribution}/${cap}`).join(" · ")}
            </small>
          </div>

          <div className="linkIndicators">
            <span>{t.linkFindings}</span>
            {result.findings.length ? (
              <ul className="linkFindingList">
                {result.findings.map((finding) => (
                  <li key={finding.id}>
                    <div className="linkFindingHeading">
                      <b>{t.ruleNames?.[finding.id] || finding.id.replaceAll("_", " ")}</b>
                      <span className={`severity severity-${finding.severity}`}>
                        {t.severityValues?.[finding.severity] || finding.severity} · +{finding.weight}
                      </span>
                    </div>
                    <p>{finding.explanation}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="linkEmptyFindings">
                {result.risk === "INVALID" ? t.invalidExplanation : t.noFindings}
              </p>
            )}
          </div>

          <div className="linkRecommendations">
            <span><AlertTriangle size={16} />{t.linkRecommendations}</span>
            <ul>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <p className="linkDisclaimer">{result.disclaimer}</p>
        </section>
      )}
    </main>
  );
}