import { useState, type FormEvent } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { login } from "./auth";

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const r = await login(email, password);
    setLoading(false);
    if (r.ok) onSuccess();
    else setError(r.error ?? "Ошибка входа");
  };

  return (
    <div className="adm-login">
      <div
        style={{
          position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, pointerEvents: "none",
          background: "radial-gradient(circle, var(--glow), transparent 65%)", filter: "blur(30px)",
        }}
      />
      <div className="adm-login__card">
        <div
          style={{
            width: 52, height: 52, margin: "0 auto 20px", borderRadius: 15,
            background: "linear-gradient(150deg,var(--accent2),var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 19, color: "var(--ink)", boxShadow: "0 8px 22px var(--glow)",
          }}
        >
          ОК
        </div>
        <h1 style={{ fontWeight: 800, fontSize: 24, letterSpacing: "-.02em", margin: "0 0 8px", textAlign: "center" }}>
          Кабинет офицера
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--muted)", margin: "0 0 24px", textAlign: "center" }}>
          Управление сайтом гильдии «Отдел кадров». Доступ — для офицерского состава.
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="adm-input" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="adm-input" type="password" placeholder="Пароль" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="adm-flash adm-flash--err">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
            <Lock size={17} />
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 18,
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--muted)",
          }}
        >
          <ShieldCheck size={13} />
          Роль «Officer» в Strapi
        </div>
      </div>
    </div>
  );
}
