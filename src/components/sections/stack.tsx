"use client";

import { motion } from "motion/react";
import { Reveal } from "@/components/ui/motion-text";
import { Marquee } from "@/components/ui/marquee";
import { useContent } from "@/components/providers/content";

export function Stack() {
  const { stack, marquee } = useContent();

  return (
    <section id="stack" className="relative py-24 md:py-32">
      {/* Velocity ticker */}
      <div className="relative border-y border-white/6 py-6 md:py-8">
        <Marquee
          items={marquee}
          className="display text-[clamp(1.8rem,5vw,3.4rem)] text-ink/25 select-none"
        />
      </div>

      <div className="container-x pt-24 md:pt-32">
        <Reveal className="mb-14 flex items-center gap-5">
          <span className="kicker whitespace-nowrap">03 — Stack</span>
          <span className="hairline" />
        </Reveal>

        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display sticky top-28 text-[clamp(2.2rem,5.5vw,4rem)] text-ink">
              Tools I
              <br />
              <span className="serif-accent text-acid">reach for</span>
            </h2>
          </div>

          <div className="md:col-span-8">
            {stack.map((group, gi) => (
              <motion.div
                key={group.id}
                className="group/row border-t border-white/8 py-7 first:border-t-0 first:pt-0"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.7, delay: gi * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                    0{gi + 1}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-mute uppercase">
                    {group.group}
                  </span>
                  <span className="h-px flex-1 bg-white/6" />
                </div>

                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="inline-flex cursor-default items-center rounded-lg border border-white/8 bg-white/[0.025] px-3.5 py-2 text-[13px] text-mute opacity-100 transition-all duration-300 group-hover/row:opacity-45 hover:-translate-y-0.5 hover:border-acid/40 hover:bg-acid/8 hover:text-acid hover:opacity-100">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
