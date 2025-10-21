import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import {
  loadNewSession,
  saveNewSession,
  clearNewSession,
  type NewSessionData,
} from "../../features/setup/newSessionStorage";
import { createSession } from "../../api/sessions";

const DEFAULTS: NewSessionData = {
  topics: [],
  duration: 30,
  level: "medium",
  title: "",
  position: "Middle",
  preferences: {},
};

export default function NewSessionPage() {
  const navigate = useNavigate();

  const methods = useForm<NewSessionData>({
    mode: "onChange",
    defaultValues: loadNewSession() ?? DEFAULTS,
  });

  // авто-сейв в localStorage при любых изменениях
  React.useEffect(() => {
    const sub = methods.watch((val) => {
      saveNewSession(val as Partial<NewSessionData>);
    });
    return () => sub.unsubscribe();
  }, [methods]);

  // сабмит финального шага
  const onCreate = methods.handleSubmit(async (data) => {
    await createSession({
      title: data.title,
      topics: data.topics,
      duration: data.duration,
      level: data.level,
      position: data.position ?? "Middle",
      preferences: data.preferences,
    });
    clearNewSession();
    navigate("/dashboard");
  });

  // Передаём onCreate в дочерние шаги через Outlet context
  return (
    <FormProvider {...methods}>
      <div className="min-h-dvh">
        <Outlet context={{ onCreate }} />
      </div>
    </FormProvider>
  );
}
