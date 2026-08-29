"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useContent } from "@/components/providers/content";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Tuning
 * ------------------------------------------------------------------ */

/**
 * How present the portrait is in each section — the whole point of the
 * component. It is loud in the hero, absent where it would get in the way, and
 * comes back at the end, so the face bookends the page instead of following you
 * around it.
 *
 *   about — the real 340px portrait lives there; two of the same face is worse
 *           than one
 *   work  — six bright gradient cards slide past; a face behind them is noise
 *
 * These multiply with REST_OPACITY, so 0.5 here reads as ~5% on screen, not
 * half. Anything below ~0.4 disappears entirely at rest.
 */
const PRESENCE: Record<string, number> = {
  top: 1,
  about: 0,
  work: 0,
  stack: 0.5,
  path: 0.5,
  contact: 0.85,
};

/** How present it is when the pointer is elsewhere, before PRESENCE scales it. */
const REST_OPACITY = "opacity-16";
/** How present it is inside the cursor's pool of light. */
const REVEAL_OPACITY = "opacity-80";
/** Radius of that pool, in px. */
const REVEAL_RADIUS = 230;
/** Rest opacity for reduced-motion visitors, who never get the reveal. */
const REDUCED_OPACITY = "opacity-25";

/**
 * Softens the headshot's light grey backdrop into the page. `closest-side`
 * keeps the fade fully inside the box — a farthest-corner gradient leaves a
 * visible rectangular edge along the top and sides.
 */
const EDGE_FADE =
  "radial-gradient(circle closest-side at 50% 44%, #000 38%, rgba(0,0,0,0.35) 66%, transparent 94%)";

/**
 * A fixed portrait behind the whole page, almost invisible until the pointer
 * passes over it. Two stacked copies of the same image: a faint base layer that
 * gives the composition weight, and a brighter one revealed through a radial
 * mask that trails the cursor. Section visibility comes from `PRESENCE`.
 *
 * It renders at page level rather than inside the hero because `position:
 * fixed` is trapped by any transformed ancestor, and the hero's wrapper is
 * transformed for its parallax.
 *
 * The source is only 400px square, so it is deliberately never shown at full
 * strength — at this opacity the softness reads as atmosphere rather than a
 * low-resolution photo.
 */
export function GhostPortrait() {
  const { site } = useContent();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Section presence, smoothed so crossings dissolve instead of snapping.
  const presence = useMotionValue(PRESENCE.top);
  const opacity = useSpring(presence, { stiffness: 55, damping: 22, mass: 0.8 });

  // Pointer position relative to this element, in px.
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const sx = useSpring(px, { stiffness: 140, damping: 22, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 140, damping: 22, mass: 0.6 });
  const revealMask = useMotionTemplate`radial-gradient(${REVEAL_RADIUS}px circle at ${sx}px ${sy}px, #000 0%, rgba(0,0,0,0.45) 45%, transparent 72%)`;

  // Which section owns the middle of the viewport?
  useEffect(() => {
    const sections = Object.keys(PRESENCE)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) presence.set(PRESENCE[current.target.id] ?? 0);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [presence]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      px.set(event.clientX - box.left);
      py.set(event.clientY - box.top);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ opacity }}
      // z-1 sits above the atmosphere layer and below `main`.
      className="pointer-events-none fixed top-1/2 -right-[10vw] z-[1] h-[46vh] w-[46vh] max-h-[560px] max-w-[560px] -translate-y-1/2 sm:-right-[2vw] md:h-[58vh] md:w-[58vh] xl:right-[4vw]"
    >
      <div
        className="relative h-full w-full"
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        {/* Base presence */}
        <Image
          src={site.photo}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 720px, 520px"
          className={cn(
            "object-cover object-top grayscale brightness-65 contrast-125",
            reduced ? REDUCED_OPACITY : REST_OPACITY,
          )}
        />

        {/* Revealed by the cursor */}
        {!reduced && (
          <motion.div
            className="absolute inset-0"
            style={{ maskImage: revealMask, WebkitMaskImage: revealMask }}
          >
            <Image
              src={site.photo}
              alt=""
              fill
              // Same URL as the base layer, so this shares its request — but
              // Next still wants the hint on every above-the-fold <Image>.
              priority
              sizes="(min-width: 768px) 720px, 520px"
              className={cn(
                "object-cover object-top grayscale-[0.15] brightness-90 contrast-110",
                REVEAL_OPACITY,
              )}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
