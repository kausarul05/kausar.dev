"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Everything that lives behind the content: drifting aurora blobs, a dot
 * grid, a soft spotlight that trails the pointer, a vignette and film grain.
 * All of it is `pointer-events-none` and sits at the bottom of the stack.
 */
export function Atmosphere() {
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const x = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const xPct = useTransform(x, (v) => `${(v * 100).toFixed(2)}%`);
  const yPct = useTransform(y, (v) => `${(v * 100).toFixed(2)}%`);
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${xPct} ${yPct}, rgba(255,255,255,0.055), transparent 70%)`;

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      mx.set(event.clientX / window.innerWidth);
      my.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Aurora */}
      <div className="absolute inset-0">
        <div
          className="animate-drift absolute -top-[30vh] -left-[15vw] h-[70vh] w-[70vw] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, #6d4dff 0%, transparent 65%)" }}
        />
        <div
          className="animate-drift absolute top-[35vh] -right-[20vw] h-[65vh] w-[65vw] rounded-full opacity-20 blur-[130px]"
          style={{
            background: "radial-gradient(circle, #3ddcff 0%, transparent 65%)",
            animationDelay: "-8s",
          }}
        />
        <div
          className="animate-drift absolute -bottom-[25vh] left-[25vw] h-[55vh] w-[55vw] rounded-full opacity-15 blur-[140px]"
          style={{
            background: "radial-gradient(circle, #ccff3d 0%, transparent 65%)",
            animationDelay: "-16s",
          }}
        />
      </div>

      {/* Dot grid, faded toward the edges */}
      <div
        className="dot-grid absolute inset-0 opacity-60"
        style={{
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 78%)",
        }}
      />

      {/* Pointer spotlight */}
      {!reduced && <motion.div className="absolute inset-0" style={{ background: spotlight }} />}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 90% at 50% 0%, transparent 42%, #05060a 100%)",
        }}
      />

      {/* Film grain */}
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
        <svg className="h-full w-full">
          <filter id="grain-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.82"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-filter)" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
}
