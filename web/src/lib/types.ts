// Типы данных сайта. Держим их в соответствии с content-types Strapi
// (см. /cms/schemas/*.json), чтобы при переходе mock → API ничего не ломалось.

export type NewsTag = "raid" | "recruit" | "event" | "announcement";

/** Латинские ключи в БД (enum Strapi должен быть ASCII) → русские подписи в UI. */
export const TAG_LABELS: Record<NewsTag, string> = {
  raid: "Рейд",
  recruit: "Набор",
  event: "Ивент",
  announcement: "Объявление",
};

export interface NewsPost {
  id: number;
  title: string;
  excerpt: string;
  body?: string;
  tag: NewsTag;
  date: string; // отображаемая дата, напр. "12 июля"
}

export interface PollOption {
  id: number;
  label: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  status: "active" | "closed";
  options: PollOption[];
}

export interface PollArchiveItem {
  id: number;
  question: string;
  result: string; // напр. "Да · 74%"
}

/** Имя иконки lucide (kebab-case), напр. "trophy", "bar-chart-3". */
export type IconName = string;

export interface GuildLink {
  id: number;
  name: string;
  desc: string;
  icon: IconName;
  url: string;
}

export type RoleKey = "melee" | "ranged" | "tank" | "heal";

export interface RecruitRole {
  key: RoleKey;
  name: string;
  icon: IconName;
  open: boolean;
}

export interface Requirement {
  icon: IconName;
  text: string;
}

export type BossStatus = "killed" | "push" | "alive";

export interface Boss {
  name: string;
  status: BossStatus;
}

export interface Difficulty {
  name: string;
  killed: number;
  total: number;
}

export interface RaidProgress {
  raidName: string;
  updatedLabel: string;
  difficulties: Difficulty[];
  bosses: Boss[];
  mplus: { bestKey: string; rating: string; keysThisSeason: string };
}

export interface GuildStat {
  value: string;
  label: string;
  accent?: boolean;
}

export interface HeroTile {
  value: string;
  sub: string;
}

export interface GuildSettings {
  name: string;
  region: string; // "EU · Борейская Тундра"
  faction: string; // "Альянс"
  slogan: string;
  recruitingOpen: boolean;
  showRaidsmith: boolean;
  aboutText1: string;
  aboutText2: string;
  chips: string[];
  stats: GuildStat[];
  hero: {
    currentRaid: HeroTile & { pct: number };
    mplus: HeroTile;
    staff: HeroTile;
    recruit: HeroTile;
  };
}

export const WOW_CLASSES = [
  "Воин", "Паладин", "Охотник", "Разбойник", "Жрец", "Шаман", "Маг",
  "Чернокнижник", "Друид", "Монах", "Рыцарь смерти", "Охотник на демонов", "Эвокер",
] as const;
