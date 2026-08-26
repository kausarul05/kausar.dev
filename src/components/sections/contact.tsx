"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal, SplitLines } from "@/components/ui/motion-text";
import { LocalTime } from "@/components/layout/side-rails";
import { useContent } from "@/components/providers/content";

export function Contact() {
  const { contact, site, socials } = useContent();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the mailto link next to it still works.
    }
  };

  return (
    <section id="contact" className="relative pt-24 md:pt-32">
      <div className="container-x">
        <Reveal className="mb-14 flex items-center gap-5">
          <span className="kicker whitespace-nowrap">{contact.kicker}</span>
          <span className="hairline" />
        </Reveal>

        <SplitLines
          as="h2"
          className="display text-[clamp(2.6rem,9vw,8rem)] text-ink"
          lines={[
            contact.headline,
            <span key="accent" className="serif-accent text-acid">
              {contact.headlineAccent}
            </span>,
          ]}
        />

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-mute">{contact.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic strength={14}>
                <a
                  href={`mailto:${site.email}`}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-acid px-7 py-4 text-void"
                >
                  <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative z-10 font-mono text-[11px] tracking-[0.16em] uppercase">
                    Start a project
                  </span>
                  <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Magnetic>

              <button
                type="button"
                onClick={copyEmail}
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/12 px-5 py-4 transition-colors hover:border-acid/45"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-acid" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-dim transition-colors group-hover:text-acid" />
                )}
                <span className="font-mono text-[11px] tracking-[0.12em] text-mute lowercase">
                  {copied ? "copied!" : site.email}
                </span>
              </button>
            </div>
          </div>

          {/* Socials */}
          <div className="md:col-span-6 md:col-start-7">
            <ul>
              {socials.map((social, i) => (
                <motion.li
                  key={social.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group relative flex items-center justify-between gap-4 overflow-hidden border-b border-white/8 py-5"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-white/[0.04] transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                    <span className="relative flex items-baseline gap-4">
                      <span className="font-mono text-[10px] text-dim">0{i + 1}</span>
                      <span className="text-xl text-ink transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">
                        {social.label}
                      </span>
                    </span>
                    <span className="relative flex items-center gap-4">
                      <span className="hidden font-mono text-[11px] text-dim sm:block">
                        {social.handle}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-dim transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid" />
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer edition={site.edition} name={site.name} location={site.location} />
    </section>
  );
}

function Footer({
  edition,
  name,
  location,
}: {
  edition: string;
  name: string;
  location: string;
}) {
  const city = location.split(",")[0]?.trim() || location;

  return (
    <footer className="container-x mt-24 border-t border-white/8 py-8 md:mt-32">
      <div className="flex flex-col-reverse items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="kicker">
          © {edition} {name} — Built with Next.js
        </p>

        <div className="flex flex-wrap items-center gap-6">
          <span className="kicker flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-acid" />
            {city} <LocalTime />
          </span>
          <a
            href="#top"
            className="font-mono text-[11px] tracking-[0.16em] text-mute uppercase transition-colors hover:text-acid"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
