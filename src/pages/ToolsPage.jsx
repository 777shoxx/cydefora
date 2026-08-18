import React from "react";
import { Zap } from "lucide-react";
import { tools } from "../data/tools";
import ToolCard from "../components/ToolCard";

export default function ToolsPage({ t, onTool, lang }) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <Zap size={16}/>
          CYDEFORA TOOLS
        </span>

        <h1>{t.tools}</h1>

        <p>
          Cybersecurity utilities in one place.
        </p>

      </div>

      <div className="toolGrid big">

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

    </main>
  );
}
