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
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";

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

  // авто-сейв в localStorage
  React.useEffect(() => {
    const sub = methods.watch((val) => {
      saveNewSession(val as Partial<NewSessionData>);
    });
    return () => sub.unsubscribe();
  }, [methods]);

  // совместимый go для шагов (как раньше давал SetupPage)
  const go = React.useCallback((to: string) => navigate(to), [navigate]);

  // финальный сабмит
  const onCreate = methods.handleSubmit(async (data) => {
    await createSession({
      title: data.title,
      topics: data.topics,
      duration: data.duration,
      level: data.level,
      position: data.position ?? "Middle", // юнион совпадает
      preferences: data.preferences,
    });
    clearNewSession();
    navigate("/dashboard");
  });

  return (
    <FormProvider {...methods}>
      <Section className="max-w-3xl">
        <h1 className="mb-4 text-2xl md:text-3xl font-semibold text-brand-deep dark:text-brand-white">
          Новая сессия
        </h1>
        <Card className="p-4 md:p-6">
          {/* даём шагам и onCreate, и go */}
          <Outlet context={{ onCreate, go }} />
        </Card>
      </Section>
    </FormProvider>
  );
}
