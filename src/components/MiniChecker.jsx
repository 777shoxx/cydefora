import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { scorePassword } from "../utils/passwordStrength";

export default function MiniChecker({ t }) {

  const [p, setP] = useState("Cydefora2026!");
  const [show, setShow] = useState(false);

  const r = scorePassword(p);

  return (
    <div className="miniChecker">

      <label>
        {t.enterPassword}
      </label>

      <div className="inputWrap">

        <input
          type={show ? "text" : "password"}
          value={p}
          onChange={e => setP(e.target.value)}
        />

        <button
          onClick={() => setShow(!show)}
          aria-label={show ? t.hide : t.show}
        >
          {show
            ? <EyeOff size={18}/>
            : <Eye size={18}/>}
        </button>

      </div>

      <div className="strengthLabel">

        <span>{t.strength}</span>

        <b className={"s" + r.score}>
          {r.score
            ? t[
                ["", "weak", "medium", "strong", "veryStrong"]
                [r.score]
              ]
            : "—"}
        </b>

      </div>

      <div className="strengthBar">
        <i
          style={{
            width: `${r.score * 25}%`
          }}
        ></i>
      </div>

      <div className="checksGrid">

        <span className={r.length ? "ok" : ""}>
          <CheckCircle2/>
          {t.chars}
        </span>

        <span className={r.number ? "ok" : ""}>
          <CheckCircle2/>
          {t.number}
        </span>

        <span className={r.upper ? "ok" : ""}>
          <CheckCircle2/>
          {t.upper}
        </span>

        <span className={r.special ? "ok" : ""}>
          <CheckCircle2/>
          {t.special}
        </span>

      </div>

    </div>
  );
}
