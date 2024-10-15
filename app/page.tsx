"use client";
import { useContext } from "react";
import GlobalContext, { GlobalContextProvider } from "./context/GlobalContext";
import { useEffect } from "react";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";

export default function Home() {
  return (
    <GlobalContextProvider>
      <SiteContent />
    </GlobalContextProvider>
  );
}

function SiteContent() {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { showCV, toggleCardAnimation } = globalContext;

  useEffect(() => {
    if (showCV) {
      toggleCardAnimation(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => toggleCardAnimation(false), 300);
      document.body.style.overflow = "auto";
    }
  }, [showCV]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <BusinessCard />
        <CV />
      </div>
    </div>
  );
}
