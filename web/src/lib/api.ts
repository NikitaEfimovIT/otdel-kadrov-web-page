// Слой данных. По умолчанию (VITE_API_URL пуст) отдаёт мок-данные,
// поэтому сайт запускается без бэкенда. Когда указан адрес Strapi —
// тянет реальные данные, а на пустой/ошибочный ответ мягко падает
// на дефолты, чтобы страница не ломалась.

import * as mock from "./mock";
import type {
  GuildSettings, RaidProgress, NewsPost, Poll, PollArchiveItem,
  GuildLink, RecruitRole, Requirement, PollOption, Difficulty, Boss, BossStatus, RoleKey,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;

/** Обёртка над Strapi REST. Возвращает null → компонент берёт дефолт. */
async function fromApi<T>(endpoint: string, map: (json: unknown) => T): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/${endpoint}`);
    if (!res.ok) return null;
    return map(await res.json());
  } catch {
    return null;
  }
}

/** Ответ Strapi для коллекции: { data: [...] } с полями на верхнем уровне (v5). */
function rows(json: unknown): Record<string, unknown>[] {
  const data = (json as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

/** Ответ Strapi для single type: { data: {...} } или { data: null }. */
function single(json: unknown): Record<string, unknown> | null {
  const d = (json as { data?: unknown })?.data;
  return d && typeof d === "object" && !Array.isArray(d) ? (d as Record<string, unknown>) : null;
}

const str = (v: unknown, fb: string) => (typeof v === "string" && v.length > 0 ? v : fb);
const bool = (v: unknown, fb: boolean) => (typeof v === "boolean" ? v : fb);

const ROLE_ICON: Record<string, string> = {
  melee: "swords", ranged: "crosshair", tank: "shield", heal: "heart-pulse",
};

export async function getGuild(): Promise<GuildSettings> {
  const g = await fromApi("guild-setting", single);
  if (!g) return mock.guild;

  const ms = mock.guild.stats; // [основаны, рейдов/нед, расписание, штат]
  const raidDays = str(g.raidDays, ms[2].value);
  const raidTime = str(g.raidTime, ms[2].label);
  const rosterSize = str(g.rosterSize, ms[3].value);
  const rosterFilled = str(g.rosterFilled, "24");
  const online = str(g.onlineCount, "6");

  const chipsStr = typeof g.chips === "string" ? g.chips : "";
  const chips = chipsStr.trim()
    ? chipsStr.split(",").map((c) => c.trim()).filter(Boolean)
    : mock.guild.chips;

  return {
    ...mock.guild,
    name: str(g.name, mock.guild.name),
    region: str(g.region, mock.guild.region),
    faction: str(g.faction, mock.guild.faction),
    slogan: str(g.slogan, mock.guild.slogan),
    recruitingOpen: bool(g.recruitingOpen, mock.guild.recruitingOpen),
    showRaidsmith: bool(g.showRaidsmith, mock.guild.showRaidsmith),
    aboutText1: str(g.aboutText1, mock.guild.aboutText1),
    aboutText2: str(g.aboutText2, mock.guild.aboutText2),
    chips,
    stats: [
      { value: str(g.foundedYear, ms[0].value), label: "ОСНОВАНЫ", accent: true },
      { value: str(g.raidsPerWeek, ms[1].value), label: "РЕЙДА В НЕДЕЛЮ", accent: true },
      { value: raidDays, label: raidTime },
      { value: rosterSize, label: "ЧЕЛОВЕК В ШТАТЕ" },
    ],
    hero: {
      ...mock.guild.hero,
      staff: { value: `${rosterFilled}/${rosterSize}`, sub: `${online} онлайн` },
    },
  };
}

export async function getRaidProgress(): Promise<RaidProgress> {
  // Текущий рейд (current=true) вместе с боссами (relation Raid 1—* Boss).
  const raid = await fromApi(
    "raids?filters[current][$eq]=true&populate=bosses",
    (json) => rows(json)[0] ?? null,
  );
  if (!raid) return mock.raidProgress;

  const bossesRaw = Array.isArray(raid.bosses) ? (raid.bosses as Record<string, unknown>[]) : [];
  const bosses: Boss[] = [...bossesRaw]
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((b) => ({ name: String(b.name ?? ""), status: (b.state as BossStatus) || "alive" }));

  const diff = (name: string, killed: unknown, total: unknown): Difficulty => ({
    name,
    killed: Number(killed ?? 0),
    total: Number(total ?? 0),
  });

  return {
    raidName: str(raid.name, mock.raidProgress.raidName),
    updatedLabel: str(raid.updatedLabel, mock.raidProgress.updatedLabel),
    difficulties: [
      diff("Normal", raid.normalKilled, raid.normalTotal),
      diff("Heroic", raid.heroicKilled, raid.heroicTotal),
      diff("Mythic", raid.mythicKilled, raid.mythicTotal),
    ],
    bosses: bosses.length > 0 ? bosses : mock.raidProgress.bosses,
    mplus: {
      bestKey: str(raid.mplusBestKey, mock.raidProgress.mplus.bestKey),
      rating: str(raid.mplusRating, mock.raidProgress.mplus.rating),
      keysThisSeason: str(raid.mplusKeysThisSeason, mock.raidProgress.mplus.keysThisSeason),
    },
  };
}

export async function getNews(): Promise<NewsPost[]> {
  const mapped = await fromApi("news-items?filters[published][$eq]=true&sort=date:desc", (json) =>
    rows(json).map((d) => ({
      id: Number(d.id),
      title: String(d.title ?? ""),
      excerpt: String(d.excerpt ?? ""),
      tag: d.tag as NewsPost["tag"],
      date: String(d.date ?? ""),
    })),
  );
  return mapped && mapped.length > 0 ? mapped : mock.news;
}

export async function getActivePoll(): Promise<Poll> {
  const mapped = await fromApi("polls?filters[state][$eq]=active&populate=options", (json) => {
    const first = rows(json)[0];
    if (!first) return null;
    const options = Array.isArray(first.options)
      ? (first.options as Record<string, unknown>[]).map<PollOption>((o) => ({
          id: Number(o.id),
          label: String(o.text ?? ""),
          votes: Number(o.votes ?? 0),
        }))
      : [];
    return { id: Number(first.id), question: String(first.question ?? ""), status: "active", options } as Poll;
  });
  return mapped ?? mock.activePoll;
}

export async function getPollArchive(): Promise<PollArchiveItem[]> {
  const mapped = await fromApi("polls?filters[state][$eq]=closed&populate=options&sort=updatedAt:desc", (json) =>
    rows(json).map<PollArchiveItem>((p) => {
      const opts = Array.isArray(p.options) ? (p.options as Record<string, unknown>[]) : [];
      const total = opts.reduce((a, o) => a + Number(o.votes ?? 0), 0);
      const top = [...opts].sort((a, b) => Number(b.votes ?? 0) - Number(a.votes ?? 0))[0];
      const pct = top && total > 0 ? Math.round((Number(top.votes ?? 0) / total) * 100) : 0;
      return {
        id: Number(p.id),
        question: String(p.question ?? ""),
        result: top ? `${String(top.text ?? "")} · ${pct}%` : "—",
      };
    }),
  );
  return mapped ?? mock.pollArchive;
}

export async function getLinks(): Promise<GuildLink[]> {
  const mapped = await fromApi("links?filters[visible][$eq]=true&sort=order:asc", (json) =>
    rows(json).map((d) => ({
      id: Number(d.id),
      name: String(d.name ?? ""),
      desc: String(d.desc ?? ""),
      icon: String(d.icon ?? "external-link"),
      url: String(d.url ?? "#"),
    })),
  );
  return mapped && mapped.length > 0 ? mapped : mock.links;
}

export async function getRoles(): Promise<RecruitRole[]> {
  const mapped = await fromApi("recruit-roles?sort=key:asc", (json) =>
    rows(json).map<RecruitRole>((d) => {
      const key = String(d.key ?? "") as RoleKey;
      return {
        key,
        name: String(d.name ?? ""),
        icon: String(d.icon || ROLE_ICON[key] || "swords"),
        open: Boolean(d.open),
      };
    }),
  );
  return mapped && mapped.length > 0 ? mapped : mock.roles;
}

export async function getRequirements(): Promise<Requirement[]> {
  // Отдельного типа в Strapi нет — статический контент.
  // При желании позже заведём тип/поле и подключим сюда.
  return mock.requirements;
}

/** Отправка заявки на вступление. В проде — POST в Strapi. */
export async function submitApplication(payload: {
  battletag: string;
  wowClass: string;
  logsUrl?: string;
  comment?: string;
}): Promise<boolean> {
  if (!API_URL) return true; // без бэкенда просто показываем успех
  try {
    const res = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
