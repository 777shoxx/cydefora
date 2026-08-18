import React from "react";

export default function Stat({ icon: Icon, title, value }) {

  return (
    <div className="stat">

      <div className="toolIcon">
        <Icon size={21}/>
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

    </div>
  );
}
