import { ArrowUpRight } from "lucide-react";
import { Icon } from "./Icon";
import type { GuildLink } from "../lib/types";

export function Links({ links }: { links: GuildLink[] }) {
  return (
    <section id="links" className="section">
      <div className="container">
        <div className="eyebrow">
          <span className="eyebrow__diamond" />
          <span className="eyebrow__label">Всё под рукой</span>
        </div>
        <h2 className="h2" style={{ marginBottom: 36 }}>Ссылки</h2>
        <div className="grid-3">
          {links.map((l) => {
            const external = l.url.startsWith("http");
            return (
              <a
                key={l.id}
                href={l.url}
                className="link-tile hover-accent"
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <div className="link-tile__icon">
                  <Icon name={l.icon} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="link-tile__name">{l.name}</div>
                  <div className="link-tile__desc">{l.desc}</div>
                </div>
                <ArrowUpRight size={18} className="c-muted" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
