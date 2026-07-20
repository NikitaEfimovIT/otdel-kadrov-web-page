// Авторизация офицера через Strapi Users & Permissions (email/пароль → JWT).
const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "ok_officer_jwt";
const USER_KEY = "ok_officer_user";

export interface OfficerUser {
  id: number;
  username: string;
  email: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): OfficerUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as OfficerUser) : null;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function login(
  identifier: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!API_URL) return { ok: false, error: "API не настроен (VITE_API_URL)" };
  try {
    const res = await fetch(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data?.error?.message ?? "Неверный логин или пароль" };
    }
    localStorage.setItem(TOKEN_KEY, data.jwt);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({ id: data.user.id, username: data.user.username, email: data.user.email }),
    );
    return { ok: true };
  } catch {
    return { ok: false, error: "Сеть недоступна" };
  }
}
