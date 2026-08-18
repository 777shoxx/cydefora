import React from "react";
import { Bot } from "lucide-react";

export default function ComingModal({ t, tool, close }) {

  const title =
    tool.label
      ? tool.label.uz
      : "About Cydefora";

  return (
    <div
      className="modalBackdrop"
      onClick={close}
    >

      <div
        className="modal"
        onClick={e => e.stopPropagation()}
      >

        <div className="modalIcon">
          <Bot size={30}/>
        </div>

        <h2>
          {t.comingTitle}
        </h2>

        <h3>
          {title}
        </h3>

        <p>
          {t.comingDesc}
        </p>

        <button
          className="primary full"
          onClick={close}
        >
          OK
        </button>

      </div>

    </div>
  );
}
