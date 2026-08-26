import { getContent } from "@/lib/content";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Atmosphere } from "@/components/ui/atmosphere";
import { Cursor } from "@/components/ui/cursor";
import { GhostPortrait } from "@/components/ui/ghost-portrait";
import { Preloader } from "@/components/ui/preloader";
import { Header } from "@/components/layout/header";
import { SideRails } from "@/components/layout/side-rails";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Work } from "@/components/sections/work";
import { Stack } from "@/components/sections/stack";
import { Path } from "@/components/sections/path";
import { Contact } from "@/components/sections/contact";

/** Content is edited through /admin, so don't hold a stale page for long. */
export const revalidate = 60;

export default async function Home() {
  const { site, socials, projects } = await getContent();

  /** Structured data so search engines read the page as a person, not a blob. */
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.url,
    image: new URL(site.photo, site.url).toString(),
    address: { "@type": "PostalAddress", addressLocality: site.location },
    sameAs: socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
    knowsAbout: ["React", "Next.js", "TypeScript", "React Native", "Web Performance"],
    subjectOf: projects.map((project) => ({ "@type": "CreativeWork", name: project.title })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Preloader />
      <SmoothScroll />
      <Atmosphere />
      <GhostPortrait />
      <Cursor />
      <Header />
      <SideRails />
      <main className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Stack />
        <Path />
        <Contact />
      </main>
    </>
  );
}
