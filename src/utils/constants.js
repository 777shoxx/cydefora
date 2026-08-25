import { LockKeyhole, Link2, Mail, Globe, Bot } from "lucide-react";

export const tools = [
  { id: "password", icon: LockKeyhole, active: true, key: "password" },
  { id: "link", icon: Link2, label: { uz: "Link Checker", ru: "Проверка ссылки", en: "Link Checker" } },
  { id: "email", icon: Mail, label: { uz: "Email Checker", ru: "Проверка Email", en: "Email Checker" } },
  { id: "website", icon: Globe, label: { uz: "Web sayt tekshiruvi", ru: "Проверка сайта", en: "Website Security Check" } },
  { id: "ai", icon: Bot, label: { uz: "AI Cyber Chat", ru: "AI Cyber Chat", en: "AI Cyber Chat" } }
];

export const PASSWORD_MESSAGES = {
  weak: [
    "Aka, hacker buni ko'zini yumib buzadi 😂",
    "Bu parol emas, hackerga taklifnoma-ku 💀",
    "Hacker: rahmat, parolni o'zingiz beribsiz 😭",
    "Buni buzish emas, taxmin qilish deyishadi 😂",
    "Parolingiz hacker uchun warm-up ekan.",
    "Bu parolni himoya qilishga qo'riqchi ham yordam bermaydi.",
    "Hacker buni ko'rsa, bugun omadim bor deydi 😎",
    "Brute-force: nihoyat oson topshiriq.",
    "Bu darajada oson parol bilan xavfsizlik ta'tilga chiqqan.",
    "Hacker laptopini ochmasdan ham topishi mumkin 💀",
    "Bu parol hacker uchun tutorial level.",
    "Parolingiz o'zini himoya qila olmayapti 😭",
    "Hacker: shu xolosmi? 😂",
    "Bu parolni ko'rib hackerning kayfiyati ko'tariladi.",
    "Cybersecurity bu parol bilan biroz xafa bo'ldi.",
    "Buni topish uchun hackerga ham kuch sarflash shart emas.",
    "Parolga ozgina kuch kerak, aka 😅",
    "Bu parol hacker uchun bepul bonus.",
    "Xavfsizlik darajasi: eshik bor, lekin qulf yo'q.",
    "Hacker uchun bugungi eng oson vazifa topildi."
  ],

  medium: [
    "Yomon emas, lekin hacker hali taslim bo'lgani yo'q 😏",
    "Har holda yaxshi. Lekin yana biroz kuchaytirsa bo'ladi.",
    "Hacker biroz o'ylab qoladi, lekin imkon hali bor.",
    "Bu safar hackerga biroz ish tushadi 😎",
    "O'rtacha daraja — himoya bor, lekin devor unchalik baland emas.",
    "Yaxshi boshlanish. Yana bir-ikki qatlam qo'shamizmi?",
    "Hacker: hmm, bu safar oson bo'lmaydi.",
    "Parolingiz endi oddiy nishon emas.",
    "Hali Fort Knox emas, lekin yomon ham emas 😂"
  ],

  strong: [
    "Voy dod, bu parolni ko'rib hacker ham o'ylanib qoladi 😂",
    "Hacker: aka, bunisini qayerdan oldingiz? 💀",
    "Endi hackerning ishi ancha qiyinlashdi.",
    "Bu parol bilan hackerning kuni yaxshi boshlanmaydi 😎",
    "Hacker laptopiga qarab: bugun boshqa ish qilamiz shekilli.",
    "Mana endi gap boshqa! 🔥",
    "Bu parolga qarshi brute-force ham ter to'kadi."
  ],

  veryStrong: [
    "VOY DOD 😭 Hacker buni ko'rib kompyuterni o'chiradi.",
    "Hacker: men bugun boshqa saytga kiraman 💀",
    "Bu parolni ko'rib brute-force ham ta'til so'raydi.",
    "Hackerning butun rejasi shu yerda tugadi 😂",
    "Bunaqa parolni ko'rmaganimga ancha bo'ldi 🔥"
  ]
};

export const COMMON_PASSWORDS = new Set([
  "password","password123","123456","1234567","12345678","123456789","1234567890",
  "qwerty","qwerty123","admin","admin123","letmein","welcome","iloveyou","monkey",
  "dragon","football","abc123","111111","000000","1q2w3e4r","qwertyuiop","passw0rd",
  "login","root","toor","secret","guest"
]);

export const SEQUENCE_PATTERNS = [
  "1234567890","abcdefghijklmnopqrstuvwxyz","qwertyuiop","asdfghjkl",
  "zxcvbnm","0987654321","987654321","qwerty","asdf","zxcv"
];
