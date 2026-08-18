import React from "react";
import { ArrowRight } from "lucide-react";

export default function ToolCard({ tool, t, onClick, lang }) {

  const Icon = tool.icon;

  const currentLang = lang || "uz";

  const title =
    tool.id === "password"
      ? t.password
      : tool.label[currentLang];

  return (
    <button
      className={
        "toolCard " +
        (tool.active ? "activeTool" : "")
      }
      onClick={onClick}
    >

      <div className="toolIcon">
        <Icon size={23}/>
      </div>

      <div>

        <h3>{title}</h3>

        <p>
          {tool.active
            ? t.availableLabel
            : t.coming}
        </p>

      </div>

      <ArrowRight
        size={18}
        className="toolArrow"
      />

    </button>
  );
}
