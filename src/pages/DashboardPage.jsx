import React from "react";
import {
  LayoutDashboard, LockKeyhole, ShieldCheck, Zap, Bot, AlertTriangle
} from "lucide-react";
import Stat from "../components/Stat";

export default function DashboardPage({ t, checks, strongChecks }) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <LayoutDashboard size={16}/>
          DASHBOARD
        </span>

        <h1>
          {t.dashboardTitle}
        </h1>

        <p>
          {t.demoStats}
        </p>

      </div>

      <div className="stats">

        <Stat
          icon={LockKeyhole}
          title={t.checks}
          value={checks}
        />

        <Stat
          icon={ShieldCheck}
          title={t.strongPasswords}
          value={strongChecks}
        />

        <Stat
          icon={Zap}
          title={t.available}
          value="1 / 5"
        />

        <Stat
          icon={Bot}
          title="Coming Soon"
          value="4"
        />

      </div>

      <div className="dashboardPanel">

        <h2>{t.recent}</h2>

        <div className="empty">

          <AlertTriangle size={28}/>

          <p>
            {t.noBackend}
          </p>

        </div>

      </div>

    </main>
  );
}
