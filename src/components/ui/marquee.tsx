"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: readonly string[];
  baseSpeed?: number;
  className?: string;
};

/**
 * An infinite ticker that reads scroll velocity: it speeds up while you
 * scroll, flips direction when you scroll back, and skews slightly into
 * the movement. Falls back to a still row for reduced motion.
 */
export function Marquee({ items, baseSpeed = 2.2, className }: MarqueeProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1400], [0, 4], { clamp: false });
  const skew = useTransform(smoothVelocity, [-1600, 0, 1600], [-6, 0, 6], { clamp: true });

  // One copy of the row is 25% of the track (four copies rendered).
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = direction.current * baseSpeed * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    move += move * factor;
    baseX.set(baseX.get() + move);
  });

  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8 px-8">
          <span>{item}</span>
          <span className="text-acid/70 text-xl leading-none">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <motion.div
      aria-hidden
      className={cn("overflow-hidden", className)}
      style={{ skewX: reduced ? 0 : skew }}
    >
      <motion.div className="flex w-max flex-nowrap" style={{ x: reduced ? "0%" : x }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </motion.div>
  );
}
