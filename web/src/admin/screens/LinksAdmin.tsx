import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { Icon } from "../../components/Icon";
import { adminApi, type StrapiItem } from "../adminApi";

const ICONS = ["trophy", "bar-chart-3", "message-circle", "external-link", "monitor-play", "clapperboard"];

interface Form { name: string; url: string; icon: string; order: number; visible: boolean; }
const EMPTY: Form = { name: "", url: "", icon: "external-link", order: 0, visible: true };

export function LinksAdmin() {
  const [links, setLinks] = useState<StrapiItem[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [editing, setEditing] = useState<StrapiItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.list("links?sort=order:asc").then(setLinks);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, order: links.length }); };
  const openEdit = (l: StrapiItem) => {
    setEditing(l);
    setForm({ name: String(l.name ?? ""), url: String(l.url ?? ""), icon: String(l.icon ?? "external-link"), order: Number(l.order ?? 0), visible: Boolean(l.visible) });
  };

  const save = async (f: Form) => {
    if (!f.name.trim() || !f.url.trim()) return;
    setSaving(true);
    const data = { name: f.name, url: f.url, icon: f.icon, order: f.order, visible: f.visible };
    const ok = editing ? await adminApi.update("links", editing.documentId, data) : Boolean(await adminApi.create("links", data));
    setSaving(false);
    if (ok) { setForm(null); setEditing(null); load(); }
  };

  const toggleVisible = async (l: StrapiItem) => {
    if (await adminApi.update("links", l.documentId, { visible: !l.visible })) load();
  };
  const del = async (l: StrapiItem) => {
    if (!window.confirm(`Удалить «${String(l.name)}»?`)) return;
    if (await adminApi.remove("links", l.documentId)) load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div><div className="adm-kicker">Хаб ресурсов</div><h1 className="adm-h1">Ссылки</h1></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={17} />Добавить ссылку</button>
      </div>

      {form !== null && (
        <LinkForm form={form} setForm={setForm} onSave={save} onClose={() => { setForm(null); setEditing(null); }} saving={saving} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.length === 0 && <div style={{ color: "var(--muted)", fontSize: 14 }}>Ссылок пока нет.</div>}
        {links.map((l) => {
          const on = Boolean(l.visible);
          return (
            <div key={l.documentId} style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 20px", border: "1px solid var(--line2)", borderRadius: 14, background: "var(--surface)" }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "var(--bg)", border: "1px solid var(--line2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                <Icon name={String(l.icon ?? "external-link")} size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{String(l.name ?? "")}</div>
                <div className="mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(l.url ?? "")}</div>
              </div>
              <span className="mono" style={{ fontSize: 10, color: on ? "var(--green)" : "var(--muted)" }}>{on ? "ВКЛ" : "ВЫКЛ"}</span>
              <button className={"toggle" + (on ? " on" : "")} onClick={() => toggleVisible(l)}><span className="toggle__knob" /></button>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => openEdit(l)}><Pencil size={15} /></button>
              <button className="icon-btn icon-btn--red" style={{ width: 34, height: 34 }} onClick={() => del(l)}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LinkForm({ form, setForm, onSave, onClose, saving }: {
  form: Form;
  setForm: (f: Form) => void;
  onSave: (f: Form) => void;
  onClose: () => void;
  saving: boolean;
}) {
  return (
    <div className="adm-card adm-card--accent" style={{ padding: 20, marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr 150px auto auto", gap: 12, alignItems: "end" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>НАЗВАНИЕ</span>
        <input className="adm-input adm-input--sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>URL</span>
        <input className="adm-input adm-input--sm" placeholder="https://" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>ИКОНКА</span>
        <select className="adm-input adm-input--sm" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
          {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
        </select>
      </label>
      <button className="btn btn-primary btn--sm" onClick={() => onSave(form)} disabled={saving}>{saving ? "…" : "Сохранить"}</button>
      <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={onClose}><X size={16} /></button>
    </div>
  );
}
