import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// In dev, Expo Go on a physical device cannot reach "localhost" (that's the
// phone itself), so we fall back to the bundler host IP. Simulators/web can
// use localhost directly. Override with EXPO_PUBLIC_API_URL if needed.
function resolveApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:4000`;
  }
  return "http://localhost:4000";
}

export const API_URL = resolveApiUrl();
const TOKEN_KEY = "lexloo_token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
  meta?: unknown;
}

export class ApiError extends Error {}

export async function uploadFile<T>(path: string, file: { uri: string; name: string; type: string }): Promise<T> {
  const token = await getToken();
  const form = new FormData();
  form.append("avatar", { uri: file.uri, name: file.name, type: file.type } as any);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { method: "POST", headers, body: form });
  } catch {
    throw new ApiError("Can't reach LexLoo right now. Check your connection and try again.");
  }
  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json?.success) {
    throw new ApiError(json?.error ?? "Something went wrong. Please try again.");
  }
  return json.data;
}

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach LexLoo right now. Check your connection and try again.");
  }

  const json = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !json?.success) {
    throw new ApiError(json?.error ?? "Something went wrong. Please try again.");
  }
  return json.data;
}
