import { useEffect, useRef, useState } from "react";

/** Counts once per page visit when visible; assistive technology reads the final value. */
export function AnimatedStat({ value }: { value: number | string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    let frame = 0;
    let started = false;
    setProgress(0);
    const finish = () => {
      cancelAnimationFrame(frame);
      setProgress(1);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = Math.min(1, (now - start) / 850);
          setProgress(1 - Math.pow(1 - elapsed, 3));
          if (elapsed < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    const onMotionChange = () => {
      if (motion.matches) {
        observer.disconnect();
        finish();
      }
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", onMotionChange);
    };
  }, [value]);

  const finalValue = String(value);
  const displayed = finalValue.replace(/\d+/g, (number) =>
    String(Math.round(Number(number) * progress)),
  );
  return (
    <span ref={ref} className="inline-grid tabular-nums">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {finalValue}
      </span>
      <span className="col-start-1 row-start-1" aria-hidden="true">
        {displayed}
      </span>
      <span className="sr-only">{finalValue}</span>
    </span>
  );
}
