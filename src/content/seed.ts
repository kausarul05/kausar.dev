import type { Content } from "@/lib/schemas";

/**
 * The starting content, and the fallback the site renders from when MongoDB is
 * empty or unreachable. `npm run seed` copies this into the database; after
 * that the admin panel is the place to edit, not this file.
 */
export const seed: Content = {
  site: {
    name: "Kausarul Islam",
    first: "Kausarul",
    last: "Islam",
    role: "Frontend Engineer",
    tagline:
      "I design and build interfaces that feel alive — fast, accessible, and finished down to the last frame.",
    location: "Dhaka, Bangladesh",
    timeZone: "Asia/Dhaka",
    edition: "2026",
    email: "kauserulislam0055@gmail.com",
    available: true,
    availableLabel: "Open to work",
    url: "https://kausarul.dev",
    photo: "/kausarul.jpg",
  },

  about: {
    kicker: "01 — About",
    body:
      "I'm a frontend engineer from Dhaka who cares about the last ten percent — the part where the layout stops shifting, the transition stops stuttering, and the product finally feels intentional. I live in React and TypeScript, I ship on Next.js, and I would rather build one small thing that feels perfect than ten that feel rushed.",
    note:
      "These days that means logistics platforms, commerce apps and SaaS dashboards — on the web and on mobile.",
    stats: [
      { value: 6, suffix: "+", label: "Products shipped" },
      { value: 4, suffix: "yrs", label: "Building for the web" },
      { value: 16, suffix: "", label: "Next.js version I ship on" },
      { value: 98, suffix: "", label: "Typical Lighthouse score" },
    ],
  },

  contact: {
    kicker: "05 — Contact",
    headline: "Let's build something",
    headlineAccent: "worth shipping",
    body:
      "Got a product that needs the frontend it deserves? I'm taking on new work — full builds, redesigns, or joining a team that cares about craft.",
  },

  socials: [
    { label: "GitHub", handle: "@kausarul05", href: "https://github.com/kausarul05" },
    { label: "LinkedIn", handle: "in/kausarul05", href: "https://linkedin.com/in/kausarul05" },
    { label: "X", handle: "@kausarul05", href: "https://x.com/kausarul05" },
    { label: "Email", handle: "kauserulislam0055@gmail.com", href: "mailto:kauserulislam0055@gmail.com" },
  ],

  marquee: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
    "Motion",
    "React Native",
    "Node.js",
    "Accessibility",
    "Performance",
    "Design Systems",
  ],

  projects: [
    {
      id: "seed-lawapan",
      title: "LAWAPAN",
      subtitle: "Logistics marketplace",
      year: "2026",
      role: "Lead Frontend",
      status: "In production",
      summary:
        "A freight platform where shippers post loads and transporters bid on them. Live GPS tracking on the map, real-time bid updates over sockets, generated PDF invoices, and a full admin control tower on top.",
      highlights: [
        "Separate dashboards for shippers and transporters",
        "Live tracking with Google Maps + Leaflet",
        "Socket.IO bidding and a multi-language UI",
      ],
      tags: ["Next.js 16", "React Three Fiber", "Google Maps", "Leaflet", "Socket.IO", "jsPDF"],
      accentFrom: "#6d4dff",
      accentTo: "#3ddcff",
      accent: ["#6d4dff", "#3ddcff"],
      href: "",
      repo: "",
    },
    {
      id: "seed-dealnux",
      title: "Dealnux",
      subtitle: "Multi-vendor commerce app",
      year: "2026",
      role: "Mobile Engineer",
      status: "Shipped to store",
      summary:
        "A cross-platform shopping app that aggregates products from third-party marketplaces, watches prices in the background, and pings you the moment something you saved drops.",
      highlights: [
        "Seller tools plus external marketplace aggregation",
        "Stripe checkout, Google and Apple sign-in",
        "Price-drop watcher with push notifications",
      ],
      tags: ["Expo", "React Native", "TypeScript", "Stripe", "Firebase FCM", "NativeWind"],
      accentFrom: "#ccff3d",
      accentTo: "#3ddcff",
      accent: ["#ccff3d", "#3ddcff"],
      href: "",
      repo: "",
    },
    {
      id: "seed-finderq",
      title: "FinderQ",
      subtitle: "Teammate finder for gamers",
      year: "2026",
      role: "Frontend Engineer",
      status: "In production",
      summary:
        "A region-aware platform for finding players to queue with. It pulls live rank data from the Riot API, runs a role-based community layer, and moves like a game menu instead of a website.",
      highlights: [
        "Ten regional routes — NA, EUW, KR, BR, OCE and more",
        "Riot API rank sync on top of Supabase auth",
        "GSAP hero with Framer Motion page transitions",
      ],
      tags: ["Next.js", "Tailwind v4", "GSAP", "Framer Motion", "Supabase", "Zustand", "shadcn/ui"],
      accentFrom: "#ff5fa2",
      accentTo: "#6d4dff",
      accent: ["#ff5fa2", "#6d4dff"],
      href: "",
      repo: "",
    },
    {
      id: "seed-ultimo",
      title: "Ultimo Bots",
      subtitle: "Automation SaaS",
      year: "2026",
      role: "Frontend Engineer",
      status: "In production",
      summary:
        "Marketing site and product dashboard for a bot automation service — pricing, referrals, resources, and a drag-and-drop builder where users arrange their own automation stacks.",
      highlights: [
        "Marketing surface and gated dashboard in one app",
        "Drag-and-drop composer built on dnd-kit",
        "Type-safe forms with React Hook Form and Zod",
      ],
      tags: ["Next.js 16", "dnd-kit", "Radix UI", "React Hook Form", "Zod", "React Compiler"],
      accentFrom: "#3ddcff",
      accentTo: "#ccff3d",
      accent: ["#3ddcff", "#ccff3d"],
      href: "",
      repo: "",
    },
    {
      id: "seed-modhughor",
      title: "Dada Bhai Modhughor",
      subtitle: "Organic storefront",
      year: "2026",
      role: "Design Engineer",
      status: "In build",
      summary:
        "A bilingual storefront for natural honey, nuts, dates and ghee. Built design-first on a mock data layer so the whole shopping flow could be felt and refined before the database existed.",
      highlights: [
        "Bangla and English product catalogue",
        "Zustand cart with persisted state",
        "Fully typed, tsc-clean codebase",
      ],
      tags: ["Next.js 16", "shadcn/ui", "Zustand", "Zod", "TypeScript", "Sonner"],
      accentFrom: "#ffb03d",
      accentTo: "#ccff3d",
      accent: ["#ffb03d", "#ccff3d"],
      href: "",
      repo: "",
    },
    {
      id: "seed-velki",
      title: "Velki Agent List",
      subtitle: "Content & SEO platform",
      year: "2026",
      role: "Frontend Engineer",
      status: "Shipped",
      summary:
        "An MDX-driven directory tuned for search. Static generation, critical CSS inlining, structured metadata and analytics wired in — built to load instantly on slow mobile connections.",
      highlights: [
        "MDX content pipeline with gray-matter",
        "Critical CSS inlining for a faster first paint",
        "Vercel Analytics with third-party script control",
      ],
      tags: ["Next.js 16", "MDX", "Tailwind", "Vercel Analytics", "SEO"],
      accentFrom: "#8b90a0",
      accentTo: "#3ddcff",
      accent: ["#8b90a0", "#3ddcff"],
      href: "",
      repo: "",
    },
  ],

  stack: [
    {
      id: "seed-core",
      group: "Core",
      items: ["TypeScript", "JavaScript", "React 19", "Next.js 16", "HTML", "CSS"],
    },
    {
      id: "seed-styling",
      group: "Styling & Motion",
      items: ["Tailwind CSS v4", "Framer Motion", "GSAP", "Radix UI", "shadcn/ui", "Lenis"],
    },
    {
      id: "seed-data",
      group: "Data & State",
      items: ["Zustand", "TanStack Query", "Zod", "React Hook Form", "Axios", "Socket.IO"],
    },
    {
      id: "seed-mobile",
      group: "Mobile",
      items: ["React Native", "Expo", "NativeWind", "React Navigation", "Stripe RN"],
    },
    {
      id: "seed-backend",
      group: "Backend & Infra",
      items: ["Node.js", "MongoDB", "Supabase", "Firebase", "Docker", "Vercel"],
    },
    {
      id: "seed-craft",
      group: "Craft",
      items: ["Accessibility", "Design Systems", "Core Web Vitals", "SEO", "Git"],
    },
  ],

  path: [
    {
      id: "seed-now",
      period: "2026 — Present",
      title: "Freelance Frontend Engineer",
      org: "Independent",
      location: "Dhaka · Remote",
      points: [
        "Shipping production platforms across logistics, commerce and SaaS.",
        "Owning the full frontend: architecture, design system, motion, performance.",
        "Working directly with founders — scoping, building and shipping end to end.",
      ],
    },
    {
      id: "seed-agency",
      period: "2024 — 2026",
      title: "Frontend Engineer",
      org: "Agency & product teams",
      location: "Dhaka, BD",
      points: [
        "Built client dashboards, storefronts and marketing sites on Next.js.",
        "Introduced a shared component library that halved new-page build time.",
      ],
    },
    {
      id: "seed-learning",
      period: "2022 — 2024",
      title: "Learning in public",
      org: "Self-taught",
      location: "Dhaka, BD",
      points: [
        "Went deep on JavaScript fundamentals, React internals and browser rendering.",
        "Shipped small tools and clones until the hard parts stopped being hard.",
      ],
    },
  ],
};
