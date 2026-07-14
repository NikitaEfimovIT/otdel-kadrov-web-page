import { Send } from "lucide-react";
import type { GuildSettings } from "../lib/types";

const NAV = [
  { href: "#about", label: "О гильдии" },
  { href: "#progress", label: "Прогресс" },
  { href: "#news", label: "Новости" },
  { href: "#polls", label: "Опросы" },
  { href: "#links", label: "Ссылки" },
  { href: "#recruit", label: "Набор" },
];

export function Header({ guild, active }: { guild: GuildSettings; active: string }) {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="#hero" className="brand">
          <div className="brand__logo">ОК</div>
          <span className="brand__name">{guild.name}</span>
        </a>
        <div className="header__right">
          <nav className="nav">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={active === n.href.slice(1) ? "active" : ""}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="header__cta-group">
            {guild.showRaidsmith && (
              <div className="raidsmith-btn">
                Войти через Raidsmith
                <span className="badge-mini">СКОРО</span>
              </div>
            )}
            <a href="#recruit" className="btn btn-primary btn--sm">
              <Send size={15} />
              Отправить резюме
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
