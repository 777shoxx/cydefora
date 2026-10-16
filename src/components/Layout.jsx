import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sun, Moon, ChevronDown, Menu, X,
  Send, Instagram, ExternalLink
} from "lucide-react";
import logoUrl from "../cydefora-logo.jpg";

export function Layout({ children, t, lang, setLang, dark, setDark }) {
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setMenu(false);
    setLangOpen(false);
  };

  return (
    <div className={dark ? "app dark" : "app light"}>
      <header className="navbar">
        <button
          className="brand"
          onClick={() => handleNavigate("/")}
          aria-label="Cydefora home"
        >
          <span className="logoFrame">
            <img src={logoUrl} alt="Cydefora logo" />
          </span>
          <span>CYDEFORA</span>
        </button>

        <nav className="desktopNav">
          <button
            className={isActive("/") ? "active" : ""}
            onClick={() => handleNavigate("/")}
          >
            {t.home}
          </button>

          <button
            className={isActive("/password-checker") ? "active" : ""}
            onClick={() => handleNavigate("/password-checker")}
          >
            {t.password}
          </button>

          <button
            className={isActive("/tools") ? "active" : ""}
            onClick={() => handleNavigate("/tools")}
          >
            {t.tools}
          </button>

          <button
            className={isActive("/dashboard") ? "active" : ""}
            onClick={() => handleNavigate("/dashboard")}
          >
            {t.dashboard}
          </button>

          <button
            className={isActive("/about") ? "active" : ""}
            onClick={() => handleNavigate("/about")}
          >
            {t.about}
          </button>
        </nav>

        <div className="navActions">
          <div className="langWrap">
            <button
              className="langBtn"
              onClick={() => setLangOpen(!langOpen)}
            >
              {lang.toUpperCase()}
              <ChevronDown size={15}/>
            </button>

            {langOpen && (
              <div className="langMenu">
                {["uz", "ru", "en"].map(x => (
                  <button
                    key={x}
                    className={lang === x ? "selected" : ""}
                    onClick={() => {
                      setLang(x);
                      setLangOpen(false);
                      localStorage.setItem("cydefora-language", x);
                    }}
                  >
                    {x.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="themeBtn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={19}/> : <Moon size={19}/>}
          </button>

          <button
            className="mobileMenu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X/> : <Menu/>}
          </button>
        </div>
      </header>

      {menu && (
        <div className="mobileNav">
          <button onClick={() => handleNavigate("/")}>
            {t.home}
          </button>

          <button onClick={() => handleNavigate("/password-checker")}>
            {t.password}
          </button>

          <button onClick={() => handleNavigate("/tools")}>
            {t.tools}
          </button>

          <button onClick={() => handleNavigate("/dashboard")}>
            {t.dashboard}
          </button>

          <button onClick={() => handleNavigate("/about")}>
            {t.about}
          </button>
        </div>
      )}

      {children}

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
    </div>
  );
}
