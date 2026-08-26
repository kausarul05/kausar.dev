"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/components/providers/content";
import type { Project } from "@/lib/schemas";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

/**
 * The work section scrolls sideways. The outer element is tall enough to
 * cover the full track width; the inner panel sticks to the viewport and
 * the track is translated on X against the section's own scroll progress.
 */
export function Work() {
  const { projects, site, socials } = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const progressScale = useTransform(smooth, [0, 1], [0.04, 1]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {/* Section head */}
        <div className="container-x mb-8 flex items-end justify-between gap-6 md:mb-12">
          <div>
            <span className="kicker">02 — Selected work</span>
            <h2 className="display mt-4 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">
              Things I&apos;ve
              <span className="serif-accent text-acid"> shipped</span>
            </h2>
          </div>
          <p className="hidden max-w-[15rem] font-mono text-[10px] leading-relaxed tracking-[0.14em] text-dim uppercase md:block">
            Scroll to move sideways
            <br />
            {String(projects.length).padStart(2, "0")} projects
          </p>
        </div>

        {/* Horizontal track */}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 px-5 md:gap-8 md:px-10 xl:px-16">
          {projects.map((project, i) => (
            <Card key={project.id} project={project} index={i} total={projects.length} />
          ))}
          <OutroCard
            edition={site.edition}
            github={socials.find((s) => s.label.toLowerCase() === "github")?.href ?? site.url}
            handle={socials.find((s) => s.label.toLowerCase() === "github")?.handle ?? "GitHub"}
          />
        </motion.div>

        {/* Progress rule */}
        <div className="container-x mt-10 md:mt-14">
          <div className="relative h-px w-full bg-white/8">
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left bg-acid"
              style={{ scaleX: progressScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tags past this count collapse into a +n chip so the card never reflows. */
const MAX_TAGS = 5;

/** Play Store links deserve their own wording on the card's action row. */
function linkLabel(href: string): string {
  if (/play\.google\.com/.test(href)) return "Google Play";
  if (/apps\.apple\.com/.test(href)) return "App Store";
  return "Visit site";
}

function Card({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const [from, to] = project.accent;
  const live = Boolean(project.href);
  const Shell = live ? "a" : "article";

  return (
    <Shell
      {...(live
        ? { href: project.href, target: "_blank", rel: "noreferrer noopener" }
        : {})}
      data-cursor={live ? "view" : undefined}
      className="group relative flex h-[64svh] max-h-[620px] w-[85vw] shrink-0 flex-col overflow-hidden rounded-[26px] border border-white/8 bg-panel/70 backdrop-blur-md transition-colors duration-500 hover:border-white/16 sm:w-[70vw] md:h-[70svh] md:w-[560px]"
    >
      {/* Screenshot, tinted with the project's accents — or just the gradient. */}
      <div className="relative h-[38%] shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
        >
          {project.image && (
            <Image
              src={project.image}
              alt=""
              fill
              sizes="560px"
              className="object-cover object-top"
            />
          )}
        </div>

        {project.image ? (
          <>
            {/* Pulls the bright shots into the page's palette. */}
            <div
              className="absolute inset-0 opacity-45 mix-blend-color"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/55 to-void/25" />
          </>
        ) : (
          <>
            <div className="dot-grid absolute inset-0 opacity-40 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/40 to-transparent" />
          </>
        )}

        <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
          <div className="flex items-start justify-between">
            <span
              className={cn(
                "font-mono text-[10px] tracking-[0.2em] uppercase",
                project.image ? "text-ink/70" : "text-void/70",
              )}
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            {project.status && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 font-mono text-[9px] tracking-[0.16em] uppercase backdrop-blur-sm",
                  project.image
                    ? "bg-void/50 text-ink"
                    : "bg-void/25 text-void",
                )}
              >
                {project.status}
              </span>
            )}
          </div>
          <span
            className={cn(
              "display text-[2.6rem] leading-none md:text-[3.2rem]",
              project.image ? "text-ink drop-shadow-[0_2px_18px_rgba(5,6,10,0.85)]" : "text-void/85",
            )}
          >
            {project.title}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:p-7">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lg font-medium tracking-[-0.01em] text-ink">{project.subtitle}</h3>
            <span className="font-mono text-[10px] tracking-[0.16em] text-dim">{project.year}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mute">{project.summary}</p>

          <ul className="mt-5 space-y-1.5">
            {project.highlights.map((point) => (
              <li key={point} className="flex gap-2.5 text-[13px] leading-snug text-mute/90">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: to }} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, MAX_TAGS).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-mute transition-colors group-hover:border-white/14"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > MAX_TAGS && (
              <span className="rounded-full border border-white/8 px-2.5 py-1 font-mono text-[10px] text-dim">
                +{project.tags.length - MAX_TAGS}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-4">
            <span className="font-mono text-[10px] tracking-[0.18em] text-dim uppercase">
              {project.role}
            </span>
            <span className="flex items-center gap-2 text-mute transition-colors group-hover:text-acid">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                {live ? linkLabel(project.href) : "Case study"}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function OutroCard({
  edition,
  github,
  handle,
}: {
  edition: string;
  github: string;
  handle: string;
}) {
  return (
    <div className="flex h-[64svh] max-h-[620px] w-[85vw] shrink-0 flex-col items-center md:h-[70svh] justify-center gap-6 rounded-[26px] border border-dashed border-white/10 px-8 text-center sm:w-[70vw] md:w-[420px]">
      <p className="serif-accent text-3xl text-ink">More on GitHub</p>
      <p className="max-w-[22rem] text-sm leading-relaxed text-mute">
        Experiments, half-finished ideas and the commits behind everything above.
      </p>
      <Magnetic strength={16}>
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-3 rounded-full border border-white/12 px-6 py-3 transition-colors hover:border-acid/50"
        >
          <GithubMark className="h-4 w-4 text-mute transition-colors group-hover:text-acid" />
          <span className="font-mono text-[11px] tracking-[0.16em] text-ink uppercase">
            {handle}
          </span>
        </a>
      </Magnetic>
      <span className="kicker mt-2">{edition}</span>
    </div>
  );
}

/** GitHub mark — lucide dropped brand icons in v1, so it lives here. */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}
