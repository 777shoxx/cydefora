import { PASSWORD_MESSAGES, COMMON_PASSWORDS, SEQUENCE_PATTERNS } from "../data/passwordMessages";

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

export function scorePassword(password) {
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

export function getRandomMessage(level, previousMessage) {
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
