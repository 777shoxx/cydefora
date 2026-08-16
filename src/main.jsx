import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShieldCheck, LockKeyhole, Link2, Mail, Globe, Bot, LayoutDashboard,
  Menu, X, Sun, Moon, ChevronDown, ArrowRight, CheckCircle2,
  AlertTriangle, Eye, EyeOff, Zap, GraduationCap, Target, Shield,
  Users, Send, Instagram, Info, Github, ExternalLink
} from "lucide-react";
import "./styles.css";
import logoUrl from "./cydefora-logo.jpg";
import AuthButton from "./auth/AuthButton";

const translations = {
  uz: {
    home: "Bosh sahifa", password: "Parol tekshirish", tools: "Vositalar",
    dashboard: "Dashboard", about: "Biz haqimizda", start: "Boshlash",
    learn: "Batafsil ma'lumot", hero1: "Raqamli dunyo",
    hero2: "rivojlanmoqda.",
    hero3: "Tahdidlar ham.",
    heroDesc: "Cydefora — kiberxavfsizlikni sodda, amaliy va qiziqarli tarzda o‘rganish hamda kundalik xavfsizlikni tekshirish uchun yaratilgan demo platforma.",
    why: "Nega", safeTools: "Xavfsiz vositalar", safeDesc: "Hozirgi vositalar brauzeringizda ishlaydi va parol tekshiruvi qurilmangizning o‘zida bajariladi.",
    easy: "Oson tushunish", easyDesc: "Murakkab kiberxavfsizlik tushunchalarini oddiy tilda va amaliy misollar bilan ko‘rsatamiz.",
    practical: "Amaliy yondashuv", practicalDesc: "Faqat nazariya emas — real hayotdagi xavfsizlik odatlarini shakllantirishga e'tibor beramiz.",
    fast: "Tezkor va qulay", fastDesc: "O‘rnatish shart emas. Brauzerni oching va kerakli vositadan foydalaning.",
    checkerTitle: "Parolingiz qanchalik kuchli?",
    checkerDesc: "Parolni kiriting. Cydefora uzunlik, belgilar xilma-xilligi, takrorlanishlar va keng tarqalgan parollarni tahlil qiladi.",
    checkNow: "Tekshirish", enterPassword: "Parol kiriting",
    strength: "Mustahkamlik darajasi", chars: "Kamida 8 ta belgi",
    number: "Raqam bor", upper: "Katta harf bor", special: "Maxsus belgi bor",
    weak: "Zaif", medium: "O‘rtacha", strong: "Kuchli", veryStrong: "Juda kuchli",
    comingTitle: "Coming Soon", comingDesc: "Bu vosita hozircha demo rejimida. Tez orada ishga tushadi.",
    dashboardTitle: "Cydefora Dashboard", checks: "Parol tekshiruvlari",
    strongPasswords: "Kuchli parollar", available: "Ishlayotgan vositalar", recent: "So‘nggi faollik",
    demo: "Cydefora hozircha demo loyiha sifatida ishlamoqda. Ayrim funksiyalar tez orada ishga tushiriladi.",
    show: "Ko‘rsatish", hide: "Yashirish", availableLabel: "Ishlaydi", coming: "Coming Soon",
    aboutTitle: "Cydefora haqida", aboutText: "Cydefora — kiberxavfsizlikni o‘rganish va raqamli xavfsizlikni yaxshilash uchun yaratilayotgan mustaqil loyiha. Hozirgi versiya demo sifatida ishlaydi: parol tekshiruvi faol, qolgan vositalar esa bosqichma-bosqich qo‘shiladi.",
    aboutMission: "Maqsadimiz", aboutMissionText: "Kiberxavfsizlikni faqat mutaxassislar uchun emas, oddiy foydalanuvchi uchun ham tushunarli va qiziqarli qilish.",
    contact: "Kontakt", contactText: "Cydefora yangiliklari va loyihaning keyingi versiyalari uchun bizni kuzating.",
    privacy: "Parol qurilmangizda tekshiriladi. Xom parol serverga yuborilmaydi va dashboardda saqlanmaydi.",
    securityTips: "Xavfsizlik maslahatlari",
    tip1: "Har bir akkaunt uchun alohida parol ishlating.",
    tip2: "12+ belgili, tasodifiy va noyob parol tanlang.",
    tip3: "Muhim parollarni qayta ishlatmang.",
    demoStats: "Demo statistika brauzeringizda lokal saqlanadi.",
    noBackend: "Backend ma'lumotlari hali mavjud emas — bu demo dashboard."
  },

  ru: {
    home: "Главная", password: "Проверка пароля", tools: "Инструменты",
    dashboard: "Dashboard", about: "О нас", start: "Начать",
    learn: "Подробнее", hero1: "Цифровой мир",
    hero2: "развивается.",
    hero3: "Угрозы тоже.",
    heroDesc: "Cydefora — демо-платформа для простого, практичного и интересного изучения кибербезопасности и цифровой защиты.",
    why: "Почему", safeTools: "Безопасные инструменты", safeDesc: "Доступные инструменты работают в браузере, а проверка пароля выполняется локально.",
    easy: "Просто понять", easyDesc: "Объясняем сложные темы кибербезопасности простым языком и на практических примерах.",
    practical: "Практический подход", practicalDesc: "Не только теория — формируем полезные привычки цифровой безопасности.",
    fast: "Быстро и удобно", fastDesc: "Ничего устанавливать не нужно. Откройте браузер и используйте инструмент.",
    checkerTitle: "Насколько надежен ваш пароль?",
    checkerDesc: "Введите пароль. Cydefora анализирует длину, разнообразие символов, повторения и распространенные пароли.",
    checkNow: "Проверить", enterPassword: "Введите пароль",
    strength: "Надежность", chars: "Минимум 8 символов",
    number: "Есть цифра", upper: "Есть заглавная", special: "Есть спецсимвол",
    weak: "Слабый", medium: "Средний", strong: "Сильный", veryStrong: "Очень сильный",
    comingTitle: "Coming Soon", comingDesc: "Этот инструмент пока работает в демо-режиме. Скоро он будет запущен.",
    dashboardTitle: "Cydefora Dashboard", checks: "Проверки паролей",
    strongPasswords: "Сильные пароли", available: "Работающие инструменты", recent: "Последняя активность",
    demo: "Cydefora сейчас работает как демонстрационный проект. Некоторые функции скоро будут запущены.",
    show: "Показать", hide: "Скрыть", availableLabel: "Работает", coming: "Coming Soon",
    aboutTitle: "О Cydefora", aboutText: "Cydefora — независимый проект, который создается для изучения кибербезопасности и повышения цифровой безопасности. Сейчас это демо: проверка пароля работает, остальные инструменты будут добавляться постепенно.",
    aboutMission: "Наша цель", aboutMissionText: "Сделать кибербезопасность понятной и интересной не только специалистам, но и обычным пользователям.",
    contact: "Контакты", contactText: "Следите за новостями Cydefora и следующими версиями проекта.",
    privacy: "Пароль проверяется на вашем устройстве. Сырой пароль не отправляется на сервер и не сохраняется в dashboard.",
    securityTips: "Советы по безопасности",
    tip1: "Используйте отдельный пароль для каждого аккаунта.",
    tip2: "Выбирайте уникальные пароли длиной 12+ символов.",
    tip3: "Не повторно используйте важные пароли.",
    demoStats: "Демо-статистика хранится локально в браузере.",
    noBackend: "Данных backend пока нет — это демо-dashboard."
  },

  en: {
    home: "Home", password: "Password Checker", tools: "Tools",
    dashboard: "Dashboard", about: "About Us", start: "Get Started",
    learn: "Learn More", hero1: "The digital world",
    hero2: "is growing.",
    hero3: "So are the threats.",
    heroDesc: "Cydefora is a demo platform built to make cybersecurity practical, understandable, and interesting while helping people improve everyday digital security.",
    why: "Why", safeTools: "Secure tools", safeDesc: "Available tools run in your browser, and password checking happens locally on your device.",
    easy: "Easy to understand", easyDesc: "Complex cybersecurity ideas explained in simple language with practical examples.",
    practical: "Practical approach", practicalDesc: "Not just theory — build useful real-world digital security habits.",
    fast: "Fast & simple", fastDesc: "No installation required. Open your browser and use the tool you need.",
    checkerTitle: "How strong is your password?",
    checkerDesc: "Enter a password. Cydefora analyzes length, character diversity, repetition, patterns, and common passwords.",
    checkNow: "Check Password", enterPassword: "Enter password",
    strength: "Strength", chars: "At least 8 characters",
    number: "Has a number", upper: "Has uppercase", special: "Has special character",
    weak: "Weak", medium: "Medium", strong: "Strong", veryStrong: "Very strong",
    comingTitle: "Coming Soon", comingDesc: "This tool is currently in demo mode. It will launch soon.",
    dashboardTitle: "Cydefora Dashboard", checks: "Password checks",
    strongPasswords: "Strong passwords", available: "Working tools", recent: "Recent activity",
    demo: "Cydefora is currently running as a demo project. Some features are coming soon.",
    show: "Show", hide: "Hide", availableLabel: "Working", coming: "Coming Soon",
    aboutTitle: "About Cydefora", aboutText: "Cydefora is an independent project being built to help people learn cybersecurity and improve everyday digital security. The current version is a demo: the password checker is active, while other tools will be added step by step.",
    aboutMission: "Our mission", aboutMissionText: "Make cybersecurity understandable and interesting not only for specialists, but for everyday users too.",
    contact: "Contact", contactText: "Follow Cydefora for project news and future releases.",
    privacy: "Your password is checked on your device. The raw password is not sent to a server or stored in the dashboard.",
    securityTips: "Security tips",
    tip1: "Use a unique password for every account.",
    tip2: "Choose unique passwords with 12+ characters.",
    tip3: "Never reuse an important password.",
    demoStats: "Demo statistics are stored locally in your browser.",
    noBackend: "No backend data yet — this is a demo dashboard."
  }
};

const tools = [
  { id: "password", icon: LockKeyhole, active: true, key: "password" },
  { id: "link", icon: Link2, label: { uz:"Link Checker", ru:"Проверка ссылки", en:"Link Checker" } },
  { id: "email", icon: Mail, label: { uz:"Email Checker", ru:"Проверка Email", en:"Email Checker" } },
  { id: "website", icon: Globe, label: { uz:"Web sayt tekshiruvi", ru:"Проверка сайта", en:"Website Security Check" } },
  { id: "ai", icon: Bot, label: { uz:"AI Cyber Chat", ru:"AI Cyber Chat", en:"AI Cyber Chat" } }
];

const PASSWORD_MESSAGES = {
  weak: [
    "Aka, hacker buni ko‘zini yumib buzadi 😂",
    "Bu parol emas, hackerga taklifnoma-ku 💀",
    "Hacker: rahmat, parolni o‘zingiz beribsiz 😭",
    "Buni buzish emas, taxmin qilish deyishadi 😂",
    "Parolingiz hacker uchun warm-up ekan.",
    "Bu parolni himoya qilishga qo‘riqchi ham yordam bermaydi.",
    "Hacker buni ko‘rsa, bugun omadim bor deydi 😎",
    "Brute-force: nihoyat oson topshiriq.",
    "Bu darajada oson parol bilan xavfsizlik ta’tilga chiqqan.",
    "Hacker laptopini ochmasdan ham topishi mumkin 💀",
    "Bu parol hacker uchun tutorial level.",
    "Parolingiz o‘zini himoya qila olmayapti 😭",
    "Hacker: shu xolosmi? 😂",
    "Bu parolni ko‘rib hackerning kayfiyati ko‘tariladi.",
    "Cybersecurity bu parol bilan biroz xafa bo‘ldi.",
    "Buni topish uchun hackerga ham kuch sarflash shart emas.",
    "Parolga ozgina kuch kerak, aka 😅",
    "Bu parol hacker uchun bepul bonus.",
    "Xavfsizlik darajasi: eshik bor, lekin qulf yo‘q.",
    "Hacker uchun bugungi eng oson vazifa topildi.",
    "Buni brute-force ham uyquda bajaradi 😂",
    "Parolingiz juda ham do‘stona munosabatda hackerlarga.",
    "Hacker: kirishga ruxsat so‘rashim kerakmi yoki shunchaki kiraymi? 💀",
    "Bu parolni ko‘rib hacker ham kulib yuboradi.",
    "Security level: mehmonlar uchun Wi-Fi paroli.",
    "Bu parol bilan hackerning ishi juda osonlashadi.",
    "Hackerga qarshi qalqon bor, lekin qalqon qog‘ozdan 😭",
    "Bitta kuchli parol bilan hayotingiz ancha xavfsiz bo‘ladi.",
    "Hozircha bu parolni jiddiy himoya deb bo‘lmaydi.",
    "Hackerning bugungi ish rejasi: sizning parolingizni topish. Va bu oson.",
    "Bu parolga hujum qilish uchun superkompyuter ham shart emas.",
    "Parolingiz hackerga deyarli yashirinmasdan turibdi.",
    "Bu parol security treningining birinchi savoliga o‘xshaydi.",
    "Hacker: bugun ishlar juda oson ketmoqda 😂",
    "Parolingizni kuchaytirish vaqti keldi."
  ],

  medium: [
    "Yomon emas, lekin hacker hali taslim bo‘lgani yo‘q 😏",
    "Har holda yaxshi. Lekin yana biroz kuchaytirsa bo‘ladi.",
    "Hacker biroz o‘ylab qoladi, lekin imkon hali bor.",
    "Bu safar hackerga biroz ish tushadi 😎",
    "O‘rtacha daraja — himoya bor, lekin devor unchalik baland emas.",
    "Yaxshi boshlanish. Yana bir-ikki qatlam qo‘shamizmi?",
    "Hacker: hmm, bu safar oson bo‘lmaydi.",
    "Parolingiz endi oddiy nishon emas.",
    "Hali Fort Knox emas, lekin yomon ham emas 😂",
    "Bir oz kuchaytirsangiz, hackerning kayfiyati tushadi.",
    "Himoya ishlayapti, lekin uni yanada kuchaytirish mumkin.",
    "Hacker uchun bu endi warm-up emas.",
    "Yaxshi. Lekin biz bundan ham yaxshisini qila olamiz.",
    "Bu parol hackerga ozgina bosh og‘rig‘i beradi.",
    "Hacker: mayli, bunga vaqt sarflash kerak ekan.",
    "Security level: yomon emas, lekin perfect emas.",
    "Parol allaqachon o‘zini himoya qilishni o‘rganyapti 😎",
    "Hacker uchun eshik bor, lekin qulf ham bor.",
    "Yaxshi himoya. Ammo yana bitta layer foydali bo‘ladi.",
    "Bu parolni buzish endi shunchaki taxmin emas.",
    "Hacker biroz sabr qilishi kerak bo‘ladi.",
    "Yana uzunroq qilsangiz, natija ancha yaxshi bo‘ladi.",
    "Kichkina upgrade — katta security.",
    "Bu parol yomon emas, lekin hackerga imkon qoldiryapti.",
    "Cybersecurity radarida bu parol o‘rtacha ko‘rinmoqda.",
    "Himoya bor. Endi uni kuchaytirish vaqti.",
    "Hacker bu safar coffee ichib o‘tirishga majbur ☕",
    "Bu parol oddiy parollardan ancha yaxshi.",
    "Yana biroz murakkablik qo‘shing — hacker xafa bo‘ladi 😂",
    "O‘rtacha daraja. Keyingi levelga chiqish mumkin.",
    "Hacker: bu safar cheat code ishlamaydi.",
    "Parol o‘zini himoya qilishni boshlagan.",
    "Yaxshi yo‘ldasiz, lekin hali final boss emas.",
    "Bu password uchun biroz ko‘proq vaqt kerak bo‘ladi.",
    "Hackerning rejasiga ozgina qarshilik bor 😄"
  ],

  strong: [
    "Voy dod, bu parolni ko‘rib hacker ham o‘ylanib qoladi 😂",
    "Hacker: aka, bunisini qayerdan oldingiz? 💀",
    "Endi hackerning ishi ancha qiyinlashdi.",
    "Bu parol bilan hackerning kuni yaxshi boshlanmaydi 😎",
    "Hacker laptopiga qarab: bugun boshqa ish qilamiz shekilli.",
    "Mana endi gap boshqa! 🔥",
    "Bu parolga qarshi brute-force ham ter to‘kadi.",
    "Hacker: buni buzish uchun coffee yetmaydi ☕😂",
    "Parolingiz endi jiddiy himoya darajasida.",
    "Bu devordan hacker sakrab o‘ta olmaydi.",
    "Hacker uchun bu endi real challenge.",
    "Voy, bu parolga qarab algoritm ham o‘ylanadi 😂",
    "Mana shunday parol hackerning rejalarini buzadi.",
    "Bu safar hackerga omad emas, kuch kerak bo‘ladi.",
    "Himoya darajasi ancha yuqori. Respect 🫡",
    "Hacker bu parolni ko‘rib birinchi coffee ichadi.",
    "Security level: hacker uchun jiddiy muammo.",
    "Bu parol oddiy hujumlarga ancha chidamli.",
    "Hackerning bugungi ish hajmi oshdi 😂",
    "Parolingiz endi oson nishon emas.",
    "Bu password hacker uchun jiddiy headache.",
    "Mana shu — yaxshi cybersecurity mindset.",
    "Hacker: mayli, bu safar oson bo‘lmaydi.",
    "Parol kuchli. Cybersecurity approve qildi ✅",
    "Bu parolga qarshi hujum qilish vaqt talab qiladi.",
    "Hackerning laptopi ham biroz qiziydi 🔥",
    "Endi brute-force o‘zini noqulay his qiladi.",
    "Bu parol himoyani jiddiy qabul qilayotganini ko‘rsatadi.",
    "Hacker uchun bu oddiy target emas.",
    "Bu daraja — ancha yaxshi security.",
    "Hacker: bugun easy mode topilmadi.",
    "Parolingiz ancha yaxshi qalqon bo‘lib turibdi.",
    "Cybersecurity: yaxshi ish. Hacker: unchalik yaxshi emas 😭",
    "Bu password bilan hackerga sabr kerak.",
    "Himoya darajasi sezilarli darajada yaxshilandi."
  ],

  veryStrong: [
    "VOY DOD 😭 Hacker buni ko‘rib kompyuterni o‘chiradi.",
    "Hacker: men bugun boshqa saytga kiraman 💀",
    "Bu parolni ko‘rib brute-force ham ta’til so‘raydi.",
    "Hackerning butun rejasi shu yerda tugadi 😂",
    "Bunaqa parolni ko‘rmaganimga ancha bo‘ldi 🔥",
    "Bu parolga hujum qilish — hacker uchun overtime.",
    "Hacker: aka, bu nimasi o‘zi?! 😭",
    "Parolingiz hackerga alohida challenge tashladi.",
    "Bu darajada kuchli parolga respect 🫡",
    "Hacker buni ko‘rib: bugun omad yo‘q ekan.",
    "Brute-force: Men bunday sharoitda ishlamayman 😂",
    "Bu parolni buzish emas, afsona yaratish bo‘ladi.",
    "Hacker uchun bu password emas, boss level 🎮",
    "Security level: hackerning sabri sinovda.",
    "Bu parolni ko‘rgan hacker boshqa kasb tanlaydi 😂",
    "Hacker bu parolga qarab resignation letter yozadi 💀",
    "Bu parol cybersecurity bo‘yicha full armor.",
    "Hacker: serverda boshqa narsa bormi? Bu parolga tegmayman.",
    "Brute-force bugun ishga chiqmaslikka qaror qildi.",
    "Bu password hacker uchun nightmare mode.",
    "Parolingiz hackerning kayfiyatini tushirishga yetadi 😂",
    "Mana bu — parol degan nomga loyiq.",
    "Hacker bu yerda easy mode topa olmaydi.",
    "Bu parolga hujum qilish uchun sabr kerak bo‘ladi.",
    "Security level: hacker coffee refill qilmoqda ☕",
    "Bu parolni ko‘rib algoritm ham: respect.",
    "Hacker uchun bu boss fight.",
    "Bu darajada kuchli password — gap yo‘q 🔥",
    "Hackerning bugungi eng qiyin vazifasi topildi.",
    "Cybersecurity: approved. Hacker: disappointed. 😂",
    "Hacker: bu password bilan kelishib olish kerak shekilli.",
    "Bu parolga qarshi oddiy brute-force oson yechim emas.",
    "Parolingiz hackerga mental damage berdi 💀",
    "Security level: final boss.",
    "Hacker bugun bu parolni ko‘rmaganday bo‘ladi 😂"
  ]
};

const COMMON_PASSWORDS = new Set([
  "password","password123","123456","1234567","12345678","123456789","1234567890",
  "qwerty","qwerty123","admin","admin123","letmein","welcome","iloveyou","monkey",
  "dragon","football","abc123","111111","000000","1q2w3e4r","qwertyuiop","passw0rd",
  "login","root","toor","secret","guest"
]);

const SEQUENCE_PATTERNS = [
  "1234567890","abcdefghijklmnopqrstuvwxyz","qwertyuiop","asdfghjkl",
  "zxcvbnm","0987654321","987654321","qwerty","asdf","zxcv"
];

function getRandomMessage(level, previousMessage) {
  const list = PASSWORD_MESSAGES[level] || PASSWORD_MESSAGES.medium;
  if (list.length === 1) return list[0];

  let message = list[Math.floor(Math.random() * list.length)];
  let guard = 0;

  while (message === previousMessage && guard < 20) {
    message = list[Math.floor(Math.random() * list.length)];
    guard++;
  }

  return message;
}

function hasSequence(password) {
  const p = password.toLowerCase();

  return SEQUENCE_PATTERNS.some(
    pattern =>
      p.includes(pattern) ||
      p.includes([...pattern].reverse().join(""))
  );
}

function hasKeyboardPattern(password) {
  const p = password.toLowerCase();

  const patterns = [
    "qwerty",
    "asdfgh",
    "zxcvbn",
    "йцукен",
    "фывапр",
    "ячсмить"
  ];

  return patterns.some(
    x => p.includes(x) || p.includes([...x].reverse().join(""))
  );
}

function scorePassword(password) {
  if (!password) {
    return {
      score: 0,
      label: "—",
      level: null,
      length: false,
      number: false,
      upper: false,
      lower: false,
      special: false,
      long: false,
      veryLong: false,
      repeated: false,
      common: false,
      sequence: false,
      keyboard: false,
      entropy: 0
    };
  }

  const length = password.length >= 8;
  const long = password.length >= 12;
  const veryLong = password.length >= 16;
  const number = /\d/.test(password);
  const upper = /[A-ZА-ЯЁ]/.test(password);
  const lower = /[a-zа-яё]/.test(password);
  const special = /[^A-Za-zА-Яа-яЁё0-9]/u.test(password);
  const repeated = /(.)\1{2,}/u.test(password);
  const common = COMMON_PASSWORDS.has(password.toLowerCase());
  const sequence = hasSequence(password);
  const keyboard = hasKeyboardPattern(password);

  const pools = [
    lower ? 26 : 0,
    upper ? 26 : 0,
    number ? 10 : 0,
    special ? 33 : 0
  ].reduce((a, b) => a + b, 0);

  const entropy =
    pools > 0 ? Math.round(password.length * Math.log2(pools)) : 0;

  let points = 0;

  if (password.length >= 8) points += 1;
  if (password.length >= 10) points += 1;
  if (password.length >= 12) points += 1;
  if (password.length >= 16) points += 1;
  if (lower) points += 1;
  if (upper) points += 1;
  if (number) points += 1;
  if (special) points += 1;
  if (entropy >= 50) points += 1;
  if (entropy >= 70) points += 1;

  if (repeated) points -= 2;
  if (sequence) points -= 2;
  if (keyboard) points -= 2;
  if (common) points -= 6;

  let score = 1;

  if (!common && password.length >= 8 && points >= 3) score = 2;
  if (!common && password.length >= 10 && points >= 6) score = 3;
  if (!common && password.length >= 14 && points >= 8 && entropy >= 60) score = 4;

  const labels = ["—", "Weak", "Medium", "Strong", "Very strong"];
  const levels = [null, "weak", "medium", "strong", "veryStrong"];

  return {
    score,
    label: labels[score],
    level: levels[score],
    length,
    number,
    upper,
    lower,
    special,
    long,
    veryLong,
    repeated,
    common,
    sequence,
    keyboard,
    entropy
  };
}

function App() {
  const [lang, setLang] = useState("uz");
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [page, setPage] = useState("home");
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

  function navigate(target) {
    setPage(target);
    setMenu(false);
    setLangOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function openTool(tool) {
    if (tool.id === "password") {
      navigate("password");
    } else {
      setComing(tool);
    }
  }

  return (
    <div className={dark ? "app dark" : "app light"}>

      <header className="navbar">

        <button
          className="brand"
          onClick={() => navigate("home")}
          aria-label="Cydefora home"
        >
          <span className="logoFrame">
            <img src={logoUrl} alt="Cydefora logo" />
          </span>

          <span>CYDEFORA</span>
        </button>

        <nav className="desktopNav">

          <button
            className={page === "home" ? "active" : ""}
            onClick={() => navigate("home")}
          >
            {t.home}
          </button>

          <button
            className={page === "password" ? "active" : ""}
            onClick={() => navigate("password")}
          >
            {t.password}
          </button>

          <button
            className={page === "tools" ? "active" : ""}
            onClick={() => navigate("tools")}
          >
            {t.tools}
          </button>

          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => navigate("dashboard")}
          >
            {t.dashboard}
          </button>

          <button
            className={page === "about" ? "active" : ""}
            onClick={() => navigate("about")}
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

          <button onClick={() => navigate("home")}>
            {t.home}
          </button>

          <button onClick={() => navigate("password")}>
            {t.password}
          </button>

          <button onClick={() => navigate("tools")}>
            {t.tools}
          </button>

          <button onClick={() => navigate("dashboard")}>
            {t.dashboard}
          </button>

          <button onClick={() => navigate("about")}>
            {t.about}
          </button>

        </div>
      )}

      {page === "home" && (
        <Home
          t={t}
          lang={lang}
          onStart={() => navigate("password")}
          onTool={openTool}
        />
      )}

      {page === "password" && (
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
      )}

      {page === "tools" && (
        <ToolsPage
          t={t}
          lang={lang}
          onTool={openTool}
        />
      )}

      {page === "dashboard" && (
        <Dashboard
          t={t}
          checks={checks}
          strongChecks={strongChecks}
        />
      )}

      {page === "about" && (
        <AboutPage t={t}/>
      )}

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

function Home({ t, lang, onStart, onTool }) {

  return (
    <main>

      <section className="hero">

        <div className="heroCopy">

          <div className="eyebrow">
            <ShieldCheck size={16}/>
            CYBERSECURITY PLATFORM
          </div>

          <h1>
            {t.hero1}
            <br/>
            <span>{t.hero2}</span>
            <br/>
            {t.hero3}
          </h1>

          <p>
            {t.heroDesc}
          </p>

          <div className="heroButtons">

            <button
              className="primary"
              onClick={onStart}
            >
              {t.start}
              <ArrowRight size={18}/>
            </button>

            <button
              className="secondary"
              onClick={() =>
                document
                  .getElementById("why")
                  .scrollIntoView({behavior:"smooth"})
              }
            >
              {t.learn}
            </button>

          </div>

          <div className="trust">

            <span>
              <Shield size={16}/>
              {t.safeTools}
            </span>

            <span>
              <CheckCircle2 size={16}/>
              100% browser-based
            </span>

            <span>
              <Zap size={16}/>
              Free demo
            </span>

          </div>

        </div>

        <div className="heroVisual">

          <div className="orb orb1"></div>
          <div className="orb orb2"></div>

          <div className="heroLogo">
            <img src={logoUrl} alt="Cydefora" />
          </div>

          <div className="codeFloat">
            SECURE // LEARN // PROTECT
          </div>

        </div>

      </section>

      <section id="why" className="section">

        <div className="sectionTitle">
          <span>{t.why}</span>
          <b>Cydefora?</b>
        </div>

        <div className="cards">

          <Feature
            icon={ShieldCheck}
            title={t.safeTools}
            desc={t.safeDesc}
          />

          <Feature
            icon={GraduationCap}
            title={t.easy}
            desc={t.easyDesc}
          />

          <Feature
            icon={Target}
            title={t.practical}
            desc={t.practicalDesc}
          />

          <Feature
            icon={Zap}
            title={t.fast}
            desc={t.fastDesc}
          />

        </div>

      </section>

      <section className="checkerPreview">

        <div>

          <span className="badge">
            FREE TOOL
          </span>

          <h2>
            {t.checkerTitle}
          </h2>

          <p>
            {t.checkerDesc}
          </p>

          <button
            className="primary"
            onClick={onStart}
          >
            {t.checkNow}
            <ArrowRight size={18}/>
          </button>

        </div>

        <MiniChecker t={t}/>

      </section>

      <section className="section toolsSection">

        <div className="sectionTitle">
          <span>{t.tools}</span>
        </div>

        <div className="toolGrid">

          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              t={t}
              lang={lang}
              onClick={() => onTool(tool)}
            />
          ))}

        </div>

      </section>

    </main>
  );
}

function Feature({icon: Icon, title, desc}) {

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

function ToolCard({tool, t, onClick, lang}) {

  const Icon = tool.icon;

  const currentLang = lang || "uz";

  const title =
    tool.id === "password"
      ? t.password
      : tool.label[currentLang];

  return (
    <button
      className={
        "toolCard " +
        (tool.active ? "activeTool" : "")
      }
      onClick={onClick}
    >

      <div className="toolIcon">
        <Icon size={23}/>
      </div>

      <div>

        <h3>{title}</h3>

        <p>
          {tool.active
            ? t.availableLabel
            : t.coming}
        </p>

      </div>

      <ArrowRight
        size={18}
        className="toolArrow"
      />

    </button>
  );
}

function MiniChecker({t}) {

  const [p, setP] = useState("Cydefora2026!");
  const [show, setShow] = useState(false);

  const r = scorePassword(p);

  return (
    <div className="miniChecker">

      <label>
        {t.enterPassword}
      </label>

      <div className="inputWrap">

        <input
          type={show ? "text" : "password"}
          value={p}
          onChange={e => setP(e.target.value)}
        />

        <button
          onClick={() => setShow(!show)}
          aria-label={show ? t.hide : t.show}
        >
          {show
            ? <EyeOff size={18}/>
            : <Eye size={18}/>}
        </button>

      </div>

      <div className="strengthLabel">

        <span>{t.strength}</span>

        <b className={"s" + r.score}>
          {r.score
            ? t[
                ["","weak","medium","strong","veryStrong"]
                [r.score]
              ]
            : "—"}
        </b>

      </div>

      <div className="strengthBar">
        <i
          style={{
            width: `${r.score * 25}%`
          }}
        ></i>
      </div>

      <div className="checksGrid">

        <span className={r.length ? "ok" : ""}>
          <CheckCircle2/>
          {t.chars}
        </span>

        <span className={r.number ? "ok" : ""}>
          <CheckCircle2/>
          {t.number}
        </span>

        <span className={r.upper ? "ok" : ""}>
          <CheckCircle2/>
          {t.upper}
        </span>

        <span className={r.special ? "ok" : ""}>
          <CheckCircle2/>
          {t.special}
        </span>

      </div>

    </div>
  );
}

function PasswordPage({
  t,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  liveResult,
  checkedResult,
  runCheck
}) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <LockKeyhole size={16}/>
          PASSWORD CHECKER
        </span>

        <h1>
          {t.checkerTitle}
        </h1>

        <p>
          {t.checkerDesc}
        </p>

      </div>

      <div className="passwordLayout">

        <section className="passwordBox">

          <label>
            {t.enterPassword}
          </label>

          <div className="bigInput">

            <input
              autoFocus
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <button
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword ? t.hide : t.show
              }
            >
              {showPassword
                ? <EyeOff/>
                : <Eye/>}
            </button>

          </div>

          {password && (

            <div className="resultBox">

              <div className="strengthLabel">

                <span>{t.strength}</span>

                <b
                  className={
                    "s" + liveResult.score
                  }
                >
                  {liveResult.score
                    ? t[
                        [
                          "",
                          "weak",
                          "medium",
                          "strong",
                          "veryStrong"
                        ][liveResult.score]
                      ]
                    : "—"}
                </b>

              </div>

              <div className="strengthBar">
                <i
                  style={{
                    width:
                      `${liveResult.score * 25}%`
                  }}
                ></i>
              </div>

              <div className="checksGrid">

                <span
                  className={
                    liveResult.length ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.chars}
                </span>

                <span
                  className={
                    liveResult.number ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.number}
                </span>

                <span
                  className={
                    liveResult.upper ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.upper}
                </span>

                <span
                  className={
                    liveResult.special ? "ok" : ""
                  }
                >
                  <CheckCircle2/>
                  {t.special}
                </span>

              </div>

            </div>

          )}

          {checkedResult?.message && (

            <div
              className={
                `cyberMessage ${checkedResult.level}`
              }
            >

              <div className="messageMark">
                CY
              </div>

              <p>
                {checkedResult.message}
              </p>

            </div>

          )}

          <button
            className="primary full"
            onClick={runCheck}
          >
            {t.checkNow}
            <ArrowRight size={18}/>
          </button>

          <small className="privacy">
            <ShieldCheck size={15}/>
            {t.privacy}
          </small>

        </section>

        <aside className="tips">

          <h3>
            {t.securityTips}
          </h3>

          <p>
            {t.tip1}
          </p>

          <div className="tip">
            <CheckCircle2/>
            {t.tip2}
          </div>

          <div className="tip">
            <CheckCircle2/>
            {t.tip3}
          </div>

        </aside>

      </div>

    </main>
  );
}

function ToolsPage({t, onTool, lang}) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <Zap size={16}/>
          CYDEFORA TOOLS
        </span>

        <h1>{t.tools}</h1>

        <p>
          Cybersecurity utilities in one place.
        </p>

      </div>

      <div className="toolGrid big">

        {tools.map(tool => (

          <ToolCard
            key={tool.id}
            tool={tool}
            t={t}
            lang={lang}
            onClick={() => onTool(tool)}
          />

        ))}

      </div>

    </main>
  );
}

function Dashboard({t, checks, strongChecks}) {

  return (
    <main className="page">

      <div className="pageHead">

        <span className="eyebrow">
          <LayoutDashboard size={16}/>
          DASHBOARD
        </span>

        <h1>
          {t.dashboardTitle}
        </h1>

        <p>
          {t.demoStats}
        </p>

      </div>

      <div className="stats">

        <Stat
          icon={LockKeyhole}
          title={t.checks}
          value={checks}
        />

        <Stat
          icon={ShieldCheck}
          title={t.strongPasswords}
          value={strongChecks}
        />

        <Stat
          icon={Zap}
          title={t.available}
          value="1 / 5"
        />

        <Stat
          icon={Bot}
          title="Coming Soon"
          value="4"
        />

      </div>

      <div className="dashboardPanel">

        <h2>{t.recent}</h2>

        <div className="empty">

          <AlertTriangle size={28}/>

          <p>
            {t.noBackend}
          </p>

        </div>

      </div>

    </main>
  );
}

function AboutPage({t}) {

  return (
    <main className="page aboutPage">

      <div className="pageHead">

        <span className="eyebrow">
          <Info size={16}/>
          CYDEFORA
        </span>

        <h1>
          {t.aboutTitle}
        </h1>

        <p>
          {t.aboutText}
        </p>

      </div>

      <div className="aboutGrid">

        <section className="aboutCard">

          <div className="iconCircle">
            <Target size={22}/>
          </div>

          <h2>
            {t.aboutMission}
          </h2>

          <p>
            {t.aboutMissionText}
          </p>

        </section>

        <section className="aboutCard">

          <div className="iconCircle">
            <ShieldCheck size={22}/>
          </div>

          <h2>
            {t.safeTools}
          </h2>

          <p>
            {t.safeDesc}
          </p>

        </section>

        <section className="aboutCard">

          <div className="iconCircle">
            <Users size={22}/>
          </div>

          <h2>
            {t.contact}
          </h2>

          <p>
            {t.contactText}
          </p>

          <div className="aboutSocials">

            <a
              href="https://t.me/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Send size={18}/>
              Telegram — @cydefora
              <ExternalLink size={14}/>
            </a>

            <a
              href="https://instagram.com/cydefora"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={18}/>
              Instagram — @cydefora
              <ExternalLink size={14}/>
            </a>

          </div>

        </section>

      </div>

    </main>
  );
}

function Stat({icon: Icon, title, value}) {

  return (
    <div className="stat">

      <div className="toolIcon">
        <Icon size={21}/>
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

    </div>
  );
}

function ComingModal({t, tool, close}) {

  const title =
    tool.label
      ? tool.label.uz
      : "About Cydefora";

  return (
    <div
      className="modalBackdrop"
      onClick={close}
    >

      <div
        className="modal"
        onClick={e => e.stopPropagation()}
      >

        <div className="modalIcon">
          <Bot size={30}/>
        </div>

        <h2>
          {t.comingTitle}
        </h2>

        <h3>
          {title}
        </h3>

        <p>
          {t.comingDesc}
        </p>

        <button
          className="primary full"
          onClick={close}
        >
          OK
        </button>

      </div>

    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(
  <App />
);