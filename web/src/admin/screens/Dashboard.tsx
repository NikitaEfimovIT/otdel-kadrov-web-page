import { type ReactNode, useEffect, useState } from "react";
import { FileEdit, ScrollText, CalendarClock, Inbox, Plus, Users } from "lucide-react";
import { adminApi } from "../adminApi";
import type { AdminView } from "../Sidebar";

interface Stats {
  drafts: number;
  published: number;
  pollVotes: number;
  newApps: number;
}

export function Dashboard({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [stats, setStats] = useState<Stats>({ drafts: 0, published: 0, pollVotes: 0, newApps: 0 });
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [news, apps, polls] = await Promise.all([
        adminApi.list("news-items?sort=date:desc"),
        adminApi.list("applications"),
        adminApi.list("polls?filters[state][$eq]=active&populate=options"),
      ]);
      const drafts = news.filter((n) => !n.published).length;
      const published = news.filter((n) => n.published).length;
      const newApps = apps.filter((a) => a.stage === "new").length;
      const activePoll = polls[0];
      const opts = activePoll && Array.isArray(activePoll.options)
        ? (activePoll.options as Record<string, unknown>[])
        : [];
      const pollVotes = opts.reduce((s, o) => s + Number(o.votes ?? 0), 0);
      setStats({ drafts, published, pollVotes, newApps });
      setRecent(news.slice(0, 3).map((n) => String(n.title ?? "")));
    })();
  }, []);

  const today = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div>
      <div className="adm-kicker">Кабинет офицера</div>
      <h1 className="adm-h1">Обзор</h1>
      <p className="adm-sub">{today} · что происходит в гильдии</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 16 }}>
        <StatCard icon={<FileEdit size={13} />} label="ЧЕРНОВИКИ" value={stats.drafts} />
        <StatCard icon={<ScrollText size={13} />} label="ОПУБЛИКОВАНО" value={stats.published} />
        <StatCard icon={<CalendarClock size={13} />} label="ГОЛОСОВ В ОПРОСЕ" value={stats.pollVotes} accentNum />
        <StatCard icon={<Inbox size={13} />} label="НОВЫЕ ЗАЯВКИ" value={stats.newApps} accent />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <div className="adm-card">
          <div className="adm-label">Последние новости</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recent.length === 0 && <div style={{ color: "var(--muted)", fontSize: 14 }}>Пока пусто.</div>}
            {recent.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0", borderBottom: i < recent.length - 1 ? "1px solid var(--line2)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                  <ScrollText size={16} />
                </div>
                <div style={{ fontSize: 14 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-label">Быстрые действия</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary" onClick={() => onNavigate("news")}><Plus size={17} />Создать новость</button>
            <button className="btn btn-ghost" onClick={() => onNavigate("polls")}><CalendarClock size={17} />Создать опрос</button>
            <button className="btn btn-ghost" onClick={() => onNavigate("recruit")}><Users size={17} />Роли в наборе</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, accentNum }: {
  icon: ReactNode;
  label: string;
  value: number;
  accent?: boolean;
  accentNum?: boolean;
}) {
  return (
    <div className={"adm-stat" + (accent ? " adm-stat--accent" : "")}>
      <div className="adm-stat__label" style={accent ? { color: "var(--accent)" } : undefined}>
        {icon}
        {label}
      </div>
      <div className="adm-stat__num" style={accent || accentNum ? { color: "var(--accent)" } : undefined}>{value}</div>
    </div>
  );
}
