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
  return jsonFetch<LoginResponse>(`${API_BASE}/users/login`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
