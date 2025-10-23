// client/src/pages/Interview/InterviewPage.tsx
import * as React from "react";
import {
  Bot,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Type,
  Code2,
  Eraser,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import TextArea from "../../components/ui/TextArea";
import Alert from "../../components/ui/Alert";
import Badge from "../../components/ui/Badge";

type InputMode = "text" | "code";

export default function InterviewPage() {
  // ---- DEMO STATE ----
  const [question] = React.useState(
    "Расскажи, как работает Event Loop в JavaScript на примере setTimeout и Promise.",
  );
  const [timer, setTimer] = React.useState(0);

  // UI режимы
  const [mode, setMode] = React.useState<InputMode>("text");
  const [text, setText] = React.useState("");
  const [code, setCode] = React.useState("// Напишите здесь решение...\n");

  // AUDIO (автовключение микрофона)
  const mediaRef = React.useRef<MediaRecorder | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);
  const [micReady, setMicReady] = React.useState<"init" | "ok" | "denied">(
    "init",
  );
  const [isMicMuted, setIsMicMuted] = React.useState(false);

  // Интервьюер “динамик”
  const [isAIMuted, setIsAIMuted] = React.useState(false);

  // Флэш-уведомление об отправке
  const [flash, setFlash] = React.useState<string | null>(null);
  const flashHideTimerRef = React.useRef<number | null>(null);

  // Таймер
  React.useEffect(() => {
    const id = window.setInterval(() => setTimer((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Автозапуск микрофона
  React.useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        setMicReady("ok");

        const mr = new MediaRecorder(stream);
        mediaRef.current = mr;

        mr.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size) {
            chunksRef.current.push(e.data);
          }
        };

        // стартуем запись
        chunksRef.current = [];
        mr.start();
      } catch {
        setMicReady("denied");
      }
    })();

    return () => {
      try {
        if (mediaRef.current && mediaRef.current.state !== "inactive") {
          mediaRef.current.stop();
        }
      } catch {
        // ignore
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Toggle mic mute/unmute (останавливаем/запускаем MediaRecorder)
  const toggleMic = React.useCallback(() => {
    setIsMicMuted((prev) => {
      const next = !prev;
      try {
        const mr = mediaRef.current;
        if (!mr) return next;
        if (next) {
          if (mr.state !== "inactive") mr.stop();
        } else {
          chunksRef.current = [];
          if (mr.state === "inactive") mr.start();
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Toggle AI mute (пока только UI)
  const toggleAI = () => setIsAIMuted((s) => !s);

  function formatTimer(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  // Аккуратно дожидаемся финального чанка после stop()
  async function stopAndGetBlob(
    mr: MediaRecorder,
    chunks: BlobPart[],
  ): Promise<Blob> {
    if (mr.state === "inactive") {
      return new Blob(chunks, { type: "audio/webm" });
    }
    const done = new Promise<void>((resolve) => {
      const onStop = () => {
        mr.removeEventListener("stop", onStop as EventListener);
        resolve();
      };
      mr.addEventListener("stop", onStop as EventListener, { once: true });
    });
    mr.stop();
    await done;
    return new Blob(chunks, { type: "audio/webm" });
  }

  const handleSubmit = React.useCallback(async () => {
    // собрать аудио (срез текущего буфера)
    let audioBlob: Blob | null = null;
    try {
      const mr = mediaRef.current;
      if (mr) {
        audioBlob = await stopAndGetBlob(mr, chunksRef.current);
        chunksRef.current = [];
        // перезапускаем запись, если микрофон не в mute
        if (!isMicMuted) {
          window.setTimeout(() => {
            try {
              if (mr.state === "inactive") mr.start();
            } catch {
              // ignore
            }
          }, 200);
        }
      }
    } catch {
      // ignore
    }

    const payload = {
      text: mode === "text" ? text : "",
      code: mode === "code" ? code : "",
      audio: audioBlob
        ? `${Math.round(audioBlob.size / 1024)} KB`
        : isMicMuted
          ? "mute"
          : "нет",
    };

    // показываем результат отправки во флэше
    setFlash(JSON.stringify(payload, null, 2));

    // очистка инпутов
    if (mode === "text") setText("");
    if (mode === "code") setCode("");

    // автоскрытие флэша
    if (flashHideTimerRef.current) {
      window.clearTimeout(flashHideTimerRef.current);
    }
    flashHideTimerRef.current = window.setTimeout(() => {
      setFlash(null);
      flashHideTimerRef.current = null;
    }, 3000);
  }, [mode, text, code, isMicMuted]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && mode === "text") {
      e.preventDefault();
      void handleSubmit();
    }
  }

  function onCodeKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void handleSubmit();
    }
  }

  return (
    <main className="min-h-screen app-bg relative flex flex-col items-center px-6 py-10">
      {/* Таймер — крупный бейдж, tabular-nums чтобы не прыгал */}
      <div className="fixed top-3 right-4 z-50">
        <div
          className="flex items-center gap-2 text-base md:text-lg font-semibold
                        text-brand-dark bg-white/85 dark:bg-neutral-900/80 rounded-full px-4 py-2 shadow-soft"
        >
          <Clock3 className="w-5 h-5 text-brand-deep" />
          <span className="font-mono tabular-nums">{formatTimer(timer)}</span>
        </div>
      </div>

      {/* ВЕРХ — Интервьюер / сцена */}
      <Card className="w-full max-w-5xl p-0 overflow-hidden mb-12 backdrop-blur-md">
        {/* “Видео/Аватар” сцена */}
        <div className="relative w-full aspect-[16/6] md:aspect-[16/5] bg-[color-mix(in_oklab,var(--color-light-blue),transparent_70%)]">
          {/* Плейсхолдер “живого” собеседника */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-brand-light to-brand-yellow/70 shadow-soft" />
          </div>

          {/* Динамик справа — белый фон с обводкой, мьют по клику */}
          <button
            type="button"
            onClick={toggleAI}
            className="absolute right-4 top-4"
            title={
              isAIMuted
                ? "Включить звук интервьюера"
                : "Выключить звук интервьюера"
            }
          >
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-soft bg-white border"
              style={{
                borderColor:
                  "color-mix(in oklab, var(--color-light-blue), transparent 50%)",
              }}
            >
              {isAIMuted ? (
                <VolumeX
                  className="w-6 h-6"
                  style={{
                    color:
                      "color-mix(in oklab, var(--color-gray-blue), transparent 20%)",
                  }}
                />
              ) : (
                <Volume2 className="w-6 h-6 text-brand-deep" />
              )}
            </div>
          </button>
        </div>

        {/* Заголовок интервьюера + вопрос */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge>
              <Bot className="w-4 h-4" />
              <span className="ml-1">Интервьюер</span>
            </Badge>
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-brand-dark mb-2">
            Вопрос
          </h2>
          <p className="text-base md:text-lg text-brand-gray-blue">
            {question}
          </p>
        </div>
      </Card>

      {/* ПРОМЕЖУТОК */}
      <div className="h-10 md:h-14" />

      {/* НИЖНЯЯ ЧАСТЬ — Кандидат */}
      <Card className="w-full max-w-5xl px-5 py-4 mb-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Badge>
            <User className="w-4 h-4" />
            <span className="ml-1">Кандидат</span>
          </Badge>

          {/* Микрофон — белый фон/обводка, цвет у иконки; мьют по клику */}
          <button
            type="button"
            onClick={toggleMic}
            title={isMicMuted ? "Включить микрофон" : "Выключить микрофон"}
            className="relative"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft bg-white border"
              style={{
                borderColor:
                  "color-mix(in oklab, var(--color-light-blue), transparent 50%)",
              }}
            >
              {isMicMuted ? (
                <MicOff
                  className="w-5 h-5"
                  style={{
                    color:
                      "color-mix(in oklab, var(--color-gray-blue), transparent 20%)",
                  }}
                />
              ) : (
                <Mic className="w-5 h-5 text-brand-deep" />
              )}
            </div>
          </button>
        </div>

        {micReady !== "ok" && (
          <Alert className="mt-3" variant="error">
            {micReady === "init"
              ? "Запрашиваем доступ к микрофону…"
              : "Микрофон недоступен — разрешите доступ в настройках браузера."}
          </Alert>
        )}
      </Card>

      {/* ПАНЕЛЬ ОТВЕТА — самая нижняя */}
      <Card className="w-full max-w-5xl p-5 md:p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-brand-gray-blue">
            {mode === "text"
              ? "Можно говорить и параллельно писать. Enter — отправить, Shift+Enter — перенос."
              : "Кодовый режим. ⌘/Ctrl + Enter — отправить."}
          </div>

          {/* Toolbar режимов и очистки */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className={`px-3 py-1.5 text-sm rounded-xl border transition ${
                mode === "text"
                  ? "btn-primary"
                  : "bg-white/80 border-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)] text-brand-deep"
              }`}
              onClick={() => setMode("text")}
              title="Текстовый режим"
            >
              <Type className="w-4 h-4 mr-1" />
              Текст
            </Button>

            <Button
              type="button"
              className={`px-3 py-1.5 text-sm rounded-xl border transition ${
                mode === "code"
                  ? "btn-primary"
                  : "bg-white/80 border-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)] text-brand-deep"
              }`}
              onClick={() => setMode("code")}
              title="Кодовый режим"
            >
              <Code2 className="w-4 h-4 mr-1" />
              Код
            </Button>

            <div className="mx-1 h-6 w-px bg-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)]" />

            <Button
              type="button"
              className="px-3 py-1.5 text-sm rounded-xl border bg-white/80 text-brand-deep
                         border-[color-mix(in_oklab,var(--color-light-blue),transparent_60%)]"
              onClick={() => (mode === "text" ? setText("") : setCode(""))}
              title="Очистить"
            >
              <Eraser className="w-4 h-4 mr-1" />
              Очистить
            </Button>
          </div>
        </div>

        {mode === "text" ? (
          <TextArea
            className="h-40 md:h-44 mb-4"
            placeholder="Напишите свой ответ…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
          />
        ) : (
          <TextArea
            className="h-44 md:h-56 mb-4 font-mono text-sm leading-6"
            spellCheck={false}
            placeholder={`// Пример кода\n// Подсказка: ⌘/Ctrl + Enter — отправить`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onCodeKeyDown}
          />
        )}

        {/* Флэш-уведомление об успешной отправке */}
        {flash && (
          <Alert className="mb-3" variant="success">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5" />
              <div>
                <div className="font-semibold">Отправлено</div>
                <pre className="mt-1 text-xs md:text-sm leading-5 whitespace-pre-wrap break-words font-mono">
                  {flash}
                </pre>
              </div>
            </div>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button className="btn-primary" onClick={() => void handleSubmit()}>
            Ответить
          </Button>
        </div>
      </Card>

      <div className="h-8" />
    </main>
  );
}
