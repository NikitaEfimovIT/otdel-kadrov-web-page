import { useState } from "react";
import { CheckCircle2, Info, ChevronRight } from "lucide-react";
import type { Poll, PollArchiveItem } from "../lib/types";

export function Polls({ poll, archive }: { poll: Poll; archive: PollArchiveItem[] }) {
  const [voted, setVoted] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);

  const counts = poll.options.map((o, i) => o.votes + (voted && choice === i ? 1 : 0));
  const total = counts.reduce((a, b) => a + b, 0);
  const baseTotal = poll.options.reduce((a, b) => a + b.votes, 0);

  const vote = (i: number) => {
    if (!voted) {
      setVoted(true);
      setChoice(i);
    }
  };

  return (
    <section id="polls" className="section section--alt">
      <div className="container">
        <div className="eyebrow">
          <span className="eyebrow__diamond" />
          <span className="eyebrow__label">Голосование</span>
        </div>
        <h2 className="h2" style={{ marginBottom: 36 }}>Опросы</h2>

        <div className="polls-grid">
          <div className="poll-card">
            <div className="poll-card__head">
              <span className="mono" style={{ fontSize: 11, letterSpacing: 1, color: "var(--accent)" }}>
                АКТИВНЫЙ ОПРОС
              </span>
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                {voted ? `спасибо · ${total} голосов` : `${baseTotal} уже ответили`}
              </span>
            </div>
            <h3 className="poll-card__q">{poll.question}</h3>
            <div className="poll-options">
              {poll.options.map((o, i) => {
                const pct = voted ? Math.round((counts[i] / total) * 100) : 0;
                return (
                  <div
                    key={o.id}
                    className={"poll-opt" + (voted ? " poll-opt--voted" : "")}
                    onClick={() => vote(i)}
                  >
                    <div className="poll-opt__fill" style={{ width: `${pct}%` }} />
                    <span className="poll-opt__label">
                      {choice === i && <CheckCircle2 size={16} className="c-accent" />}
                      {o.label}
                    </span>
                    <span className="poll-opt__pct">{voted ? `${pct}%` : ""}</span>
                  </div>
                );
              })}
            </div>
            <div className="poll-note">
              <Info size={13} />
              Голос анонимный · один на человека
            </div>
          </div>

          <div className="poll-archive">
            <div className="mono" style={{ fontSize: 11, letterSpacing: 1, color: "var(--muted)", padding: "0 4px" }}>
              АРХИВ
            </div>
            {archive.map((a) => (
              <div key={a.id} className="archive-item">
                <div>
                  <div className="archive-item__q">{a.question}</div>
                  <div className="archive-item__res">{a.result}</div>
                </div>
                <ChevronRight size={16} className="c-muted" />
              </div>
            ))}
            <div className="archive-empty">Опросов пока нет. Отдыхаем.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
