import React from "react";
import {
  Info, Target, ShieldCheck, Users, Send, Instagram, ExternalLink
} from "lucide-react";

export default function AboutPage({ t }) {

  return (
    <main className="page aboutPage">

      <div className="pageHead">

        <span className="eyebrow">
          <Info size={16}/>
          CYDEFORA
        </span>

        <h1>
          {t.aboutTitle}
        </h1>

        <p>
          {t.aboutText}
        </p>

      </div>

      <div className="aboutGrid">

        <section className="aboutCard">

          <div className="iconCircle">
            <Target size={22}/>
          </div>

          <h2>
            {t.aboutMission}
          </h2>

          <p>
            {t.aboutMissionText}
          </p>

        </section>

        <section className="aboutCard">

          <div className="iconCircle">
            <ShieldCheck size={22}/>
          </div>

          <h2>
            {t.safeTools}
          </h2>

          <p>
            {t.safeDesc}
          </p>

        </section>

        <section className="aboutCard">

          <div className="iconCircle">
            <Users size={22}/>
          </div>

          <h2>
            {t.contact}
          </h2>

          <p>
            {t.contactText}
          </p>

          <div className="aboutSocials">

            <a
              href="https://t.me/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Send size={18}/>
              Telegram — @cydefora
              <ExternalLink size={14}/>
            </a>

            <a
              href="https://instagram.com/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18}/>
              Instagram — @cydefora
              <ExternalLink size={14}/>
            </a>

          </div>

        </section>

      </div>

    </main>
  );
}
