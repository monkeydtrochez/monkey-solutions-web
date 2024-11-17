"use client";
import { useSanityDataLoader } from "@/app/hooks/sanityDataLoader";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SanityApiResponse } from "./models/sanityTypes";
import Projects from "@/components/Projects";
import SiteWrapper from "@/components/SiteWrapper";

const queryClient = new QueryClient();

export default function Home() {
  return (
    // TODO testa flytta QueryClientProvider till en egen wrapper och använd use client där
    <QueryClientProvider client={queryClient}>
      <SiteContent />
    </QueryClientProvider>
  );
}

function SiteContent() {
  const { data } = useSanityDataLoader();

  return (
    <SiteWrapper data={data as SanityApiResponse[]}>
      <BusinessCard />
      <CV />
      <Projects />
    </SiteWrapper>
  );
}
