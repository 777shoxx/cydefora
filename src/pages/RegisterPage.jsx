import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../auth/AuthContext";
import "./cyberAuth.css";

const translations = {
  uz: {
    status: "TIZIM ONLAYN",
    subtitle: "// YANGI IDENTIFIKATSIYA YARATISH",
    log1: "> ro'yxatdan o'tish protokoli ishga tushirildi",
    log2: "> shaxsni yaratish tizimi tayyor",
    log3: "> ma'lumotlar kutilmoqda...",
    accessId: "FOYDALANUVCHI NOMI",
    accessKey: "PAROL",
    username: "username",
    password: "password",
    submit: "[ AKKAUNT YARATISH ]",
    creating: "[ YARATILMOQDA... ]",
    backToLogin: "Akkountingiz bormi? Kirish",
    encrypted: "SHIFRLANGAN",
    secure: "XAVFSIZ",
    node: "CYDEFORA TUGUNI",
    required: "Username va password kiriting.",
    usernameShort: "Username kamida 3 ta belgidan iborat bo‘lsin.",
    passwordShort: "Password kamida 6 ta belgidan iborat bo‘lsin.",
    taken: "Bu username band.",
    createFailed: "Account yaratilmadi.",
    profileFailed: "Profile yaratishda xatolik.",
  },

  ru: {
    status: "СИСТЕМА ОНЛАЙН",
    subtitle: "// СОЗДАНИЕ НОВОЙ ЛИЧНОСТИ",
    log1: "> протокол регистрации запущен",
    log2: "> система создания личности готова",
    log3: "> ожидание данных...",
    accessId: "ИМЯ ПОЛЬЗОВАТЕЛЯ",
    accessKey: "ПАРОЛЬ",
    username: "имя пользователя",
    password: "пароль",
    submit: "[ СОЗДАТЬ АККАУНТ ]",
    creating: "[ СОЗДАНИЕ... ]",
    backToLogin: "Уже есть аккаунт? Войти",
    encrypted: "ЗАШИФРОВАНО",
    secure: "БЕЗОПАСНО",
    node: "УЗЕЛ CYDEFORA",
    required: "Введите имя пользователя и пароль.",
    usernameShort: "Имя пользователя должно содержать минимум 3 символа.",
    passwordShort: "Пароль должен содержать минимум 6 символов.",
    taken: "Это имя пользователя занято.",
    createFailed: "Не удалось создать аккаунт.",
    profileFailed: "Ошибка при создании профиля.",
  },

  en: {
    status: "SYSTEM ONLINE",
    subtitle: "// CREATE NEW IDENTITY",
    log1: "> registration protocol initialized",
    log2: "> identity creation system ready",
    log3: "> awaiting credentials...",
    accessId: "ACCESS ID",
    accessKey: "ACCESS KEY",
    username: "username",
    password: "password",
    submit: "[ CREATE ACCOUNT ]",
    creating: "[ CREATING... ]",
    backToLogin: "Already have an account? Log in",
    encrypted: "ENCRYPTED",
    secure: "SECURE",
    node: "CYDEFORA NODE",
    required: "Username and password required.",
    usernameShort: "Username must be at least 3 characters.",
    passwordShort: "Password must be at least 6 characters.",
    taken: "This username is taken.",
    createFailed: "Account could not be created.",
    profileFailed: "Error creating profile.",
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, profile, loading, profileLoading } = useAuth();

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

    if (user && profile?.username) {
      navigate("/", { replace: true });
    } else if (user && !profile?.username) {
      navigate("/complete-profile", { replace: true });
    }
  }, [loading, profileLoading, user, profile, navigate]);

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("cydefora-language", lang);
  }

  async function handleRegister(e) {
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

    if (existing) {
      setMessage(t.taken);
      setSubmitting(false);
      return;
    }

    const hiddenEmail = `${cleanUsername}@cydefora.local`;

    const { data, error } = await supabase.auth.signUp({
      email: hiddenEmail,
      password,
    });

    if (error) {
      console.error("Signup error:", error);
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    if (!data.user) {
      setMessage(t.createFailed);
      setSubmitting(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email: hiddenEmail,
        username: cleanUsername,
        full_name: "",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      setMessage(t.profileFailed);
      setSubmitting(false);
      return;
    }

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

      <button
        className="cyber-close"
        onClick={() => navigate("/")}
        aria-label="Back to home"
      >
        ×
      </button>

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

        <form onSubmit={handleRegister}>

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
            {submitting ? t.creating : t.submit}
          </button>

        </form>

        <button
          className="cyber-create"
          onClick={() => navigate("/login")}
        >
          {t.backToLogin}
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
