"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/stack", label: "Stack" },
  { href: "/admin/path", label: "Path" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto max-w-6xl overflow-x-auto px-5 md:px-8">
      <ul className="flex min-w-max gap-1 pb-1">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "-mb-px inline-block border-b-2 px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                  active
                    ? "border-acid text-acid"
                    : "border-transparent text-mute hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
