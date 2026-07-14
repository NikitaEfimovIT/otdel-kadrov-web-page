import { MessageCircle, MonitorPlay, Clapperboard, Zap } from "lucide-react";
import type { GuildSettings } from "../lib/types";

export function Footer({ guild }: { guild: GuildSettings }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__about">
            <div className="brand" style={{ marginBottom: 14 }}>
              <div className="brand__logo" style={{ boxShadow: "none" }}>ОК</div>
              <span className="brand__name" style={{ fontSize: 18 }}>{guild.name}</span>
            </div>
            <p className="lead" style={{ fontSize: 14, lineHeight: 1.6 }}>
              {guild.region} · {guild.faction}. Полу-хардкор с человеческим лицом.
            </p>
          </div>
          <div className="footer__cols">
            <div className="footer__col">
              <span className="footer__col-label">РАЗДЕЛЫ</span>
              <a href="#progress">Прогресс</a>
              <a href="#news">Новости</a>
              <a href="#recruit">Набор</a>
            </div>
            <div className="footer__col">
              <span className="footer__col-label">КОНТАКТ</span>
              <div className="social">
                <a href="#links" aria-label="Discord"><MessageCircle size={18} /></a>
                <a href="#links" aria-label="Twitch"><MonitorPlay size={18} /></a>
                <a href="#links" aria-label="YouTube"><Clapperboard size={18} /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>© 2026 {guild.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>Скоро: интеграция с Raidsmith</span>
            <span className="powered">
              <Zap size={12} className="c-accent" />
              Powered by Raidsmith
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
