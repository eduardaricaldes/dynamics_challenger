// API base — empty string = same origin (Next.js API routes at /api/...)
// Set NEXT_PUBLIC_API_URL to point to an external backend if needed
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 200 && res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json();
}
