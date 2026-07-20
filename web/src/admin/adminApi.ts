// CRUD к Strapi под токеном офицера. Strapi 5: update/delete по documentId.
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export interface StrapiItem {
  id: number;
  documentId: string;
  [k: string]: unknown;
}

async function authed(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  return fetch(`${API_URL}/api/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
}

async function list(path: string): Promise<StrapiItem[]> {
  const res = await authed(path);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? (json.data as StrapiItem[]) : [];
}

async function one(path: string): Promise<StrapiItem | null> {
  const res = await authed(path);
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data as StrapiItem | null) ?? null;
}

async function create(path: string, data: Record<string, unknown>): Promise<StrapiItem | null> {
  const res = await authed(path, { method: "POST", body: JSON.stringify({ data }) });
  if (!res.ok) return null;
  const json = await res.json();
  return (json.data as StrapiItem | null) ?? null;
}

async function update(
  path: string,
  documentId: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const res = await authed(`${path}/${documentId}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
  return res.ok;
}

async function remove(path: string, documentId: string): Promise<boolean> {
  const res = await authed(`${path}/${documentId}`, { method: "DELETE" });
  return res.ok;
}

// Single type: PUT без documentId — создаёт или обновляет единственную запись.
async function saveSingle(path: string, data: Record<string, unknown>): Promise<boolean> {
  const res = await authed(path, { method: "PUT", body: JSON.stringify({ data }) });
  return res.ok;
}

export const adminApi = { list, one, create, update, remove, saveSingle };
