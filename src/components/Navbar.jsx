import React from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, Sun, Moon, Menu, X } from "lucide-react";
import logoUrl from "../cydefora-logo.jpg";
import AuthButton from "../auth/AuthButton";

export default function Navbar({
  t,
  lang,
  setLang,
  dark,
  setDark,
  menu,
  setMenu,
  langOpen,
  setLangOpen,
  navigate
}) {

  const { pathname } = useLocation();

  return (
    <>
      <header className="navbar">

        <button
          className="brand"
          onClick={() => navigate("/")}
          aria-label="Cydefora home"
        >
          <span className="logoFrame">
            <img src={logoUrl} alt="Cydefora logo" />
          </span>

          <span>CYDEFORA</span>
        </button>

        <nav className="desktopNav">

          <button
            className={pathname === "/" ? "active" : ""}
            onClick={() => navigate("/")}
          >
            {t.home}
          </button>

          <button
            className={pathname === "/password" ? "active" : ""}
            onClick={() => navigate("/password")}
          >
            {t.password}
          </button>

          <button
            className={pathname === "/tools" ? "active" : ""}
            onClick={() => navigate("/tools")}
          >
            {t.tools}
          </button>

          <button
            className={pathname === "/dashboard" ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            {t.dashboard}
          </button>

          <button
            className={pathname === "/about" ? "active" : ""}
            onClick={() => navigate("/about")}
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
                    }}
                  >
                    {x.toUpperCase()}
                  </button>

                ))}

              </div>
            )}

          </div>

          <AuthButton />

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

          <button onClick={() => navigate("/")}>
            {t.home}
          </button>

          <button onClick={() => navigate("/password")}>
            {t.password}
          </button>

          <button onClick={() => navigate("/tools")}>
            {t.tools}
          </button>

          <button onClick={() => navigate("/dashboard")}>
            {t.dashboard}
          </button>

          <button onClick={() => navigate("/about")}>
            {t.about}
          </button>

        </div>
      )}
    </>
  );
}
