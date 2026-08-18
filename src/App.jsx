import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { translations } from "./i18n/translations";
import { scorePassword, getRandomMessage } from "./utils/passwordStrength";
import { useAuth } from "./auth/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ComingModal from "./components/ComingModal";
import HomePage from "./pages/HomePage";
import PasswordPage from "./pages/PasswordPage";
import ToolsPage from "./pages/ToolsPage";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";

const AUTH_PATHS = ["/login", "/register", "/complete-profile"];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, loading: authLoading, profileLoading } = useAuth();

  const [lang, setLang] = useState("uz");
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [coming, setComing] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkedResult, setCheckedResult] = useState(null);
  const [checks, setChecks] = useState(0);
  const [strongChecks, setStrongChecks] = useState(0);
  const [lastMessage, setLastMessage] = useState("");

  const t = translations[lang];

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("cydefora-stats") || "{}"
      );

      setChecks(saved.checks || 0);
      setStrongChecks(saved.strongChecks || 0);
    } catch {}
  }, []);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (user && !profile?.username && location.pathname !== "/complete-profile") {
      navigate("/complete-profile", { replace: true });
    }
  }, [authLoading, profileLoading, user, profile, location.pathname, navigate]);

  const liveResult = useMemo(
    () => scorePassword(password),
    [password]
  );

  function runCheck() {
    if (!password) return;

    const result = scorePassword(password);
    const message = getRandomMessage(result.level, lastMessage);

    setCheckedResult({
      ...result,
      message
    });

    setLastMessage(message);

    const next = {
      checks: checks + 1,
      strongChecks:
        strongChecks + (result.score >= 3 ? 1 : 0)
    };

    setChecks(next.checks);
    setStrongChecks(next.strongChecks);

    localStorage.setItem(
      "cydefora-stats",
      JSON.stringify(next)
    );
  }

  function goTo(path) {
    navigate(path);
    setMenu(false);
    setLangOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function openTool(tool) {
    if (tool.id === "password") {
      goTo("/password");
    } else {
      setComing(tool);
    }
  }

  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <div className={dark ? "app dark" : "app light"}>

      {!isAuthPage && (
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
          dark={dark}
          setDark={setDark}
          menu={menu}
          setMenu={setMenu}
          langOpen={langOpen}
          setLangOpen={setLangOpen}
          navigate={goTo}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              t={t}
              lang={lang}
              onStart={() => goTo("/password")}
              onTool={openTool}
            />
          }
        />

        <Route
          path="/password"
          element={
            <PasswordPage
              t={t}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              liveResult={liveResult}
              checkedResult={checkedResult}
              runCheck={runCheck}
            />
          }
        />

        <Route
          path="/tools"
          element={
            <ToolsPage
              t={t}
              lang={lang}
              onTool={openTool}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <DashboardPage
              t={t}
              checks={checks}
              strongChecks={strongChecks}
            />
          }
        />

        <Route path="/about" element={<AboutPage t={t}/>} />

        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/complete-profile" element={<CompleteProfilePage/>} />

        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>

      {!isAuthPage && <Footer t={t}/>}

      {coming && (
        <ComingModal
          t={t}
          tool={coming}
          close={() => setComing(null)}
        />
      )}

    </div>
  );
}
