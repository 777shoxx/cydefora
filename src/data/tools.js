import { LockKeyhole, Link2, Mail, Globe, Bot } from "lucide-react";

export const tools = [
  { id: "password", icon: LockKeyhole, active: true, key: "password" },
  { id: "link", icon: Link2, label: { uz: "Link Checker", ru: "Проверка ссылки", en: "Link Checker" } },
  { id: "email", icon: Mail, label: { uz: "Email Checker", ru: "Проверка Email", en: "Email Checker" } },
  { id: "website", icon: Globe, label: { uz: "Web sayt tekshiruvi", ru: "Проверка сайта", en: "Website Security Check" } },
  { id: "ai", icon: Bot, label: { uz: "AI Cyber Chat", ru: "AI Cyber Chat", en: "AI Cyber Chat" } }
];
