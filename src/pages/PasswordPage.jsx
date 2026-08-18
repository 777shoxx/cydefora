import React from "react";
import {
  LockKeyhole, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck
} from "lucide-react";

export default function PasswordPage({
  t,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  liveResult,
  checkedResult,
  runCheck
}) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <LockKeyhole size={16}/>
          PASSWORD CHECKER
        </span>

        <h1>
          {t.checkerTitle}
        </h1>

        <p>
          {t.checkerDesc}
        </p>

      </div>

      <div className="passwordLayout">

        <section className="passwordBox">

          <label>
            {t.enterPassword}
          </label>

          <div className="bigInput">

            <input
              autoFocus
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <button
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword ? t.hide : t.show
              }
            >
              {showPassword
                ? <EyeOff/>
                : <Eye/>}
            </button>

          </div>

          {password && (

            <div className="resultBox">

              <div className="strengthLabel">

                <span>{t.strength}</span>

                <b
                  className={
                    "s" + liveResult.score
                  }
                >
                  {liveResult.score
                    ? t[
                        [
                          "",
                          "weak",
                          "medium",
                          "strong",
                          "veryStrong"
                        ][liveResult.score]
                      ]
                    : "—"}
                </b>

              </div>

              <div className="strengthBar">
                <i
                  style={{
                    width:
                      `${liveResult.score * 25}%`
                  }}
                ></i>
              </div>

              <div className="checksGrid">

                <span
                  className={
                    liveResult.length ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.chars}
                </span>

                <span
                  className={
                    liveResult.number ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.number}
                </span>

                <span
                  className={
                    liveResult.upper ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.upper}
                </span>

                <span
                  className={
                    liveResult.special ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.special}
                </span>

              </div>

            </div>

          )}

          {checkedResult?.message && (

            <div
              className={
                `cyberMessage ${checkedResult.level}`
              }
            >

              <div className="messageMark">
                CY
              </div>

              <p>
                {checkedResult.message}
              </p>

            </div>

          )}

          <button
            className="primary full"
            onClick={runCheck}
          >
            {t.checkNow}
            <ArrowRight size={18}/>
          </button>

          <small className="privacy">
            <ShieldCheck size={15}/>
            {t.privacy}
          </small>

        </section>

        <aside className="tips">

          <h3>
            {t.securityTips}
          </h3>

          <p>
            {t.tip1}
          </p>

          <div className="tip">
            <CheckCircle2/>
            {t.tip2}
          </div>

          <div className="tip">
            <CheckCircle2/>
            {t.tip3}
          </div>

        </aside>

      </div>

    </main>
  );
}
