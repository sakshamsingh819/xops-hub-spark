import { getAuthSession } from "@/lib/auth";

const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const withApiBaseUrl = (path: string) => `${configuredApiBaseUrl}${path}`;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const session = getAuthSession();
  const requestUrl = configuredApiBaseUrl ? withApiBaseUrl(path) : path;

  const response = await fetch(requestUrl, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      (payload as { message?: string }).message || "Request failed";
    throw new Error(message);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
};
