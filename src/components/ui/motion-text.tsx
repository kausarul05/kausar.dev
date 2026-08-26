"use client";

import { type ElementType, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Reveal — a generic in-view fade + rise
 * ------------------------------------------------------------------ */
type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

export function Reveal({ children, delay = 0, y = 26, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * SplitLines — each line clipped, then pushed up into view
 * ------------------------------------------------------------------ */
const lineVariants: Variants = {
  hidden: { y: "115%", rotate: 4 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    transition: { duration: 1, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] },
  }),
};

type SplitLinesProps = {
  lines: readonly ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Animate on mount instead of waiting for the viewport. */
  immediate?: boolean;
};

export function SplitLines({
  lines,
  as: Tag = "div",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
}: SplitLinesProps) {
  const animateProps = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "-10% 0px" } };

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            custom={i + delay * 10}
            variants={lineVariants}
            initial="hidden"
            {...animateProps}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ *
 * SplitChars — per-character stagger, used for the hero name
 * ------------------------------------------------------------------ */
type SplitCharsProps = {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
};

export function SplitChars({
  text,
  className,
  charClassName,
  delay = 0,
  stagger = 0.035,
}: SplitCharsProps) {
  return (
    <span className={cn("inline-flex flex-wrap", className)} aria-label={text}>
      {text.split("").map((char, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em]">
          <motion.span
            className={cn("inline-block will-change-transform", charClassName)}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 1.05,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
