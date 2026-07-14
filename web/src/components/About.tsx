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
          <p className="lead" style={{ marginBottom: 16 }}>
            Берём кромку в рейдах — уверенный Heroic и заход в Mythic, — и закрываем высокие ключи
            M+. Без токсичности, пафоса и элитарного гейткипинга.
          </p>
          <p className="lead" style={{ marginBottom: 28 }}>
            Здесь умеют играть, но с людьми комфортно. Приходишь ради прогресса — остаёшься ради
            компании.
          </p>
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
