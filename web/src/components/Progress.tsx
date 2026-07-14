import { Target, Plug } from "lucide-react";
import { Icon } from "./Icon";
import type { RaidProgress, BossStatus } from "../lib/types";

function bossIcon(status: BossStatus): { name: string; cls: string } {
  if (status === "killed") return { name: "check", cls: "c-green" };
  if (status === "push") return { name: "swords", cls: "c-accent" };
  return { name: "skull", cls: "c-muted" };
}

function bossTextCls(status: BossStatus): string {
  if (status === "push") return "c-accent";
  if (status === "alive") return "c-muted";
  return "c-text";
}

export function Progress({ data }: { data: RaidProgress }) {
  return (
    <section id="progress" className="section section--alt">
      <div className="container">
        <div className="eyebrow">
          <span className="eyebrow__diamond" />
          <span className="eyebrow__label">Отчётность · KPI</span>
        </div>
        <div className="section-head">
          <h2 className="h2">Прогресс рейда</h2>
          <div className="mono" style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <span className="status-dot" />
            {data.updatedLabel} · {data.raidName}
          </div>
        </div>

        <div className="progress-grid">
          <div className="prog-card">
            <div className="diffs">
              {data.difficulties.map((d) => {
                const pct = Math.round((d.killed / d.total) * 100);
                const highlight = d.name === "Mythic" && pct < 100;
                return (
                  <div key={d.name}>
                    <div className="diff__head">
                      <span className="diff__name">{d.name}</span>
                      <span className="diff__count" style={highlight ? { color: "var(--accent)" } : undefined}>
                        {d.killed} / {d.total}
                      </span>
                    </div>
                    <div className="bar">
                      <div className={"bar__fill" + (highlight ? " bar__fill--glow" : "")} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="divider" style={{ margin: "26px 0" }} />
            <div className="mono-label" style={{ marginBottom: 14 }}>БОССЫ · MYTHIC</div>
            <div className="boss-grid">
              {data.bosses.map((b) => {
                const bi = bossIcon(b.status);
                return (
                  <div key={b.name} className={"boss" + (b.status === "push" ? " boss--push" : "")}>
                    <Icon name={bi.name} size={15} className={bi.cls} />
                    <span className={bossTextCls(b.status)}>{b.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="mplus-card">
              <div className="mplus-head">
                <Target size={14} className="c-accent" />
                Mythic+
              </div>
              <div className="mplus-row">
                <div>
                  <div className="mplus-num c-accent">{data.mplus.bestKey}</div>
                  <div className="mplus-cap">ЛУЧШИЙ КЛЮЧ</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mplus-num c-text">{data.mplus.rating}</div>
                  <div className="mplus-cap">РЕЙТИНГ ШТАТА</div>
                </div>
              </div>
              <div className="divider" style={{ margin: "0 0 16px" }} />
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                <span>Ключей за сезон</span>
                <span className="c-text">{data.mplus.keysThisSeason}</span>
              </div>
            </div>

            <div className="raidsmith-stub">
              <Plug size={20} className="c-muted" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>Виджет Raidsmith</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                  авто-подтяжка ростера, посещаемости и логов
                </div>
              </div>
              <span className="badge-soon">СКОРО</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
