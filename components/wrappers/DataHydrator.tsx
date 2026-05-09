"use client";
import { useContext, useEffect } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { SanityApiResponse } from "@/app/models/sanityTypes";

export default function DataHydrator({ data }: { data: SanityApiResponse[] }) {
  const ctx = useContext(GlobalContext);
  const setSiteContentToContext = ctx?.setSiteContentToContext;
  useEffect(() => {
    if (setSiteContentToContext) {
      setSiteContentToContext(data);
    }
  }, [data, setSiteContentToContext]);
  return null;
}
