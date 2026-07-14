import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Progress } from "./components/Progress";
import { News } from "./components/News";
import { Polls } from "./components/Polls";
import { Links } from "./components/Links";
import { Recruit } from "./components/Recruit";
import { Footer } from "./components/Footer";
import { useScrollSpy } from "./hooks/useScrollSpy";
import {
  getGuild, getRaidProgress, getNews, getActivePoll, getPollArchive,
  getLinks, getRoles, getRequirements,
} from "./lib/api";
import type {
  GuildSettings, RaidProgress, NewsPost, Poll, PollArchiveItem,
  GuildLink, RecruitRole, Requirement,
} from "./lib/types";

const SECTION_IDS = ["hero", "about", "progress", "news", "polls", "links", "recruit"];

interface SiteData {
  guild: GuildSettings;
  raidProgress: RaidProgress;
  news: NewsPost[];
  poll: Poll;
  archive: PollArchiveItem[];
  links: GuildLink[];
  roles: RecruitRole[];
  requirements: Requirement[];
}

async function loadAll(): Promise<SiteData> {
  const [guild, raidProgress, news, poll, archive, links, roles, requirements] = await Promise.all([
    getGuild(), getRaidProgress(), getNews(), getActivePoll(),
    getPollArchive(), getLinks(), getRoles(), getRequirements(),
  ]);
  // hero-плитки «текущий рейд» и «Mythic+» берём из живого прогресса,
  // чтобы они совпадали с секцией «Прогресс», а не висели статикой.
  guild.hero = deriveHero(guild, raidProgress);
  return { guild, raidProgress, news, poll, archive, links, roles, requirements };
}

function deriveHero(guild: GuildSettings, rp: RaidProgress): GuildSettings["hero"] {
  const mythic =
    rp.difficulties.find((d) => d.name.toLowerCase() === "mythic") ??
    rp.difficulties[rp.difficulties.length - 1];
  const pct =
    mythic && mythic.total > 0
      ? Math.round((mythic.killed / mythic.total) * 100)
      : guild.hero.currentRaid.pct;
  return {
    currentRaid: {
      value: mythic ? `${mythic.killed}/${mythic.total}` : guild.hero.currentRaid.value,
      sub: `Mythic · ${rp.raidName}`,
      pct,
    },
    mplus: { value: rp.mplus.rating, sub: `RIO · лучший ${rp.mplus.bestKey}` },
    staff: guild.hero.staff,
    recruit: { value: guild.recruitingOpen ? "Открыт" : "Пауза", sub: guild.hero.recruit.sub },
  };
}

export default function App() {
  const [data, setData] = useState<SiteData | null>(null);
  const active = useScrollSpy(SECTION_IDS, data !== null);

  useEffect(() => {
    loadAll().then(setData);
  }, []);

  if (!data) return null;

  return (
    <>
      <Header guild={data.guild} active={active} />
      <main>
        <Hero guild={data.guild} />
        <About guild={data.guild} />
        <Progress data={data.raidProgress} />
        <News posts={data.news} />
        <Polls poll={data.poll} archive={data.archive} />
        <Links links={data.links} />
        <Recruit roles={data.roles} requirements={data.requirements} />
      </main>
      <Footer guild={data.guild} />
    </>
  );
}
