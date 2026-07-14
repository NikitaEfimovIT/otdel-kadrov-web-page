import { Send, BarChart3, ArrowUpRight } from "lucide-react";
import type { GuildSettings } from "../lib/types";

export function Hero({ guild }: { guild: GuildSettings }) {
  const h = guild.hero;
  return (
    <section id="hero" className="hero">
      <div className="hero__dots" />
      <div className="hero__bloom" />
      <div className="hero__inner">
        <div className="hero__badges">
          {guild.recruitingOpen ? (
            <div className="status-pill">
              <span className="status-dot" />
              Набор открыт
            </div>
          ) : (
            <div className="status-pill status-pill--off">
              <span className="status-dot status-dot--off" />
              Набор на паузе
            </div>
          )}
          <span className="loc">
            {guild.region} · {guild.faction}
          </span>
        </div>

        <h1 className="hero__title">{guild.name}</h1>
        <p className="hero__slogan">{guild.slogan}</p>

        <div className="hero__cta">
          <a href="#recruit" className="btn btn-primary">
            <Send size={18} />
            Отправить резюме
          </a>
          <a href="#links" className="btn btn-ghost">
            <BarChart3 size={18} />
            Наши логи
          </a>
        </div>

        <div className="bento">
          <div className="bento__tile">
            <div className="bento__label">ТЕКУЩИЙ РЕЙД</div>
            <div className="bento__num c-accent">{h.currentRaid.value}</div>
            <div className="bento__sub">{h.currentRaid.sub}</div>
            <div className="mini-bar">
              <div className="mini-bar__fill" style={{ width: `${h.currentRaid.pct}%` }} />
            </div>
          </div>
          <div className="bento__tile">
            <div className="bento__label">MYTHIC+</div>
            <div className="bento__num c-accent">{h.mplus.value}</div>
            <div className="bento__sub">{h.mplus.sub}</div>
          </div>
          <div className="bento__tile">
            <div className="bento__label">ШТАТ</div>
            <div className="bento__num c-text">{h.staff.value}</div>
            <div className="bento__sub">
              <span className="status-dot" style={{ width: 6, height: 6, boxShadow: "none" }} />
              {h.staff.sub}
            </div>
          </div>
          <a href="#recruit" className="bento__tile bento__tile--accent hover-accent">
            <div className="bento__label c-accent">НАБОР</div>
            <div className="bento__num c-accent">
              {h.recruit.value}
              <ArrowUpRight size={24} />
            </div>
            <div className="bento__sub">{h.recruit.sub}</div>
          </a>
        </div>
      </div>
    </section>
  );
}
