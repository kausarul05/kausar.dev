"use client";

import { createContext, useContext, type ReactNode } from "react";
import { seed } from "@/content/seed";
import type { Content } from "@/lib/schemas";

const ContentContext = createContext<Content>(seed);

export function ContentProvider({ value, children }: { value: Content; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/**
 * Site content, loaded once on the server and handed to the client tree.
 * Defaults to the seed so a component rendered outside the provider — a
 * Storybook story, a test — still has something sensible to draw.
 */
export function useContent(): Content {
  return useContext(ContentContext);
}
