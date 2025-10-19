// client/src/shared/authApi.ts
import { api } from "../lib/http";
import type { SignupResponse, LoginResponse } from "./authTypes";

export function apiSignup(body: {
  name: string;
  email: string;
  password: string;
}) {
  // /users на бэке — значит здесь /api/users (префикс даст API_BASE="/api")
  return api.post<SignupResponse, typeof body>("/users", body);
}

export function apiLogin(body: { name: string; password: string }) {
  if (!body?.name || !body.name.trim()) {
    return Promise.reject(new Error("name_and_password_required"));
  }
  return api.post<LoginResponse, typeof body>("/users/login", body);
}

// пример приватного запроса
export function apiDashboardSummary() {
  return api.get<unknown>("/dashboard/summary");
}
