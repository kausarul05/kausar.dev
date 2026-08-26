"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CountUp } from "@/components/ui/count-up";
import { Reveal } from "@/components/ui/motion-text";
import { Portrait } from "@/components/ui/portrait";
import { useContent } from "@/components/providers/content";

export function About() {
  const { about, site } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = about.body.split(" ");

  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="container-x">
        <Reveal className="mb-14 flex items-center gap-5">
          <span className="kicker whitespace-nowrap">{about.kicker}</span>
          <span className="hairline" />
        </Reveal>

        {/* Scroll-lit paragraph */}
        <div ref={ref} className="max-w-5xl">
          <p className="flex flex-wrap text-[1.6rem] leading-[1.35] font-medium tracking-[-0.02em] md:text-[2.6rem] md:leading-[1.25]">
            {words.map((word, i) => (
              <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1.6) / words.length]}>
                {word}
              </Word>
            ))}
          </p>
        </div>

        {/* Portrait + aside */}
        <div className="mt-16 grid items-center gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Portrait />
          </div>

          <div className="md:col-span-8 md:col-start-5">
            <Reveal delay={0.1}>
              <p className="border-l border-acid/40 pl-5 text-lg leading-relaxed text-mute md:text-xl">
                {about.note}
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="kicker">{site.name}</span>
              <span className="kicker">{site.location}</span>
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-[11px] tracking-[0.14em] text-mute lowercase transition-colors hover:text-acid"
              >
                {site.email}
              </a>
            </Reveal>
          </div>
        </div>

        {/* What hiring me actually solves */}
        {about.solves.length > 0 && (
          <div className="mt-24">
            <Reveal className="mb-10 flex items-center gap-5">
              <span className="kicker whitespace-nowrap">What I solve</span>
              <span className="hairline" />
            </Reveal>

            <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
              {about.solves.map((solve, i) => (
                <motion.div
                  key={solve.title}
                  className="group border-t border-white/8 pt-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12% 0px" }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-acid">
                      0{i + 1}
                    </span>
                    <h3 className="text-xl leading-snug font-medium tracking-[-0.015em] text-ink md:text-2xl">
                      {solve.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-lg pl-[calc(0.75rem+1ch)] text-[15px] leading-relaxed text-mute">
                    {solve.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/5 md:grid-cols-4">
          {about.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative bg-void/80 p-6 md:p-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="absolute inset-0 bg-gradient-to-b from-acid/8 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="display text-4xl text-ink md:text-5xl">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-dim uppercase">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One word of the paragraph, lit as the section scrolls past. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(progress, range, ["#5a6072", "#eceef5"]);

  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span style={{ opacity, color }}>{children}</motion.span>
    </span>
  );
}
