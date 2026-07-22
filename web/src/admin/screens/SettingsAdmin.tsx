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
  foundedYear: string;
  raidsPerWeek: string;
  raidDays: string;
  raidTime: string;
  rosterSize: string;
  rosterFilled: string;
  onlineCount: string;
  chips: string;
  aboutText1: string;
  aboutText2: string;
}

const EMPTY: Form = {
  name: "Отдел кадров", region: "EU · Борейская Тундра", faction: "Альянс", slogan: "",
  recruitingOpen: true, showRaidsmith: false,
  foundedYear: "2019", raidsPerWeek: "2", raidDays: "Ср/Вс", raidTime: "20:00–23:00 CET",
  rosterSize: "30", rosterFilled: "24", onlineCount: "6",
  chips: "Кромка в рейдах, Высокие ключи M+, Без токсичности, Ржём в войсе",
  aboutText1: "", aboutText2: "",
};

export function SettingsAdmin() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<"ok" | "err" | null>(null);
  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  useEffect(() => {
    adminApi.one("guild-setting").then((g) => {
      if (!g) return;
      const s = (k: string, fb: string) => (typeof g[k] === "string" && (g[k] as string).length > 0 ? (g[k] as string) : fb);
      setForm({
        name: s("name", EMPTY.name), region: s("region", EMPTY.region), faction: s("faction", EMPTY.faction),
        slogan: s("slogan", ""), recruitingOpen: Boolean(g.recruitingOpen), showRaidsmith: Boolean(g.showRaidsmith),
        foundedYear: s("foundedYear", EMPTY.foundedYear), raidsPerWeek: s("raidsPerWeek", EMPTY.raidsPerWeek),
        raidDays: s("raidDays", EMPTY.raidDays), raidTime: s("raidTime", EMPTY.raidTime),
        rosterSize: s("rosterSize", EMPTY.rosterSize), rosterFilled: s("rosterFilled", EMPTY.rosterFilled),
        onlineCount: s("onlineCount", EMPTY.onlineCount), chips: s("chips", EMPTY.chips),
        aboutText1: s("aboutText1", ""), aboutText2: s("aboutText2", ""),
      });
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

      <div className="adm-label">Основное</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Input label="НАЗВАНИЕ ГИЛЬДИИ" value={form.name} onChange={(v) => set({ name: v })} />
        <Input label="РЕГИОН / СЕРВЕР" value={form.region} onChange={(v) => set({ region: v })} />
        <Input label="ФРАКЦИЯ" value={form.faction} onChange={(v) => set({ faction: v })} />
        <Input label="СЛОГАН (под заголовком hero)" value={form.slogan} onChange={(v) => set({ slogan: v })} />
      </div>
      <div style={{ display: "flex", gap: 28, marginBottom: 28, flexWrap: "wrap" }}>
        <Toggle label="Набор открыт" on={form.recruitingOpen} onToggle={() => set({ recruitingOpen: !form.recruitingOpen })} />
        <Toggle label="Кнопка «Войти через Raidsmith»" on={form.showRaidsmith} onToggle={() => set({ showRaidsmith: !form.showRaidsmith })} />
      </div>

      <div className="adm-label">Секция «О гильдии» — цифры</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 16 }}>
        <Input label="ГОД ОСНОВАНИЯ" value={form.foundedYear} onChange={(v) => set({ foundedYear: v })} />
        <Input label="РЕЙДОВ В НЕДЕЛЮ" value={form.raidsPerWeek} onChange={(v) => set({ raidsPerWeek: v })} />
        <Input label="ДНИ РЕЙДОВ" value={form.raidDays} onChange={(v) => set({ raidDays: v })} />
        <Input label="ВРЕМЯ РЕЙДОВ" value={form.raidTime} onChange={(v) => set({ raidTime: v })} />
        <Input label="ШТАТ — ВСЕГО МЕСТ" value={form.rosterSize} onChange={(v) => set({ rosterSize: v })} />
        <Input label="ШТАТ — ЗАНЯТО" value={form.rosterFilled} onChange={(v) => set({ rosterFilled: v })} />
        <Input label="ОНЛАЙН" value={form.onlineCount} onChange={(v) => set({ onlineCount: v })} />
      </div>

      <div className="adm-label">Секция «О гильдии» — тексты</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
        <TextArea label="ЧИПЫ (через запятую)" rows={2} value={form.chips} onChange={(v) => set({ chips: v })} />
        <TextArea label="АБЗАЦ 1" rows={3} value={form.aboutText1} onChange={(v) => set({ aboutText1: v })} />
        <TextArea label="АБЗАЦ 2" rows={3} value={form.aboutText2} onChange={(v) => set({ aboutText2: v })} />
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      <input className="adm-input adm-input--sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      <textarea className="adm-input adm-input--sm" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button type="button" className={"toggle" + (on ? " on" : "")} onClick={onToggle}><span className="toggle__knob" /></button>
    </div>
  );
}
