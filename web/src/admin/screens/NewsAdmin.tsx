import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Plus, ArrowLeft, Pencil, Trash2, Send } from "lucide-react";
import { adminApi, type StrapiItem } from "../adminApi";

const TAGS = [
  { value: "raid", label: "Рейд" },
  { value: "recruit", label: "Набор" },
  { value: "event", label: "Ивент" },
  { value: "announcement", label: "Объявление" },
];
const tagLabel = (v: string) => TAGS.find((t) => t.value === v)?.label ?? v;

interface Form {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  published: boolean;
}
const EMPTY: Form = { title: "", excerpt: "", tag: "raid", date: "", published: false };

export function NewsAdmin() {
  const [items, setItems] = useState<StrapiItem[]>([]);
  const [editing, setEditing] = useState<StrapiItem | null>(null);
  const [mode, setMode] = useState<"list" | "editor">("list");
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.list("news-items?sort=date:desc").then(setItems);
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setMode("editor"); };
  const openEdit = (n: StrapiItem) => {
    setEditing(n);
    setForm({
      title: String(n.title ?? ""), excerpt: String(n.excerpt ?? ""),
      tag: String(n.tag ?? "raid"), date: String(n.date ?? ""), published: Boolean(n.published),
    });
    setMode("editor");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data = { title: form.title, excerpt: form.excerpt, tag: form.tag, date: form.date, published: form.published };
    const ok = editing
      ? await adminApi.update("news-items", editing.documentId, data)
      : Boolean(await adminApi.create("news-items", data));
    setSaving(false);
    if (ok) { await load(); setMode("list"); }
  };

  const del = async (n: StrapiItem) => {
    if (!window.confirm(`Удалить «${String(n.title)}»?`)) return;
    if (await adminApi.remove("news-items", n.documentId)) load();
  };

  if (mode === "editor") {
    return (
      <div>
        <button
          className="link-lite"
          onClick={() => setMode("list")}
          style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", fontSize: 13, marginBottom: 18, cursor: "pointer" }}
        >
          <ArrowLeft size={15} />К списку новостей
        </button>
        <h1 className="adm-h1" style={{ fontSize: 30, marginBottom: 24 }}>{editing ? "Редактировать новость" : "Создать новость"}</h1>
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1.4fr .6fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="ЗАГОЛОВОК">
              <input className="adm-input" required placeholder="Например: Взяли восьмого на миф-сложности" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="ТЕКСТ (превью на карточке)">
              <textarea className="adm-input" rows={9} placeholder="Что произошло, кого хвалим, что дальше…" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </Field>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: 18, border: "1px solid var(--line2)", borderRadius: 14, background: "var(--surface)", display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="ТЕГ">
                <select className="adm-input adm-input--sm" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                  {TAGS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="ДАТА (как показать)">
                <input className="adm-input adm-input--sm" placeholder="напр. 12 июля" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                <span style={{ fontSize: 14 }}>Опубликовать</span>
                <button type="button" className={"toggle" + (form.published ? " on" : "")} onClick={() => setForm({ ...form, published: !form.published })}><span className="toggle__knob" /></button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}><Send size={16} />{saving ? "Сохраняю…" : "Сохранить"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
        <div><div className="adm-kicker">Новости</div><h1 className="adm-h1">Новости</h1></div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={17} />Создать новость</button>
      </div>
      <div className="adm-table">
        <div className="adm-thead" style={{ gridTemplateColumns: "1fr 120px 110px 130px 90px" }}>
          <span>Заголовок</span><span>Тег</span><span>Дата</span><span>Статус</span><span style={{ textAlign: "right" }}>Действия</span>
        </div>
        {items.length === 0 && <div style={{ padding: 22, color: "var(--muted)", fontSize: 14 }}>Новостей пока нет.</div>}
        {items.map((n) => {
          const pub = Boolean(n.published);
          return (
            <div key={n.documentId} className="adm-trow adm-trow--click" style={{ gridTemplateColumns: "1fr 120px 110px 130px 90px" }} onClick={() => openEdit(n)}>
              <span style={{ fontSize: 14.5, fontWeight: 600 }}>{String(n.title ?? "")}</span>
              <span><span className="tag">{tagLabel(String(n.tag ?? ""))}</span></span>
              <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{String(n.date ?? "—")}</span>
              <span className="mono" style={{ fontSize: 11, color: pub ? "var(--green)" : "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: pub ? "var(--green)" : "var(--muted)", display: "inline-block" }} />
                {pub ? "Опубликовано" : "Черновик"}
              </span>
              <span style={{ display: "flex", gap: 8, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
                <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => openEdit(n)}><Pencil size={15} /></button>
                <button className="icon-btn icon-btn--red" style={{ width: 30, height: 30 }} onClick={() => del(n)}><Trash2 size={15} /></button>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, letterSpacing: ".5px", color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}
