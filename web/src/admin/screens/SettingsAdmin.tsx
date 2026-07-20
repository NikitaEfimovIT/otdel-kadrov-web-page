import { useEffect, useState } from "react";
import { PlugZap, Save } from "lucide-react";
import { adminApi } from "../adminApi";

interface Form {
  name: string;
  region: string;
  faction: string;
  slogan: string;
  recruitingOpen: boolean;
  showRaidsmith: boolean;
}
const EMPTY: Form = {
  name: "Отдел кадров", region: "EU · Борейская Тундра", faction: "Альянс",
  slogan: "", recruitingOpen: true, showRaidsmith: false,
};

export function SettingsAdmin() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);

  useEffect(() => {
    adminApi.one("guild-setting").then((g) => {
      if (g) {
        setForm({
          name: String(g.name ?? EMPTY.name), region: String(g.region ?? EMPTY.region),
          faction: String(g.faction ?? EMPTY.faction), slogan: String(g.slogan ?? ""),
          recruitingOpen: Boolean(g.recruitingOpen), showRaidsmith: Boolean(g.showRaidsmith),
        });
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setFlash(null);
    const ok = await adminApi.saveSingle("guild-setting", { ...form });
    setSaving(false);
    setFlash(ok ? "ok" : "err");
  };

  return (
    <div>
      <div className="adm-kicker">Гильдия</div>
      <h1 className="adm-h1" style={{ marginBottom: 28 }}>Настройки</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <LabeledInput label="НАЗВАНИЕ ГИЛЬДИИ" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <LabeledInput label="РЕГИОН / СЕРВЕР" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
        <LabeledInput label="ФРАКЦИЯ" value={form.faction} onChange={(v) => setForm({ ...form, faction: v })} />
        <LabeledInput label="СЛОГАН" value={form.slogan} onChange={(v) => setForm({ ...form, slogan: v })} />
      </div>

      <div style={{ display: "flex", gap: 28, marginBottom: 20, flexWrap: "wrap" }}>
        <ToggleRow label="Набор открыт" on={form.recruitingOpen} onToggle={() => setForm({ ...form, recruitingOpen: !form.recruitingOpen })} />
        <ToggleRow label="Кнопка «Войти через Raidsmith»" on={form.showRaidsmith} onToggle={() => setForm({ ...form, showRaidsmith: !form.showRaidsmith })} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={16} />{saving ? "Сохраняю…" : "Сохранить настройки"}</button>
        {flash === "ok" && <span className="adm-flash adm-flash--ok">Сохранено</span>}
        {flash === "err" && <span className="adm-flash adm-flash--err">Ошибка сохранения</span>}
      </div>

      <div style={{ padding: 24, border: "1px solid var(--line)", borderRadius: 16, background: "linear-gradient(160deg,var(--surface),var(--surface2))", display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}><PlugZap size={24} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Интеграция с Raidsmith</div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 3 }}>Авто-подтяжка ростера, прогресса, посещаемости и логов. Прогресс и штат перестанут требовать ручного ввода.</div>
        </div>
        <button disabled style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 11, border: "1px solid var(--line2)", background: "transparent", color: "var(--muted)", fontWeight: 600, fontSize: 14, cursor: "not-allowed", opacity: 0.7 }}>
          Подключить
          <span className="mono" style={{ fontSize: 9, letterSpacing: 1, padding: "2px 6px", borderRadius: 5, background: "var(--line2)" }}>СКОРО</span>
        </button>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      <input className="adm-input adm-input--sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button type="button" className={"toggle" + (on ? " on" : "")} onClick={onToggle}><span className="toggle__knob" /></button>
    </div>
  );
}
