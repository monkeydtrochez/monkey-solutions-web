import {
  loadSanityData,
  getSanityDataFromCache,
} from "@/lib/api/sanityDataLoader";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";
import { SanityApiResponse } from "./models/sanityTypes";
import Projects from "@/components/Projects";
import SiteWrapper from "@/components/wrappers/SiteWrapper";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import { CACHE_REVALIDATION_INTERVAL } from "@/lib/constants";

export default function Home() {
  setInterval(() => {
    loadSanityData().catch((error) => {
      console.error("Error revalidating Sanity data cache:", error);
    });
  }, CACHE_REVALIDATION_INTERVAL);

  return <SiteContent />;
}

async function SiteContent() {
  await loadSanityData();
  const data = getSanityDataFromCache();

  return (
    <QueryClientWrapper>
      <SiteWrapper data={data as SanityApiResponse[]}>
        <BusinessCard />
        <CV />
        <Projects />
      </SiteWrapper>
    </QueryClientWrapper>
  );
}
