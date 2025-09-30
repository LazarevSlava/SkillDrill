import { useEffect } from "react";

/**
 * Централизованно блокирует прокрутку body, когда locked=true.
 * Корректно восстанавливает предыдущее значение при размонтировании/разблокировке.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    const body = document.body;
    if (!body) return;

    const prevOverflow = body.style.overflow;

    if (locked) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = prevOverflow || "";
    }

    return () => {
      body.style.overflow = prevOverflow || "";
    };
  }, [locked]);
}
