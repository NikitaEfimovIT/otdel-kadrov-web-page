import { useEffect, useState } from "react";
import { Check, Eye, X, ExternalLink } from "lucide-react";
import { Icon } from "../../components/Icon";
import { adminApi, type StrapiItem } from "../adminApi";

const ROLE_ICON: Record<string, string> = { melee: "swords", ranged: "crosshair", tank: "shield", heal: "heart-pulse" };
const STAGE: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Новая", color: "var(--accent)", bg: "var(--soft)" },
  reviewing: { label: "Смотрим", color: "var(--green)", bg: "rgba(71,209,71,.12)" },
  accepted: { label: "Принят", color: "var(--green)", bg: "rgba(71,209,71,.12)" },
  rejected: { label: "Отказ", color: "var(--red)", bg: "rgba(255,107,107,.12)" },
};

export function RecruitAdmin({ onChanged }: { onChanged: () => void }) {
  const [roles, setRoles] = useState<StrapiItem[]>([]);
  const [apps, setApps] = useState<StrapiItem[]>([]);

  const load = async () => {
    const [r, a] = await Promise.all([
      adminApi.list("recruit-roles?sort=key:asc"),
      adminApi.list("applications?sort=createdAt:desc"),
    ]);
    setRoles(r);
    setApps(a);
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (r: StrapiItem) => {
    if (await adminApi.update("recruit-roles", r.documentId, { open: !r.open })) load();
  };
  const setStage = async (a: StrapiItem, stage: string) => {
    if (await adminApi.update("applications", a.documentId, { stage })) {
      await load();
      onChanged();
    }
  };

  return (
    <div>
      <div className="adm-kicker">Набор</div>
      <h1 className="adm-h1" style={{ marginBottom: 28 }}>Вакансии и заявки</h1>

      <div className="adm-label">Роли · нажми, чтобы открыть/закрыть</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 34 }}>
        {roles.length === 0 && <div style={{ color: "var(--muted)", fontSize: 14 }}>Ролей пока нет.</div>}
        {roles.map((r) => {
          const open = Boolean(r.open);
          const icon = String(r.icon || ROLE_ICON[String(r.key)] || "swords");
          return (
            <button
              key={r.documentId}
              onClick={() => toggleRole(r)}
              style={{ padding: 18, border: `1px solid ${open ? "var(--line)" : "var(--line2)"}`, borderRadius: 14, background: open ? "var(--soft)" : "var(--bg)", display: "flex", alignItems: "center", gap: 13, cursor: "pointer", textAlign: "left" }}
            >
              <Icon name={icon} size={22} style={{ color: open ? "var(--accent)" : "var(--muted)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{String(r.name ?? "")}</div>
                <div className="mono" style={{ fontSize: 11, color: open ? "var(--accent)" : "var(--muted)", marginTop: 3 }}>{open ? "Нужен" : "Закрыт"}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="adm-label">Заявки</div>
      <div className="adm-table">
        <div className="adm-thead" style={{ gridTemplateColumns: "1fr 1fr 80px 110px 130px" }}>
          <span>BattleTag</span><span>Класс / спек</span><span>Логи</span><span>Статус</span><span style={{ textAlign: "right" }}>Решение</span>
        </div>
        {apps.length === 0 && <div style={{ padding: 22, color: "var(--muted)", fontSize: 14 }}>Заявок пока нет.</div>}
        {apps.map((a) => {
          const st = STAGE[String(a.stage ?? "new")] ?? STAGE.new;
          const cls = [a.wowClass, a.spec].filter(Boolean).join(" · ");
          const logs = String(a.logsUrl ?? "");
          return (
            <div key={a.documentId} className="adm-trow" style={{ gridTemplateColumns: "1fr 1fr 80px 110px 130px" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{String(a.battletag ?? "")}</span>
              <span style={{ fontSize: 13.5, color: "var(--muted)" }}>{cls || "—"}</span>
              <span>
                {logs
                  ? <a href={logs.startsWith("http") ? logs : `https://${logs}`} target="_blank" rel="noreferrer" className="link-lite"><ExternalLink size={15} /></a>
                  : <span style={{ color: "var(--muted)" }}>—</span>}
              </span>
              <span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: st.bg, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: st.color }}>{st.label}</span>
              </span>
              <span style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
                <button className="icon-btn icon-btn--green" style={{ width: 32, height: 32 }} title="Принять" onClick={() => setStage(a, "accepted")}><Check size={15} /></button>
                <button className="icon-btn" style={{ width: 32, height: 32 }} title="Смотрим" onClick={() => setStage(a, "reviewing")}><Eye size={15} /></button>
                <button className="icon-btn icon-btn--red" style={{ width: 32, height: 32 }} title="Отказ" onClick={() => setStage(a, "rejected")}><X size={15} /></button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
