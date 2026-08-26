"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitChars } from "@/components/ui/motion-text";
import { Avatar } from "@/components/ui/portrait";
import { LocalTime } from "@/components/layout/side-rails";
import { useContent } from "@/components/providers/content";

export function Hero() {
  const { site, projects } = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(8px)"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-between pt-24 pb-8 md:pt-32"
    >
      <motion.div
        style={{ y, opacity, filter: blur }}
        className="container-x relative z-10 flex-1"
      >
        {/* Meta row */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="kicker">Portfolio — {site.edition}</span>
          <span className="kicker hidden sm:block">{site.location}</span>
          <span className="kicker flex items-center gap-2">
            <LocalTime />
            <span className="text-line">/</span>
            Local time
          </span>
        </motion.div>

        {/* Name lockup */}
        <div className="pt-[4vh] pb-5 md:pt-[7vh]">
          <h1 className="display text-[clamp(3rem,12.5vw,12rem)] text-ink">
            <span className="block">
              <SplitChars text={site.first} delay={0.35} />
            </span>
            <span className="group block cursor-default">
              <span
                className="inline-block transition-[color,-webkit-text-stroke-color] duration-500 group-hover:text-acid"
                style={{
                  WebkitTextStroke: "1.5px rgba(236,238,245,0.55)",
                  color: "transparent",
                }}
              >
                <SplitChars text={site.last} delay={0.55} />
              </span>
              <span className="serif-accent ml-3 align-super text-[0.16em] text-dim md:ml-5">
                ({String(projects.length).padStart(2, "0")} works)
              </span>
            </span>
          </h1>
        </div>

        {/* Sub row */}
        <div className="grid gap-7 border-t border-white/5 pt-6 md:grid-cols-12 md:gap-6">
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[1.35rem] leading-[1.25] text-ink md:text-[1.7rem]">
              <span className="serif-accent text-acid">Frontend engineer</span>{" "}
              <span className="text-mute">&amp; interface craftsman</span>
            </p>
          </motion.div>

          <motion.p
            className="max-w-md text-[0.95rem] leading-relaxed text-mute md:col-span-4 md:col-start-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {site.tagline}
          </motion.p>

          <motion.div
            className="flex items-start md:col-span-2 md:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {site.available && (
              <span className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5">
                <Avatar size={26} />
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse-ring absolute inset-0 rounded-full bg-acid" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-acid" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.16em] text-ink uppercase">
                  {site.availableLabel}
                </span>
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div className="container-x relative z-10" style={{ opacity }}>
        <motion.div
          className="flex items-end justify-between pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Magnetic strength={14}>
            <a
              href="#about"
              className="group flex items-center gap-3 text-mute transition-colors hover:text-acid"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-acid/50">
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDownRight className="h-4 w-4" />
                </motion.span>
              </span>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Scroll</span>
            </a>
          </Magnetic>

          <span className="kicker hidden text-right sm:block">
            React · Next.js · TypeScript
            <br />
            Web &amp; mobile
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
