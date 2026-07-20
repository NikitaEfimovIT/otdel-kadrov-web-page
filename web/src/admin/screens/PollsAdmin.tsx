import { useEffect, useState, type ReactNode } from "react";
import { Plus, X, CalendarPlus, Users, Clock } from "lucide-react";
import { adminApi, type StrapiItem } from "../adminApi";

export function PollsAdmin() {
  const [polls, setPolls] = useState<StrapiItem[]>([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [multiple, setMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => adminApi.list("polls?populate=options&sort=createdAt:desc").then(setPolls);
  useEffect(() => { load(); }, []);

  const setOpt = (i: number, v: string) => setOptions(options.map((o, x) => (x === i ? v : o)));
  const removeOpt = (i: number) => { if (options.length > 2) setOptions(options.filter((_, x) => x !== i)); };
  const addOpt = () => setOptions([...options, ""]);

  const publish = async () => {
    const opts = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || opts.length < 2) return;
    setSaving(true);
    const poll = await adminApi.create("polls", { question, state: "active", multiple, anonymous });
    if (poll) {
      await Promise.all(opts.map((text) => adminApi.create("poll-options", { text, votes: 0, poll: poll.documentId })));
    }
    setSaving(false);
    if (poll) { setQuestion(""); setOptions(["", ""]); await load(); }
  };

  const closePoll = async (p: StrapiItem) => {
    if (await adminApi.update("polls", p.documentId, { state: "closed" })) load();
  };

  return (
    <div>
      <div className="adm-kicker">Опросы</div>
      <h1 className="adm-h1" style={{ marginBottom: 28 }}>Опросы</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <div>
          <div className="adm-label">Все опросы</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {polls.length === 0 && <div style={{ color: "var(--muted)", fontSize: 14 }}>Опросов пока нет.</div>}
            {polls.map((p) => {
              const active = p.state === "active";
              const opts = Array.isArray(p.options) ? (p.options as Record<string, unknown>[]) : [];
              const votes = opts.reduce((s, o) => s + Number(o.votes ?? 0), 0);
              return (
                <div key={p.documentId} className="adm-card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{String(p.question ?? "")}</span>
                    <span className="mono" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, color: active ? "var(--green)" : "var(--muted)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "var(--green)" : "var(--muted)", display: "inline-block" }} />
                      {active ? "Активна" : "Закрыта"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Users size={13} />{votes} голосов</span>
                    {active && (
                      <button className="link-lite" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit", fontSize: 11 }} onClick={() => closePoll(p)}>
                        <Clock size={13} />закрыть
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="adm-card adm-card--accent" style={{ padding: 22 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>Конструктор опроса</div>
          <Field label="ВОПРОС">
            <input className="adm-input adm-input--sm" placeholder="О чём спрашиваем штат?" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </Field>
          <div className="mono" style={{ fontSize: 11, color: "var(--muted)", margin: "16px 0 10px" }}>ВАРИАНТЫ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {options.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 7, background: "var(--soft)", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <input className="adm-input adm-input--sm" style={{ flex: 1 }} value={o} placeholder={`Вариант ${i + 1}`} onChange={(e) => setOpt(i, e.target.value)} />
                <button type="button" className="icon-btn icon-btn--red" style={{ width: 34, height: 34 }} onClick={() => removeOpt(i)} disabled={options.length <= 2}><X size={15} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addOpt} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, border: "1px dashed var(--line)", background: "transparent", color: "var(--accent)", fontWeight: 600, fontSize: 13, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: 18 }}>
            <Plus size={15} />Добавить вариант
          </button>
          <ToggleRow label="Несколько вариантов" on={multiple} onToggle={() => setMultiple(!multiple)} />
          <ToggleRow label="Анонимно" on={anonymous} onToggle={() => setAnonymous(!anonymous)} />
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }} onClick={publish} disabled={saving}>
            <CalendarPlus size={16} />{saving ? "Публикую…" : "Опубликовать опрос"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderTop: "1px solid var(--line2)" }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button type="button" className={"toggle" + (on ? " on" : "")} onClick={onToggle}><span className="toggle__knob" /></button>
    </div>
  );
}
