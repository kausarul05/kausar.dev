"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useContent } from "@/components/providers/content";
import { cn } from "@/lib/utils";

/**
 * The headshot was shot on a light grey backdrop, which would sit as a bright
 * square on a near-black page. A radial mask fades its edges to nothing so the
 * face emerges out of the dark instead, and the colour is held back until hover.
 */
const EDGE_FADE =
  "radial-gradient(circle at 50% 41%, #000 52%, rgba(0,0,0,0.5) 70%, transparent 82%)";

export function Portrait({ className }: { className?: string }) {
  const { site } = useContent();

  return (
    <motion.div
      className={cn("group relative aspect-square w-full max-w-[340px]", className)}
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow pooled behind the head */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full opacity-25 blur-3xl transition-opacity duration-700 group-hover:opacity-45"
        style={{ background: "radial-gradient(circle, #6d4dff 0%, #ccff3d 120%)" }}
      />

      {/* Orbit ring, sitting outside the faded edge of the photo */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/8 transition-colors duration-700 group-hover:border-acid/25"
      />
      <div
        aria-hidden
        className="absolute inset-[7%] rounded-full border border-dashed border-white/6"
      />

      <div
        className="absolute inset-[10%]"
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        <Image
          src={site.photo}
          alt={`${site.name}, ${site.role}`}
          fill
          sizes="(min-width: 768px) 680px, 90vw"
          className="scale-105 rounded-full object-cover object-top grayscale-[0.3] contrast-[1.02] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:grayscale-0"
          priority={false}
        />
      </div>
    </motion.div>
  );
}

/** Tiny circular crop for inline use — the hero's availability pill. */
export function Avatar({ size = 22, className }: { size?: number; className?: string }) {
  const { site } = useContent();

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-white/15",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={site.photo}
        alt=""
        aria-hidden
        fill
        sizes="24px"
        className="object-cover object-top"
      />
    </span>
  );
}
