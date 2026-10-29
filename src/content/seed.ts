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
    role: "Front-end developer",
    roleTail: "— React, Next.js, and interfaces that stay fast",
    tagline:
      "I build production interfaces in React, Next.js and TypeScript — layouts that stop shifting, interactions that hold their frame rate, and React Native when it belongs in your pocket.",
    location: "Bangladesh",
    timeZone: "Asia/Dhaka",
    edition: "2026",
    email: "kauserulislam0055@gmail.com",
    available: true,
    availableLabel: "Open to work",
    url: "https://kausardev.vercel.app",
    photo: "/kausarul.jpg",
  },

  about: {
    kicker: "01 — About",
    body:
      "I'm a front-end developer with three-plus years building production interfaces in React, Next.js and TypeScript. I work on the part most teams leave until last: layouts that stop shifting, interactions that hold their frame rate, and pages that stay fast on a mid-range phone. I own UI architecture, a shared component library and browser performance end to end — and I have working knowledge of the API and data layer behind it, so handoffs stay clean.",
    note:
      "Commerce platforms, B2B wholesale, logistics and AI assistants — 6+ products live, plus 2+ React Native apps on Google Play.",
    solves: [
      {
        title: "You need the design built properly",
        body: "A Figma file goes in; reusable, accessible components and a live URL come out. Responsive, consistent, and ready for the API to plug into.",
      },
      {
        title: "It's slow, or it breaks on phones",
        body: "I rebuild front ends that load fast, hold together on real devices, and stop jumping around under the person using them.",
      },
      {
        title: "You need the same product on mobile",
        body: "React Native and Expo, taken all the way through to a Play Store release — not a prototype that stalls before it ships.",
      },
      {
        title: "Your team needs it to scale",
        body: "A shared component library, clean UI architecture and API integration your team can build on. This site has an admin panel; edit it and the page updates.",
      },
    ],
    stats: [
      { value: 6, suffix: "+", label: "Products live" },
      { value: 3, suffix: "+ yrs", label: "Shipping professionally" },
      { value: 4, suffix: "+", label: "Live web platforms" },
      { value: 2, suffix: "", label: "Apps on Google Play" },
    ],
  },

  contact: {
    kicker: "05 — Contact",
    headline: "Let's build something",
    headlineAccent: "worth shipping",
    body:
      "Got an interface that needs building or rebuilding? I'm taking on new work — front-end builds, redesigns, or joining a team that cares about craft.",
  },

  socials: [
    { label: "GitHub", handle: "@kausarul05", href: "https://github.com/kausarul05" },
    { label: "LinkedIn", handle: "in/kausarul-islam", href: "https://www.linkedin.com/in/kausarul-islam" },
    { label: "X", handle: "@kausarul05", href: "https://x.com/kausarul05" },
    {
      label: "Email",
      handle: "kauserulislam0055@gmail.com",
      href: "mailto:kauserulislam0055@gmail.com",
    },
  ],

  marquee: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Redux Toolkit",
    "React Native",
    "Expo",
    "Web Performance",
    "Accessibility",
    "Figma",
    "Vercel",
  ],

  projects: [
    {
      id: "seed-dealnux-web",
      title: "Dealnux",
      subtitle: "Multi-vendor commerce platform",
      year: "2026",
      role: "Front-end developer",
      status: "Live",
      summary:
        "A marketplace where sellers list their own products alongside deals pulled in from other stores. Shoppers compare prices across vendors, save what they want, and get told the moment it drops.",
      highlights: [
        "Seller onboarding and product management interfaces",
        "Price comparison across vendors with drop tracking",
        "AI assistant and referral rewards built in",
      ],
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      accentFrom: "#f2a01d",
      accentTo: "#1b3a8f",
      accent: ["#f2a01d", "#1b3a8f"],
      image: "/projects/dealnux.jpg",
      href: "https://dealnux.shop/",
      repo: "",
    },
    {
      id: "seed-dealnux-app",
      title: "DealNux App",
      subtitle: "Shopping app on Google Play",
      year: "2026",
      role: "Mobile Developer",
      status: "On Google Play",
      summary:
        "The Dealnux marketplace as a native app — browse and compare, keep a favourites list, refer friends for credit, and get a push the moment a saved product drops in price.",
      highlights: [
        "Cross-platform build shipped through EAS to the Play Store",
        "Cart, favourites and referral flows in one app",
        "Push notifications for price drops",
      ],
      tags: ["React Native", "Expo", "TypeScript", "Firebase", "Stripe", "NativeWind"],
      accentFrom: "#2f6bff",
      accentTo: "#f5b301",
      accent: ["#2f6bff", "#f5b301"],
      image: "/projects/dealnux-app.jpg",
      href: "https://play.google.com/store/apps/details?id=com.dealnux.app",
      repo: "",
    },
    {
      id: "seed-eurasia",
      title: "Eurasia Supplies",
      subtitle: "Beauty & personal care store",
      year: "2025",
      role: "Front-end developer",
      status: "Live",
      summary:
        "A retail storefront for cosmetics, skincare and supplements — a dozen shopping categories, brand pages, combo offers and B1G1 promotions, with search across the whole catalogue.",
      highlights: [
        "Category, brand and promotion browsing across a deep catalogue",
        "Cart and checkout flow end to end",
        "Product search with live filtering",
      ],
      tags: ["React", "Next.js", "REST APIs", "Tailwind CSS"],
      accentFrom: "#e01b24",
      accentTo: "#ff6f91",
      accent: ["#e01b24", "#ff6f91"],
      image: "/projects/eurasia.jpg",
      href: "https://eurasiasupplies.com/",
      repo: "",
    },
    {
      id: "seed-azan",
      title: "Azan Wholesale",
      subtitle: "B2B dropshipping platform",
      year: "2025",
      role: "Front-end developer",
      status: "Live",
      summary:
        "A wholesale platform for resellers across Bangladesh. Sign up, pick from verified suppliers, and sell without holding stock — fulfilment and delivery are handled behind a reseller dashboard.",
      highlights: [
        "Reseller onboarding and dashboard interfaces",
        "Interfaces on top of a supplier catalogue",
        "Sales dashboard with growth reporting",
      ],
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
      accentFrom: "#ff2d78",
      accentTo: "#ff8bb6",
      accent: ["#ff2d78", "#ff8bb6"],
      image: "/projects/azan.jpg",
      href: "https://azanwholesale.com/",
      repo: "",
    },
    {
      id: "seed-lawapan",
      title: "LAWAPAN",
      subtitle: "Logistics marketplace",
      year: "2025",
      role: "Lead Frontend",
      status: "Live",
      summary:
        "A freight platform where shippers post loads and transporters bid on them. Live tracking on the map, real-time bid updates over sockets, generated PDF invoices, and an admin control tower on top.",
      highlights: [
        "Separate dashboards for shippers and transporters",
        "Live tracking with Google Maps and Leaflet",
        "Socket.IO bidding and a multi-language UI",
      ],
      tags: ["Next.js", "React Three Fiber", "Google Maps", "Socket.IO", "jsPDF", "i18n"],
      accentFrom: "#6d4dff",
      accentTo: "#3ddcff",
      accent: ["#6d4dff", "#3ddcff"],
      image: "/projects/lawapan.jpg",
      href: "https://lawapan.vercel.app/",
      repo: "",
    },
    {
      id: "seed-chatbot",
      title: "AI Chatbot 24",
      subtitle: "AI assistant on Google Play",
      year: "2026",
      role: "Mobile Developer",
      status: "On Google Play",
      summary:
        "A conversational AI assistant in your pocket — ask anything, keep your chat history, and pick up a thread where you left it. Built cross-platform and shipped to the Play Store.",
      highlights: [
        "Streaming chat interface",
        "Conversation history that survives between sessions",
        "Cross-platform build published through EAS",
      ],
      tags: ["React Native", "Expo", "TypeScript", "AI API", "Firebase"],
      accentFrom: "#7c4dff",
      accentTo: "#00d4b8",
      accent: ["#7c4dff", "#00d4b8"],
      image: "/projects/chatbot-app.jpg",
      href: "https://play.google.com/store/apps/details?id=ai.chatbot24.app",
      repo: "",
    },
  ],

  stack: [
    {
      id: "seed-frontend",
      group: "Frontend",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Redux Toolkit",
        "Zustand",
      ],
    },
    {
      id: "seed-backend",
      group: "Back end (working knowledge)",
      items: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT Auth", "Firebase", "Stripe"],
    },
    {
      id: "seed-mobile",
      group: "Mobile",
      items: ["React Native", "Expo", "EAS Build", "Push Notifications", "NativeWind"],
    },
    {
      id: "seed-ai",
      group: "AI & Integrations",
      items: [
        "AI Chatbots",
        "API Integration",
        "Stripe",
        "Payment Gateways",
        "Socket.IO",
        "Google Maps",
      ],
    },
    {
      id: "seed-infra",
      group: "Infra & Tools",
      items: ["Vercel", "Firebase", "Git & GitHub", "Docker", "Postman", "Figma"],
    },
    {
      id: "seed-craft",
      group: "Craft",
      items: ["Responsive UI", "Web Performance", "SEO", "Accessibility", "Design Systems"],
    },
  ],

  path: [
    {
      id: "seed-sparktech",
      period: "Aug 2025 — Present",
      title: "Executive, Front End",
      org: "Sparktech Agency",
      location: "Bangladesh",
      points: [
        "Building production front ends in React and Next.js for client products across commerce, logistics and B2B.",
        "Shipping cross-platform mobile features in React Native alongside the web work.",
        "Owning UI architecture, the shared component library and browser performance.",
      ],
    },
    {
      id: "seed-freelance-corner",
      period: "May 2025 — Oct 2025",
      title: "App Developer",
      org: "Freelance Corner",
      location: "Remote · Part-time",
      points: [
        "Built cross-platform mobile interfaces in React Native, four hours a day.",
        "Took screens from design through to a Play Store release.",
      ],
    },
    {
      id: "seed-ctti",
      period: "Sep 2024 — Jun 2025",
      title: "Web Development Instructor",
      org: "CTTI — Computer Training & Freelance Institute",
      location: "On-site",
      points: [
        "Taught web development in person: HTML, CSS, Tailwind CSS, JavaScript and React.",
        "Took beginners from their first tag to building and styling their own components.",
      ],
    },
    {
      id: "seed-web-arts-factory",
      period: "Jun 2023 — Jul 2025",
      title: "React Developer",
      org: "Web Arts Factory",
      location: "Bangladesh",
      points: [
        "Two years building client web applications on React.",
        "Turned designs into reusable, accessible components across a dozen projects.",
        "Grew from interface work into the API and data layer behind it.",
      ],
    },
  ],
};
