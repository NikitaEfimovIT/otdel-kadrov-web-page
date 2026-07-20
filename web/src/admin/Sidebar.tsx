import {
  LayoutDashboard, ScrollText, CalendarClock, Users, Link as LinkIcon, Settings, LogOut,
  type LucideIcon,
} from "lucide-react";
import type { OfficerUser } from "./auth";

export type AdminView = "dashboard" | "news" | "polls" | "recruit" | "links" | "settings";

const NAV: { view: AdminView; label: string; icon: LucideIcon }[] = [
  { view: "dashboard", label: "Обзор", icon: LayoutDashboard },
  { view: "news", label: "Новости", icon: ScrollText },
  { view: "polls", label: "Опросы", icon: CalendarClock },
  { view: "recruit", label: "Набор", icon: Users },
  { view: "links", label: "Ссылки", icon: LinkIcon },
  { view: "settings", label: "Настройки", icon: Settings },
];

export function Sidebar({
  view, onNavigate, user, onLogout, newApps,
}: {
  view: AdminView;
  onNavigate: (v: AdminView) => void;
  user: OfficerUser | null;
  onLogout: () => void;
  newApps: number;
}) {
  const initial = (user?.username ?? "О").slice(0, 1).toUpperCase();
  return (
    <aside className="sb">
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px 22px", borderBottom: "1px solid var(--line2)", marginBottom: 18 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(150deg,var(--accent2),var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "var(--ink)", boxShadow: "0 4px 14px var(--glow)" }}>ОК</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-.02em", lineHeight: 1.1 }}>Отдел кадров</div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: 1, color: "var(--muted)", marginTop: 2 }}>КАБИНЕТ ОФИЦЕРА</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((n) => {
          const Icon = n.icon;
          return (
            <button key={n.view} className={"sb-btn" + (view === n.view ? " active" : "")} onClick={() => onNavigate(n.view)}>
              <Icon size={18} />
              {n.label}
              {n.view === "recruit" && newApps > 0 && <span className="sb-badge sb-badge--accent">{newApps} нов.</span>}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--line2)", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(150deg,#5865F2,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.username ?? "Офицер"}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>офицер</div>
        </div>
        <button className="icon-btn" title="Выйти" onClick={onLogout} style={{ width: 34, height: 34 }}><LogOut size={16} /></button>
      </div>
    </aside>
  );
}
