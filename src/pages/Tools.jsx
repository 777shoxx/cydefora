import React from "react";
import { Zap, ArrowRight } from "lucide-react";
import { ToolCard } from "../components/ToolCard";
import { tools } from "../utils/constants";
import { useNavigate } from "react-router-dom";

export function Tools({ t, lang, onOpenTool }) {
  const navigate = useNavigate();

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
            onClick={() => {
              if (tool.id === "password") {
                navigate("/password-checker");
              } else if (tool.id === "link") {
                navigate("/link-checker");
              } else {
                onOpenTool(tool);
              }
            }}
          />
        ))}
      </div>
    </main>
  );
}
