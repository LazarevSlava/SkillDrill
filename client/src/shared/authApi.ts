// client/src/shared/authApi.ts
import { API_BASE } from "./env";
import { jsonFetch } from "./authUtils";
import type { SignupResponse, LoginResponse } from "./authTypes";

export function apiSignup(body: {
  name: string;
  email: string;
  password: string;
}) {
  return jsonFetch<SignupResponse>(`${API_BASE}/users`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiLogin(body: { name: string; password: string }) {
  if (!body?.name || !body.name.trim()) {
    return Promise.reject(new Error("name_and_password_required"));
  }
  return jsonFetch<LoginResponse>(`${API_BASE}/users/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
