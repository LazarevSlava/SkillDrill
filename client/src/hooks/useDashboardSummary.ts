import * as React from "react";
import type { DashboardSummary } from "../shared/types";
import { fetchDashboardSummary } from "../api/dashboard";

export function useDashboardSummary() {
  const [data, setData] = React.useState<DashboardSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchDashboardSummary()
      .then((d) => {
        if (alive) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if (alive) setError(e?.message ?? "Request failed");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch: () => fetchDashboardSummary().then(setData),
  };
}
