// Слой данных. По умолчанию (VITE_API_URL пуст) отдаёт мок-данные,
// поэтому сайт запускается без бэкенда. Как только укажешь адрес Strapi,
// эти функции начнут тянуть реальные данные — компоненты менять не нужно.

import * as mock from "./mock";
import type {
  GuildSettings, RaidProgress, NewsPost, Poll, PollArchiveItem,
  GuildLink, RecruitRole, Requirement, PollOption,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL;

/** Обёртка над Strapi REST. Возвращает null → компонент берёт мок-данные. */
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

// Утилита: у Strapi v5 ответ обычно вида { data: [...] } с полями на верхнем уровне.
function rows(json: unknown): Record<string, unknown>[] {
  const data = (json as { data?: unknown })?.data;
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function getGuild(): Promise<GuildSettings> {
  // Настройки гильдии — single type; для v1 отдаём мок целиком.
  return mock.guild;
}

export async function getRaidProgress(): Promise<RaidProgress> {
  return mock.raidProgress;
}

export async function getNews(): Promise<NewsPost[]> {
  // В Strapi 5 REST по умолчанию отдаёт только опубликованные записи — фильтр по статусу не нужен.
  const mapped = await fromApi("news-items?sort=date:desc", (json) =>
    rows(json).map((d) => ({
      id: Number(d.id),
      title: String(d.title ?? ""),
      excerpt: String(d.excerpt ?? ""),
      tag: d.tag as NewsPost["tag"],
      date: String(d.date ?? ""),
    })),
  );
  return mapped ?? mock.news;
}

export async function getActivePoll(): Promise<Poll> {
  const mapped = await fromApi("polls?filters[state][$eq]=active&populate=options", (json) => {
    const first = rows(json)[0];
    if (!first) return null;
    const options = Array.isArray(first.options)
      ? (first.options as Record<string, unknown>[]).map<PollOption>((o) => ({
          id: Number(o.id),
          label: String(o.text ?? o.label ?? ""),
          votes: Number(o.votes ?? 0),
        }))
      : [];
    return { id: Number(first.id), question: String(first.question ?? ""), status: "active", options } as Poll;
  });
  return mapped ?? mock.activePoll;
}

export async function getPollArchive(): Promise<PollArchiveItem[]> {
  return mock.pollArchive;
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
  return mapped ?? mock.links;
}

export async function getRoles(): Promise<RecruitRole[]> {
  return mock.roles;
}

export async function getRequirements(): Promise<Requirement[]> {
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
