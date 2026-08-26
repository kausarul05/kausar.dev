"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { useContent } from "@/components/providers/content";

type Phase = "loading" | "leaving" | "gone";

const COUNT_S = 1.7;
const LEAVE_MS = 1000;
const SEEN_KEY = "intro-seen";

/** Nothing writes the flag while the curtain is on screen, so no subscription. */
const noSubscription = () => () => {};
const hasSeenIntro = () => sessionStorage.getItem(SEEN_KEY) !== null;
const notSeenOnServer = () => false;

/**
 * First-paint curtain: a counter ticks to 100 while a rule fills across the
 * screen, then the whole panel lifts away. Shown once per tab session.
 *
 * The exit is driven by an explicit phase rather than AnimatePresence — a
 * fixed-position curtain gets wrapped in a layout-measuring shim there, and
 * the lift never runs.
 */
export function Preloader() {
  const { site } = useContent();
  const reduced = useReducedMotion();
  const seen = useSyncExternalStore(noSubscription, hasSeenIntro, notSeenOnServer);
  const [phase, setPhase] = useState<Phase>("loading");
  const [count, setCount] = useState(0);

  const skip = seen || Boolean(reduced);

  // Count to 100, then hand over to the leaving phase.
  useEffect(() => {
    if (skip || phase !== "loading") return;

    document.body.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: COUNT_S,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });

    // Timed rather than driven off the animation's completion callback, so a
    // dropped callback can never leave the curtain stuck over the page.
    const handoff = setTimeout(() => setPhase("leaving"), COUNT_S * 1000 + 280);

    return () => {
      controls.stop();
      clearTimeout(handoff);
    };
  }, [skip, phase]);

  // Unmount once the curtain has finished lifting, and give scrolling back.
  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.style.overflow = "";
    const id = setTimeout(() => {
      sessionStorage.setItem(SEEN_KEY, "1");
      setPhase("gone");
    }, LEAVE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (skip || phase === "gone") return null;

  const leaving = phase === "leaving";

  return (
    <motion.div
      className="intro-curtain fixed inset-0 z-[100] flex flex-col justify-between bg-void px-6 py-8 md:px-12 md:py-12"
      initial={{ y: "0%" }}
      animate={{ y: leaving ? "-100%" : "0%" }}
      transition={{ duration: LEAVE_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="flex items-start justify-between"
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="kicker">{site.name}</span>
        <span className="kicker">Portfolio · {site.edition}</span>
      </motion.div>

      <div className="flex items-end justify-between gap-6">
        <motion.span
          className="display text-[22vw] leading-[0.8] text-ink md:text-[14vw]"
          animate={{ opacity: leaving ? 0 : 1, y: leaving ? 40 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {String(count).padStart(3, "0")}
        </motion.span>
        <motion.span
          className="kicker mb-4 hidden md:block"
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Loading experience
        </motion.span>
      </div>

      <div className="relative h-px w-full bg-line">
        <div className="absolute inset-y-0 left-0 bg-acid" style={{ width: `${count}%` }} />
      </div>
    </motion.div>
  );
}
