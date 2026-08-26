"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/ui/motion-text";
import { useContent } from "@/components/providers/content";

export function Path() {
  const { path } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.65"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="path" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mb-14 flex items-center gap-5">
          <span className="kicker whitespace-nowrap">04 — Path</span>
          <span className="hairline" />
        </Reveal>

        <Reveal className="mb-16 max-w-3xl">
          <h2 className="display text-[clamp(2.2rem,6vw,4.5rem)] text-ink">
            How I got
            <span className="serif-accent text-acid"> here</span>
          </h2>
        </Reveal>

        <div ref={ref} className="relative pl-8 md:pl-0">
          {/* Rail */}
          <div className="absolute top-2 bottom-2 left-[3px] w-px bg-white/8 md:left-[calc(25%+3px)]">
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-acid via-cyan to-violet"
              style={{ scaleY }}
            />
          </div>

          <div className="space-y-14 md:space-y-20">
            {path.map((entry, i) => (
              <motion.div
                key={entry.id}
                className="relative grid gap-4 md:grid-cols-4 md:gap-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-18% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Node */}
                <span className="absolute top-2 -left-8 flex h-[9px] w-[9px] items-center justify-center md:left-[calc(25%-1px)]">
                  <span className="absolute h-[9px] w-[9px] rounded-full bg-void ring-1 ring-white/20" />
                  <motion.span
                    className="relative h-[9px] w-[9px] rounded-full bg-acid shadow-[0_0_12px_2px_rgba(204,255,61,0.45)]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-18% 0px" }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>

                <div className="md:col-span-1 md:pr-10 md:text-right">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-acid uppercase">
                    {entry.period}
                  </span>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                    {entry.location}
                  </p>
                </div>

                <div className="md:col-span-3 md:pl-10">
                  <h3 className="text-xl font-medium tracking-[-0.015em] text-ink md:text-2xl">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm text-mute">{entry.org}</p>
                  <ul className="mt-5 space-y-2.5">
                    {entry.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-mute">
                        <span className="mt-[10px] h-px w-4 shrink-0 bg-white/20" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
