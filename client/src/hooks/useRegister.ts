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
import type { ApiOk, ApiError, FormValues, Mode } from "../shared/authTypes";

export type UseRegisterOpts = {
  initialMode?: Mode;
  onSuccess?: () => void; // если не задан, делаем navigate('/setup')
  stub?: StubMode; // переопределяет .env
};

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

  const onSuccessOrGoApp = () => {
    const usingProp = typeof onSuccess === "function";
    if (usingProp) {
      try {
        onSuccess!();
      } catch (e) {
        console.warn("onSuccess threw:", e);
      }
    }
    navigate("/setup");
  };

  const simulateSuccess = async () => {
    await sleep(450);
    onSuccessOrGoApp();
  };

  function handleAuthSuccess(payload: ApiOk) {
    console.log("[Register] auth success:", payload);
    try {
      localStorage.setItem("auth:user", JSON.stringify(payload.user));
    } catch (err) {
      console.error("Failed to save user in localStorage:", err);
    }
    onSuccessOrGoApp();
  }

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setLoading(true);
    try {
      if (stubMode === "always") {
        console.warn("[Register] AUTH_STUB=always → имитируем успех");
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

        if (!("ok" in payload) || !payload.ok) {
          if (stubMode === "fallback") {
            console.warn(
              "[Register] fallback → signup ошибка, имитируем успех",
            );
            await simulateSuccess();
            return;
          }
          const code = extractErrorCode((payload as ApiError)?.error);
          const msg = mapErrorCodeToMessage(code, "Ошибка регистрации");
          throw new Error(msg);
        }
        handleAuthSuccess(payload as ApiOk);
        return;
      } else {
        const nameForLogin = normalizeLower(data.username ?? data.email);
        const payload = await apiLogin({
          name: nameForLogin,
          password: data.password,
        });

        if (!("ok" in payload) || !payload.ok) {
          if (stubMode === "fallback") {
            console.warn("[Register] fallback → login ошибка, имитируем успех");
            await simulateSuccess();
            return;
          }
          const code = extractErrorCode((payload as ApiError)?.error);
          const msg = mapErrorCodeToMessage(code, "Ошибка входа");
          throw new Error(msg);
        }
        handleAuthSuccess(payload as ApiOk);
        return;
      }
    } catch (e: unknown) {
      if (stubMode === "fallback") {
        console.warn("[Register] fallback → исключение/сеть, имитируем успех");
        await simulateSuccess();
      } else {
        setServerError(e instanceof Error ? e.message : "Unexpected error");
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
