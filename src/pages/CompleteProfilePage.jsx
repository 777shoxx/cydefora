import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthContext";
import "./cyberAuth.css";

const translations = {
  uz: {
    status: "TIZIM ONLAYN",
    subtitle: "// AKKAUNTNI YAKUNLASH",
    log1: "> google orqali tasdiqlandi",
    log2: "> username va parol talab qilinadi",
    log3: "> ma'lumotlar kutilmoqda...",
    accessId: "FOYDALANUVCHI NOMI",
    accessKey: "YANGI PAROL",
    username: "username",
    password: "password",
    submit: "[ AKKAUNTNI YAKUNLASH ]",
    saving: "[ SAQLANMOQDA... ]",
    logout: "Chiqish",
    encrypted: "SHIFRLANGAN",
    secure: "XAVFSIZ",
    node: "CYDEFORA TUGUNI",
    required: "Username va password kiriting.",
    usernameShort: "Username kamida 3 ta belgidan iborat bo‘lsin.",
    passwordShort: "Password kamida 6 ta belgidan iborat bo‘lsin.",
    taken: "Bu username band.",
  },

  ru: {
    status: "СИСТЕМА ОНЛАЙН",
    subtitle: "// ЗАВЕРШЕНИЕ АККАУНТА",
    log1: "> подтверждено через google",
    log2: "> требуется имя пользователя и пароль",
    log3: "> ожидание данных...",
    accessId: "ИМЯ ПОЛЬЗОВАТЕЛЯ",
    accessKey: "НОВЫЙ ПАРОЛЬ",
    username: "имя пользователя",
    password: "пароль",
    submit: "[ ЗАВЕРШИТЬ АККАУНТ ]",
    saving: "[ СОХРАНЕНИЕ... ]",
    logout: "Выйти",
    encrypted: "ЗАШИФРОВАНО",
    secure: "БЕЗОПАСНО",
    node: "УЗЕЛ CYDEFORA",
    required: "Введите имя пользователя и пароль.",
    usernameShort: "Имя пользователя должно содержать минимум 3 символа.",
    passwordShort: "Пароль должен содержать минимум 6 символов.",
    taken: "Это имя пользователя занято.",
  },

  en: {
    status: "SYSTEM ONLINE",
    subtitle: "// COMPLETE YOUR ACCOUNT",
    log1: "> verified via google",
    log2: "> username and password required",
    log3: "> awaiting credentials...",
    accessId: "ACCESS ID",
    accessKey: "NEW ACCESS KEY",
    username: "username",
    password: "password",
    submit: "[ COMPLETE ACCOUNT ]",
    saving: "[ SAVING... ]",
    logout: "Log out",
    encrypted: "ENCRYPTED",
    secure: "SECURE",
    node: "CYDEFORA NODE",
    required: "Username and password required.",
    usernameShort: "Username must be at least 3 characters.",
    passwordShort: "Password must be at least 6 characters.",
    taken: "This username is taken.",
  },
};

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading, setProfile } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [language, setLanguage] = useState(
    localStorage.getItem("cydefora-language") || "uz"
  );

  const t = translations[language];

  useEffect(() => {
    if (loading || profileLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
    } else if (profile?.username) {
      navigate("/", { replace: true });
    }
  }, [loading, profileLoading, user, profile, navigate]);

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("cydefora-language", lang);
  }

  async function handleComplete(e) {
    e.preventDefault();

    if (!username.trim() || !password) {
      setMessage(t.required);
      return;
    }

    if (username.trim().length < 3) {
      setMessage(t.usernameShort);
      return;
    }

    if (password.length < 6) {
      setMessage(t.passwordShort);
      return;
    }

    if (!user) return;

    setSubmitting(true);
    setMessage("");

    const cleanUsername = username.trim().toLowerCase();

    const { data: existing, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (checkError) {
      console.error("Username check error:", checkError);
    }

    if (existing && existing.id !== user.id) {
      setMessage(t.taken);
      setSubmitting(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password,
    });

    if (passwordError) {
      console.error("Password error:", passwordError);
      setMessage(passwordError.message);
      setSubmitting(false);
      return;
    }

    const { data: updatedProfile, error: profileError } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (profileError) {
      console.error("Profile update error:", profileError);
      setMessage(profileError.message);
      setSubmitting(false);
      return;
    }

    setProfile(updatedProfile);
    setSubmitting(false);
    navigate("/");
  }

  return (
    <div className="cyber-login-page">

      <div className="cyber-grid"></div>

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

      <div className="cyber-login-card">

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

        <div className="terminal-log">
          <p>{t.log1}</p>
          <p>{t.log2}</p>
          <p>{t.log3}</p>
        </div>

        <form onSubmit={handleComplete}>

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
              autoComplete="new-password"
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
            <div className="cyber-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="cyber-login-button"
            disabled={submitting}
          >
            {submitting ? t.saving : t.submit}
          </button>

        </form>

        <button
          className="cyber-create"
          onClick={signOut}
        >
          {t.logout}
        </button>

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
