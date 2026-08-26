"use client";

import { useMemo, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useContent } from "@/components/providers/content";

/** Ticks once a second; the snapshot is whole seconds so renders stay minimal. */
const subscribeToClock = (onChange: () => void) => {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
};
const getSeconds = () => Math.floor(Date.now() / 1000);
const getServerSeconds = () => 0;

/** Live clock in the site owner's timezone. Renders a placeholder on the server. */
export function LocalTime({ className }: { className?: string }) {
  const { site } = useContent();
  const seconds = useSyncExternalStore(subscribeToClock, getSeconds, getServerSeconds);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: site.timeZone,
      }),
    [site.timeZone],
  );

  return (
    <span className={className}>
      {seconds === 0 ? "--:--:--" : formatter.format(seconds * 1000)}
    </span>
  );
}

/**
 * Thin fixed rails on either side of the viewport: socials on the left,
 * a live local clock on the right. Desktop only — they'd crowd a phone.
 */
export function SideRails() {
  const { site, socials } = useContent();
  const city = site.location.split(",")[0]?.trim() || site.location;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed bottom-0 left-0 z-40 hidden w-16 flex-col items-center gap-6 pb-8 xl:flex"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-5">
          {socials.slice(0, 3).map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] tracking-[0.24em] text-dim uppercase transition-colors hover:text-acid"
              style={{ writingMode: "vertical-rl" }}
            >
              {social.label}
            </a>
          ))}
        </div>
        <span className="h-20 w-px bg-gradient-to-b from-line to-transparent" />
      </motion.div>

      <motion.div
        className="pointer-events-none fixed right-0 bottom-0 z-40 hidden w-16 flex-col items-center gap-6 pb-8 xl:flex"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.24em] text-dim uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {city} <LocalTime />
        </span>
        <span className="h-20 w-px bg-gradient-to-b from-line to-transparent" />
      </motion.div>
    </>
  );
}
