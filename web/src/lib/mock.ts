// Мок-данные — ровно тот контент, что был в макете Claude Design.
// В проде эти значения приходят из Strapi (см. src/lib/api.ts).

import type {
  GuildSettings, RaidProgress, NewsPost, Poll, PollArchiveItem,
  GuildLink, RecruitRole, Requirement,
} from "./types";

export const guild: GuildSettings = {
  name: "Отдел кадров",
  region: "EU · Борейская Тундра",
  faction: "Альянс",
  slogan: "Делаем прогресс тихо, не спеша, с удовольствием от игры.",
  recruitingOpen: true,
  showRaidsmith: false,
  chips: ["Кромка в рейдах", "Высокие ключи M+", "Без токсичности", "Ржём в войсе"],
  stats: [
    { value: "2019", label: "ОСНОВАНЫ", accent: true },
    { value: "2", label: "РЕЙДА В НЕДЕЛЮ", accent: true },
    { value: "Ср/Вс", label: "20:00–23:00 CET" },
    { value: "30", label: "ЧЕЛОВЕК В ШТАТЕ" },
  ],
  hero: {
    currentRaid: { value: "7/9", sub: "Mythic · Manaforge", pct: 78 },
    mplus: { value: "3600+", sub: "RIO · лучший +18" },
    staff: { value: "24/30", sub: "6 онлайн" },
    recruit: { value: "Открыт", sub: "melee · ranged" },
  },
};

export const raidProgress: RaidProgress = {
  raidName: "Manaforge Omega",
  updatedLabel: "обновлено сегодня",
  difficulties: [
    { name: "Normal", killed: 9, total: 9 },
    { name: "Heroic", killed: 9, total: 9 },
    { name: "Mythic", killed: 7, total: 9 },
  ],
  bosses: [
    { name: "Босс 1", status: "killed" },
    { name: "Босс 2", status: "killed" },
    { name: "Босс 3", status: "killed" },
    { name: "Босс 4", status: "killed" },
    { name: "Босс 5", status: "killed" },
    { name: "Босс 6", status: "killed" },
    { name: "Босс 7", status: "killed" },
    { name: "Босс 8 · пуш", status: "push" },
    { name: "Босс 9", status: "alive" },
  ],
  mplus: { bestKey: "+18", rating: "3600+", keysThisSeason: "340+" },
};

export const news: NewsPost[] = [
  {
    id: 1,
    date: "12 июля",
    tag: "raid",
    title: "Manaforge Omega: 7/9 M — восьмой в пуше",
    excerpt: "Закрыли седьмого босса на миф-сложности и вплотную подошли к восьмому. Пара вечеров — и пилим дальше.",
  },
  {
    id: 2,
    date: "5 июля",
    tag: "recruit",
    title: "Открыли слоты под melee и ranged DPS",
    excerpt: "Ищем пару крепких дамагеров в основной состав на добивание миф-прогресса. Резюме — в разделе набора.",
  },
  {
    id: 3,
    date: "28 июня",
    tag: "event",
    title: "Летний M+ марафон: гоняем ключи весь июль",
    excerpt: "Собираем пачки на вечерние ключи, тащим отстающих по рейтингу. Приз лучшей группе месяца — на усмотрение офицеров.",
  },
];

export const activePoll: Poll = {
  id: 1,
  question: "Во сколько ставим доп. рейд на следующей неделе?",
  status: "active",
  options: [
    { id: 1, label: "Вторник, 20:00", votes: 42 },
    { id: 2, label: "Четверг, 20:00", votes: 63 },
    { id: 3, label: "Воскресенье, 19:00", votes: 18 },
    { id: 4, label: "Доп. рейд не нужен", votes: 9 },
  ],
};

export const pollArchive: PollArchiveItem[] = [
  { id: 10, question: "Куда едем на альт-фан?", result: "Классика М+ · 61%" },
  { id: 11, question: "Оставляем 2 рейда в неделю?", result: "Да · 74%" },
];

export const links: GuildLink[] = [
  { id: 1, name: "Raider.IO", desc: "рейтинг и профиль", icon: "trophy", url: "#" },
  { id: 2, name: "Warcraft Logs", desc: "логи и пёрфы", icon: "bar-chart-3", url: "#" },
  { id: 3, name: "Discord", desc: "штаб гильдии", icon: "message-circle", url: "#" },
  { id: 4, name: "WoWProgress", desc: "рейтинг гильдии", icon: "external-link", url: "#" },
  { id: 5, name: "Twitch", desc: "стримы прогресса", icon: "monitor-play", url: "#" },
  { id: 6, name: "YouTube", desc: "килл-муви", icon: "clapperboard", url: "#" },
];

export const roles: RecruitRole[] = [
  { key: "melee", name: "Ближний бой", icon: "swords", open: true },
  { key: "ranged", name: "Дальний бой", icon: "crosshair", open: true },
  { key: "tank", name: "Танк", icon: "shield", open: false },
  { key: "heal", name: "Хил", icon: "heart-pulse", open: false },
];

export const requirements: Requirement[] = [
  { icon: "mic", text: "Микрофон и адекватность в войсе" },
  { icon: "trending-up", text: "Готовность к прогрессу и работе над ошибками" },
  { icon: "target", text: "IO 3400+ или релевантный опыт Heroic" },
  { icon: "calendar-check", text: "Посещаемость от 2 из 3 рейдов" },
];
