"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Mode = "hidden" | "idle" | "link" | "drag" | "view";

/**
 * A two-part cursor: a hard dot that tracks the pointer exactly, and a soft
 * ring that lags behind on a spring. Elements opt into a state with
 * `data-cursor="link" | "drag" | "view"`. It only wakes up on the first
 * pointer move from a fine pointer, so touch devices and reduced-motion
 * visitors keep the native cursor and never render either layer.
 */
export function Cursor() {
  const [mode, setMode] = useState<Mode>("hidden");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    // Hiding the native cursor is a DOM concern, not React state.
    document.documentElement.classList.add("custom-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target as HTMLElement | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor as
        | Mode
        | undefined;
      if (tagged) {
        setMode(tagged);
        return;
      }
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select",
      );
      setMode(interactive ? "link" : "idle");
    };

    const onLeave = () => setMode("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  if (mode === "hidden") return null;

  const label = mode === "view" ? "View" : mode === "drag" ? "Drag" : "";

  return (
    <>
      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] flex items-center justify-center rounded-full border border-acid/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "idle" ? 34 : mode === "link" ? 58 : 84,
          height: mode === "idle" ? 34 : mode === "link" ? 58 : 84,
          backgroundColor: mode === "idle" ? "rgba(204,255,61,0)" : "rgba(204,255,61,0.12)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {label && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-acid uppercase">
            {label}
          </span>
        )}
      </motion.div>

      {/* Exact dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[91] h-1.5 w-1.5 rounded-full bg-acid"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: mode === "idle" ? 1 : 0, scale: mode === "idle" ? 1 : 0.4 }}
        transition={{ duration: 0.18 }}
      />
    </>
  );
}
