import { useEffect, useRef, type ReactNode } from "react";

export function RevealGrid({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = ref.current;
    if (!grid || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const cards = Array.from(grid.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset["reveal"] = "visible";
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    for (const [index, card] of cards.entries()) {
      card.style.setProperty("--card-delay", `${(index % 3) * 80}ms`);
      card.style.setProperty("--card-offset", `${index % 2 ? 20 : -20}px`);
      card.dataset["reveal"] = "pending";
      observer.observe(card);
    }
    const revealAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      cards.forEach((card) => {
        delete card.dataset["reveal"];
      });
    };
    // Keyboard navigation must never land on an invisible card.
    const onFocus = (event: FocusEvent) => {
      const card = cards.find((item) => item.contains(event.target as Node));
      if (card) {
        delete card.dataset["reveal"];
        observer.unobserve(card);
      }
    };
    motion.addEventListener("change", revealAll);
    grid.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", revealAll);
      grid.removeEventListener("focusin", onFocus);
      cards.forEach((card) => {
        delete card.dataset["reveal"];
      });
    };
  }, []);
  return (
    <div ref={ref} className={`reveal-grid ${className}`}>
      {children}
    </div>
  );
}
