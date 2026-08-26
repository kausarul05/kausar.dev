"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Magnetic } from "@/components/ui/magnetic";
import { useContent } from "@/components/providers/content";
import { nav } from "@/content/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const { site, socials } = useContent();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("top");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > previous && latest > 320 && !menuOpen);
  });

  // Scroll spy over the section landmarks.
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Scroll progress rule */}
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-acid"
        style={{ scaleX: progress }}
      />

      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "transition-colors duration-500",
            scrolled && "border-b border-white/5 bg-void/60 backdrop-blur-xl",
          )}
        >
          <div className="container-x flex h-16 items-center justify-between gap-6 md:h-20">
            {/* Wordmark */}
            <a href="#top" className="group flex items-center gap-3" aria-label={site.name}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-acid" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-acid" />
              </span>
              <span className="font-mono text-xs tracking-[0.18em] uppercase">
                <span className="text-ink">{site.first}</span>
                <span className="text-dim">.dev</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/5"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative transition-colors",
                        active ? "text-acid" : "text-mute hover:text-ink",
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Magnetic strength={10} className="hidden md:inline-flex">
                <a
                  href="#contact"
                  className="group relative overflow-hidden rounded-full border border-acid/40 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-acid uppercase transition-colors hover:text-void"
                >
                  <span className="absolute inset-0 -z-0 translate-y-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative z-10">Hire me</span>
                </a>
              </Magnetic>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
              >
                <span className="flex flex-col gap-[5px]">
                  <motion.span
                    className="block h-px w-4 bg-ink"
                    animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0 }}
                  />
                  <motion.span
                    className="block h-px w-4 bg-ink"
                    animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0 }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-void/95 px-6 pt-24 pb-10 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="flex flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="display flex items-baseline gap-4 border-b border-white/5 py-5 text-4xl text-ink"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-[10px] text-dim">
                    0{i + 1}
                  </span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase hover:text-acid"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
