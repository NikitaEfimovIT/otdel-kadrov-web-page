import type { GuildSettings } from "../lib/types";

export function About({ guild }: { guild: GuildSettings }) {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div>
          <div className="eyebrow">
            <span className="eyebrow__diamond" />
            <span className="eyebrow__label">О гильдии</span>
          </div>
          <h2 className="h2" style={{ marginBottom: 22 }}>
            Полу-хардкор
            <br />с человеческим лицом
          </h2>
          <p className="lead" style={{ marginBottom: 16 }}>{guild.aboutText1}</p>
          <p className="lead" style={{ marginBottom: 28 }}>{guild.aboutText2}</p>
          <div className="chips">
            {guild.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="stat-grid">
          {guild.stats.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat__num" style={{ color: s.accent ? "var(--accent)" : "var(--text)" }}>
                {s.value}
              </div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
