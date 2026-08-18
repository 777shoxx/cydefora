import React from "react";
import { Send, Instagram } from "lucide-react";
import logoUrl from "../cydefora-logo.jpg";

export default function Footer({ t }) {

  return (
    <footer>

      <div className="footerTop">

        <div>

          <div className="footerBrand">
            <span className="logoFrame small">
              <img src={logoUrl} alt="" />
            </span>

            CYDEFORA
          </div>

          <p className="footerDemo">
            {t.demo}
          </p>

        </div>

        <div className="contactBox">

          <strong>{t.contact}</strong>

          <span>{t.contactText}</span>

          <div className="socials">

            <a
              href="https://t.me/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Send size={16}/>
              @cydefora
            </a>

            <a
              href="https://instagram.com/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16}/>
              @cydefora
            </a>

          </div>

        </div>

      </div>

      <div className="demoBar">
        {t.demo}
      </div>

    </footer>
  );
}
