import Button from "../../components/ui/Button";

type Props = {
  creatingNew: boolean;
  onCreateNew: () => void;
};

export default function DashboardHeader({ creatingNew, onCreateNew }: Props) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[color:var(--color-deep-blue)]">
          Твой дэшборд
        </h1>
        <p className="mt-1 text-[color:var(--color-gray-blue)]">
          Продолжай откуда остановился…
        </p>
      </div>
      <div className="flex gap-3">
        <Button as="a" href="#progress" variant="outline">
          Смотреть прогресс
        </Button>
        <Button
          variant="primary"
          onClick={onCreateNew}
          isLoading={creatingNew}
          disabled={creatingNew}
        >
          {creatingNew ? "Создаю…" : "Создать новую сессию"}
        </Button>
      </div>
    </header>
  );
}
