import React from "react";
import {
  ShieldCheck, ArrowRight, Shield, CheckCircle2, Zap,
  GraduationCap, Target
} from "lucide-react";
import logoUrl from "../cydefora-logo.jpg";
import { tools } from "../data/tools";
import Feature from "../components/Feature";
import ToolCard from "../components/ToolCard";
import MiniChecker from "../components/MiniChecker";

export default function HomePage({ t, lang, onStart, onTool }) {

  return (
    <main>

      <section className="hero">

        <div className="heroCopy">

          <div className="eyebrow">
            <ShieldCheck size={16}/>
            CYBERSECURITY PLATFORM
          </div>

          <h1>
            {t.hero1}
            <br/>
            <span>{t.hero2}</span>
            <br/>
            {t.hero3}
          </h1>

          <p>
            {t.heroDesc}
          </p>

          <div className="heroButtons">

            <button
              className="primary"
              onClick={onStart}
            >
              {t.start}
              <ArrowRight size={18}/>
            </button>

            <button
              className="secondary"
              onClick={() =>
                document
                  .getElementById("why")
                  .scrollIntoView({behavior:"smooth"})
              }
            >
              {t.learn}
            </button>

          </div>

          <div className="trust">

            <span>
              <Shield size={16}/>
              {t.safeTools}
            </span>

            <span>
              <CheckCircle2 size={16}/>
              100% browser-based
            </span>

            <span>
              <Zap size={16}/>
              Free demo
            </span>

          </div>

        </div>

        <div className="heroVisual">

          <div className="orb orb1"></div>
          <div className="orb orb2"></div>

          <div className="heroLogo">
            <img src={logoUrl} alt="Cydefora" />
          </div>

          <div className="codeFloat">
            SECURE // LEARN // PROTECT
          </div>

        </div>

      </section>

      <section id="why" className="section">

        <div className="sectionTitle">
          <span>{t.why}</span>
          <b>Cydefora?</b>
        </div>

        <div className="cards">

          <Feature
            icon={ShieldCheck}
            title={t.safeTools}
            desc={t.safeDesc}
          />

          <Feature
            icon={GraduationCap}
            title={t.easy}
            desc={t.easyDesc}
          />

          <Feature
            icon={Target}
            title={t.practical}
            desc={t.practicalDesc}
          />

          <Feature
            icon={Zap}
            title={t.fast}
            desc={t.fastDesc}
          />

        </div>

      </section>

      <section className="checkerPreview">

        <div>

          <span className="badge">
            FREE TOOL
          </span>

          <h2>
            {t.checkerTitle}
          </h2>

          <p>
            {t.checkerDesc}
          </p>

          <button
            className="primary"
            onClick={onStart}
          >
            {t.checkNow}
            <ArrowRight size={18}/>
          </button>

        </div>

        <MiniChecker t={t}/>

      </section>

      <section className="section toolsSection">

        <div className="sectionTitle">
          <span>{t.tools}</span>
        </div>

        <div className="toolGrid">

          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              t={t}
              lang={lang}
              onClick={() => onTool(tool)}
            />
          ))}

        </div>

      </section>

    </main>
  );
}
