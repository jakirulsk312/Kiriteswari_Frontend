const defaultApiBase = typeof window !== "undefined" && window.location.hostname !== "localhost"
  ? "/api"
  : "http://localhost:3001/api";

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || defaultApiBase;

export async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return (payload ?? {}) as T;
}
