export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SessionResponse = {
  user: AuthUser;
};

export class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const isCodespacesHost =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith(".app.github.dev");

// In Codespaces, cross-port calls can be gated by tunnel auth. Prefer same-origin /api.
const apiBaseUrl = isCodespacesHost ? "" : configuredApiBaseUrl;

const withApiBaseUrl = (path: string) => `${apiBaseUrl}${path}`;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isTunnelAuthResponse = (response: Response) => {
  const authenticateHeader = response.headers.get("www-authenticate") || "";

  if (response.status === 401 && authenticateHeader.toLowerCase().includes("tunnel")) {
    return true;
  }

  if (response.redirected && response.url.includes("github.dev/pf-signin")) {
    return true;
  }

  return false;
};

const parseResponse = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const requestJson = async <T>(
  url: string,
  options: {
    method: "GET" | "POST";
    payload?: unknown;
    token?: string;
  }
): Promise<T> => {
  const headers: Record<string, string> = {};

  if (options.payload !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const sendRequest = async (requestUrl: string) => {
    try {
      return await fetch(requestUrl, {
        method: options.method,
        headers,
        body: options.payload !== undefined ? JSON.stringify(options.payload) : undefined,
      });
    } catch {
      throw new AuthApiError(
        "Cannot reach the auth server. Start the API and try again.",
        0
      );
    }
  };

  let response = await sendRequest(url);

  // If a configured cross-port URL is tunnel-protected, retry once via same-origin /api.
  if (isTunnelAuthResponse(response) && configuredApiBaseUrl && url.startsWith(configuredApiBaseUrl)) {
    const sameOriginUrl = url.slice(configuredApiBaseUrl.length) || "/";
    response = await sendRequest(sameOriginUrl);
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Request failed. Please try again.";

    throw new AuthApiError(message, response.status);
  }

  return data as T;
};

export const signupUser = (payload: SignupPayload) =>
  requestJson<AuthResponse>(withApiBaseUrl("/api/auth/signup"), {
    method: "POST",
    payload: {
      ...payload,
      email: normalizeEmail(payload.email),
    },
  });

export const loginUser = (payload: LoginPayload) =>
  requestJson<AuthResponse>(withApiBaseUrl("/api/auth/login"), {
    method: "POST",
    payload: {
      ...payload,
      email: normalizeEmail(payload.email),
    },
  });

export const fetchCurrentUser = (token: string) =>
  requestJson<SessionResponse>(withApiBaseUrl("/api/auth/me"), { method: "GET", token });

export const isAuthApiError = (error: unknown): error is AuthApiError =>
  error instanceof AuthApiError;
