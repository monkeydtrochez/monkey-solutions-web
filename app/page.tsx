"use client";
import { useContext, useEffect } from "react";
import GlobalContext, { GlobalContextProvider } from "./context/GlobalContext";
import { useSanityDataLoader } from "@/app/hooks/sanityDataLoader";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SanityApiResponse } from "./models/sanityTypes";
import Projects from "@/components/Projects";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <SiteContent />
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}

function SiteContent() {
  const globalContext = useContext(GlobalContext);
  const { data, error } = useSanityDataLoader();

  if (!globalContext) {
    return "Global context is null";
  }

  const { showCV, showProjects, toggleCardAnimation, setSiteContentToContext } =
    globalContext;

  useEffect(() => {
    if (error !== null) {
      throw new Error(
        `Unexpected error when loading data from Sanity. Error: ${error?.message}, Stack: ${error?.stack}`
      );
    } else {
      setSiteContentToContext(data as SanityApiResponse[]);
    }
  }, [data, error, setSiteContentToContext]);

  useEffect(() => {
    if (showCV || showProjects) {
      toggleCardAnimation(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => toggleCardAnimation(false), 300);
      document.body.style.overflow = "auto";
    }
  }, [showCV, showProjects]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <BusinessCard />
        <CV />
        <Projects />
      </div>
    </div>
  );
}
