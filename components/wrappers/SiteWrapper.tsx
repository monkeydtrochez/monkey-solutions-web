"use client";
import GlobalContext from "@/app/context/GlobalContext";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import React, { useContext, useEffect } from "react";

export default function SiteWrapper({
  data,
  children,
}: {
  data: SanityApiResponse[];
  children: React.ReactNode;
}) {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { showCV, showProjects, toggleCardAnimation, setSiteContentToContext } =
    globalContext;

  useEffect(() => {
    setSiteContentToContext(data as SanityApiResponse[]);
  }, [data, setSiteContentToContext]);

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
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
