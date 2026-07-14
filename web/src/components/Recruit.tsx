import { useState, type FormEvent } from "react";
import { Dot, Lock, Send, Check } from "lucide-react";
import { Icon } from "./Icon";
import { submitApplication } from "../lib/api";
import { WOW_CLASSES } from "../lib/types";
import type { RecruitRole, Requirement } from "../lib/types";

export function Recruit({ roles, requirements }: { roles: RecruitRole[]; requirements: Requirement[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [battletag, setBattletag] = useState("");
  const [wowClass, setWowClass] = useState("");
  const [logsUrl, setLogsUrl] = useState("");
  const [comment, setComment] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitApplication({ battletag, wowClass, logsUrl, comment });
    setSubmitted(true);
  };

  return (
    <section id="recruit" className="section section--alt">
      <div className="container">
        <div className="eyebrow">
          <span className="eyebrow__diamond" />
          <span className="eyebrow__label">Мы нанимаем</span>
        </div>
        <h2 className="h2" style={{ marginBottom: 10 }}>Открыт набор в штат</h2>
        <p className="lead" style={{ marginBottom: 36, maxWidth: 620 }}>
          Это как отклик на вакансию — расскажи, кто ты и почему тебе к нам. Смотрим на голову и
          адекватность не меньше, чем на цифры.
        </p>

        <div className="recruit-grid">
          <div>
            <div className="subhead">Кого ищем</div>
            <div className="roles-grid">
              {roles.map((r) => (
                <div key={r.key} className={"role" + (r.open ? "" : " role--closed")}>
                  <Icon name={r.icon} size={22} className={r.open ? "c-accent" : "c-muted"} />
                  <div style={{ flex: 1 }}>
                    <div className="role__name">{r.name}</div>
                    {r.open ? (
                      <div className="role__status role__status--open">
                        <Dot size={14} />
                        Нужен
                      </div>
                    ) : (
                      <div className="role__status role__status--closed">
                        <Lock size={12} />
                        Закрыт
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="subhead">Требования</div>
            <div className="reqs">
              {requirements.map((req) => (
                <div key={req.text} className="req">
                  <Icon name={req.icon} size={17} className="c-accent" />
                  {req.text}
                </div>
              ))}
            </div>
          </div>

          <div className="form-card">
            {submitted ? (
              <div className="success">
                <div className="success__icon">
                  <Check size={30} />
                </div>
                <div className="success__title">Резюме принято!</div>
                <p className="success__text">
                  Спасибо, что откликнулся. Офицеры посмотрят заявку и напишут в Discord в течение
                  пары дней. Удачи на прогрессе!
                </p>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit}>
                <div className="form__title">Отправить резюме</div>
                <label className="field">
                  <span className="field__label">BATTLETAG / ИМЯ</span>
                  <input
                    className="field__input"
                    required
                    placeholder="Например: Ник#2100"
                    value={battletag}
                    onChange={(e) => setBattletag(e.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field__label">КЛАСС / СПЕК</span>
                  <select
                    className="field__input"
                    required
                    value={wowClass}
                    onChange={(e) => setWowClass(e.target.value)}
                  >
                    <option value="">Выбери класс</option>
                    {WOW_CLASSES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span className="field__label">ССЫЛКА НА LOGS / RAIDER.IO</span>
                  <input
                    className="field__input"
                    type="url"
                    placeholder="https://"
                    value={logsUrl}
                    onChange={(e) => setLogsUrl(e.target.value)}
                  />
                </label>
                <label className="field">
                  <span className="field__label">КОММЕНТАРИЙ</span>
                  <textarea
                    className="field__input"
                    rows={3}
                    placeholder="Пару слов о себе и опыте"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </label>
                <button type="submit" className="btn btn-primary">
                  <Send size={17} />
                  Отправить резюме
                </button>
                <div className="form-note">Ответим в Discord в течение пары дней</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
