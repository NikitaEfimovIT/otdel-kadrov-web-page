import { useEffect, useState } from "react";

// Подсветка активного пункта навигации по скроллу (как в макете:
// IntersectionObserver, rootMargin -45%/-50%). Возвращает id активной секции.
export function useScrollSpy(ids: string[], ready: boolean): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ready || !("IntersectionObserver" in window)) return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, ready]);

  return active;
}
