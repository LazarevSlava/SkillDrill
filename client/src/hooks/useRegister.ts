// src/forms/useRegister.ts
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { AUTH_STUB, StubMode } from "../shared/env";
import { apiLogin, apiSignup } from "../shared/authApi";
import {
  extractErrorCode,
  mapErrorCodeToMessage,
  normalizeLower,
  sleep,
} from "../shared/authUtils";
import type {
  ApiOk,
  ApiError,
  FormValues,
  Mode,
  ApiErrCode,
} from "../shared/authTypes";

export type UseRegisterOpts = {
  initialMode?: Mode;
  onSuccess?: () => void; // если не задан, делаем дефолтный navigate
  stub?: StubMode;
};

// Разрешённые коды ошибок — для безопасного сопоставления
const KNOWN_ERR_CODES = new Set<ApiErrCode>([
  "name_taken",
  "email_taken",
  "invalid_email",
  "password_too_short",
  "invalid_credentials",
  "name_and_password_required",
  "validation_error",
]);

function asApiErrCode(s?: string): ApiErrCode | undefined {
  return s && KNOWN_ERR_CODES.has(s as ApiErrCode)
    ? (s as ApiErrCode)
    : undefined;
}

function isApiOk(payload: unknown): payload is ApiOk {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "ok" in payload &&
    payload.ok === true
  );
}

function isApiError(payload: unknown): payload is ApiError {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "ok" in payload &&
    payload.ok === false
  );
}

export function useRegister({
  initialMode = "signup",
  onSuccess,
  stub,
}: UseRegisterOpts) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    reset({ username: "", email: "", password: "" });
    setServerError(null);
  }, [mode, reset]);

  const usernameRequired = useMemo(() => mode === "signup", [mode]);
  const stubMode: StubMode = stub ?? AUTH_STUB;

  const afterSuccess = () => {
    if (typeof onSuccess === "function") {
      try {
        onSuccess();
      } catch {
        /* ignore onSuccess errors intentionally */
      }
      return;
    }
    // Всегда отправляем пользователя в дэшборд
    navigate("/dashboard", { replace: true });
  };

  const simulateSuccess = async () => {
    await sleep(450);
    afterSuccess();
  };

  function handleAuthSuccess(payload: ApiOk) {
    try {
      localStorage.setItem("auth:user", JSON.stringify(payload.user));
    } catch {
      /* ignore localStorage errors (quota/deny) */
    }
    afterSuccess();
  }

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      if (stubMode === "always") {
        await simulateSuccess();
        return;
      }

      if (mode === "signup") {
        const name = normalizeLower(data.username);
        const email = normalizeLower(data.email);
        const payload = await apiSignup({
          name,
          email,
          password: data.password,
        });

        if (!isApiOk(payload)) {
          if (stubMode === "fallback") {
            await simulateSuccess();
            return;
          }
          const code = isApiError(payload)
            ? extractErrorCode(payload.error)
            : undefined;
          const msg = mapErrorCodeToMessage(code, "Ошибка регистрации");
          throw new Error(msg);
        }

        handleAuthSuccess(payload);
      } else {
        // signin: поддерживаем ввод в username ИЛИ в email
        const rawLogin = data.username?.trim() || data.email?.trim() || "";
        const nameForLogin = normalizeLower(rawLogin);

        const payload = await apiLogin({
          name: nameForLogin,
          password: data.password,
        });

        if (!isApiOk(payload)) {
          if (stubMode === "fallback") {
            await simulateSuccess();
            return;
          }
          const code = isApiError(payload)
            ? extractErrorCode(payload.error)
            : undefined;
          const msg = mapErrorCodeToMessage(code, "Ошибка входа");
          throw new Error(msg);
        }

        handleAuthSuccess(payload);
      }
    } catch (e: unknown) {
      if (stubMode === "fallback") {
        await simulateSuccess();
      } else {
        // e.message может содержать код вроде "invalid_credentials" / "validation_error" / "http_400"
        const msg = e instanceof Error ? e.message : undefined;
        const code = asApiErrCode(msg);
        const fallback =
          mode === "signin" ? "Ошибка входа" : "Ошибка регистрации";
        setServerError(mapErrorCodeToMessage(code, fallback));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    setMode,
    serverError,
    loading,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    usernameRequired,
    onSubmit,
  };
}
