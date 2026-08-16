import React, { useState } from "react";
import { supabase } from "../../supabase";
import { signInWithGoogle } from "../auth";
import "./login.css";

export default function LoginPage({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("cydefora-language") || "uz"
  );

  const translations = {
    uz: {
      status: "TIZIM ONLAYN",
      subtitle: "// XAVFSIZ KIRISH TUGUNI",
      log1: "> shifrlangan kanal ishga tushirildi",
      log2: "> shaxsni tasdiqlash tizimi tayyor",
      log3: "> ma'lumotlar kutilmoqda...",
      accessId: "FOYDALANUVCHI NOMI",
      accessKey: "PAROL",
      username: "username",
      password: "password",
      login: "[ XAVFSIZ ULANISHNI O'RNATISH ]",
      verifying: "[ TEKSHIRILMOQDA... ]",
      google: "GOOGLE ORQALI DAVOM ETISH",
      create: "YANGI AKKAUNT YARATISH",
      encrypted: "SHIFRLANGAN",
      secure: "XAVFSIZ",
      node: "CYDEFORA TUGUNI",
      required: "Username va password kiriting.",
      notFound: "ACCOUNT TOPILMADI.",
      denied: "KIRISH RAD ETILDI.",
      granted: "KIRISH RUXSAT ETILDI.",
    },

    ru: {
      status: "СИСТЕМА ОНЛАЙН",
      subtitle: "// УЗЕЛ БЕЗОПАСНОГО ДОСТУПА",
      log1: "> зашифрованный канал запущен",
      log2: "> система проверки личности готова",
      log3: "> ожидание данных...",
      accessId: "ИМЯ ПОЛЬЗОВАТЕЛЯ",
      accessKey: "ПАРОЛЬ",
      username: "имя пользователя",
      password: "пароль",
      login: "[ УСТАНОВИТЬ БЕЗОПАСНОЕ СОЕДИНЕНИЕ ]",
      verifying: "[ ПРОВЕРКА... ]",
      google: "ПРОДОЛЖИТЬ ЧЕРЕЗ GOOGLE",
      create: "СОЗДАТЬ НОВЫЙ АККАУНТ",
      encrypted: "ЗАШИФРОВАНО",
      secure: "БЕЗОПАСНО",
      node: "УЗЕЛ CYDEFORA",
      required: "Введите имя пользователя и пароль.",
      notFound: "АККАУНТ НЕ НАЙДЕН.",
      denied: "ДОСТУП ЗАПРЕЩЕН.",
      granted: "ДОСТУП РАЗРЕШЕН.",
    },

    en: {
      status: "SYSTEM ONLINE",
      subtitle: "// SECURE ACCESS NODE",
      log1: "> encrypted channel initialized",
      log2: "> identity verification ready",
      log3: "> awaiting credentials...",
      accessId: "ACCESS ID",
      accessKey: "ACCESS KEY",
      username: "username",
      password: "password",
      login: "[ ESTABLISH SECURE CONNECTION ]",
      verifying: "[ VERIFYING... ]",
      google: "CONTINUE WITH GOOGLE",
      create: "INITIALIZE NEW IDENTITY",
      encrypted: "ENCRYPTED",
      secure: "SECURE",
      node: "CYDEFORA NODE",
      required: "Username and password required.",
      notFound: "IDENTITY NOT FOUND.",
      denied: "ACCESS DENIED.",
      granted: "ACCESS GRANTED.",
    },
  };

  const t = translations[language];

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("cydefora-language", lang);
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!username.trim() || !password) {
      setMessage(t.required);
      return;
    }

    setLoading(true);
    setMessage("");

    const cleanUsername = username.trim().toLowerCase();

    const { data, error: rpcError } = await supabase.rpc(
      "get_email_by_username",
      {
        username_input: cleanUsername,
      }
    );

    if (rpcError || !data) {
      console.error("RPC error:", rpcError);
      setMessage(t.notFound);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setMessage(t.denied);
      setLoading(false);
      return;
    }

    setMessage(t.granted);
    setLoading(false);

    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }

  return (
    <div className="cyber-login-page">

      <div className="cyber-grid"></div>

      {/* LANGUAGE SELECTOR */}
      <div className="cyber-language">
        <button
          className={language === "uz" ? "active" : ""}
          onClick={() => changeLanguage("uz")}
        >
          UZ
        </button>

        <button
          className={language === "ru" ? "active" : ""}
          onClick={() => changeLanguage("ru")}
        >
          RU
        </button>

        <button
          className={language === "en" ? "active" : ""}
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>
      </div>

      {/* CLOSE */}
      <button
        className="cyber-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      <div className="cyber-login-card">

        {/* HEADER */}
        <div className="cyber-header">

          <div className="cyber-status">
            <span></span>
            {t.status}
          </div>

          <h1>CYDEFORA</h1>

          <p className="cyber-subtitle">
            {t.subtitle}
          </p>

        </div>

        {/* TERMINAL */}
        <div className="terminal-log">
          <p>{t.log1}</p>
          <p>{t.log2}</p>
          <p>{t.log3}</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>

          <label>{t.accessId}</label>

          <div className="cyber-input">

            <span>&gt;_</span>

            <input
              type="text"
              placeholder={t.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

          </div>

          <label>{t.accessKey}</label>

          <div className="cyber-input">

            <span>◆</span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? "◉" : "◌"}
            </button>

          </div>

          {message && (
            <div
              className={
                message === t.granted
                  ? "cyber-message success"
                  : "cyber-message"
              }
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="cyber-login-button"
            disabled={loading}
          >
            {loading ? t.verifying : t.login}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="cyber-divider">
          <span>OR</span>
        </div>

        {/* GOOGLE */}
        <button
          className="cyber-google"
          onClick={signInWithGoogle}
        >
          <span>G</span>
          {t.google}
        </button>

        {/* CREATE ACCOUNT */}
        <button
          className="cyber-create"
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          {t.create}
        </button>

        {/* FOOTER */}
        <div className="cyber-footer">
          <span>{t.encrypted}</span>
          <span>•</span>
          <span>{t.secure}</span>
          <span>•</span>
          <span>{t.node}</span>
        </div>

      </div>
    </div>
  );
}