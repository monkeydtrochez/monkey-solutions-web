"use client";
import { createContext, ReactNode } from "react";
import type { SiteContent } from "@/lib/content/normalize";

const GlobalContext = createContext<SiteContent | null>(null);

export const GlobalContextProvider = ({
  initialData,
  children,
}: {
  initialData: SiteContent;
  children: ReactNode;
}) => (
  <GlobalContext.Provider value={initialData}>{children}</GlobalContext.Provider>
);

export default GlobalContext;
