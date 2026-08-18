import React from "react";

export default function Feature({ icon: Icon, title, desc }) {
  return (
    <article className="featureCard">

      <div className="iconCircle">
        <Icon size={21}/>
      </div>

      <h3>{title}</h3>

      <p>{desc}</p>

    </article>
  );
}
