import { getSanityDataFromCache } from "@/lib/api/sanityDataLoader";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";
import { SanityApiResponse } from "./models/sanityTypes";
import Projects from "@/components/Projects";
import SiteWrapper from "@/components/wrappers/SiteWrapper";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 1;

async function getSanityData() {
  return getSanityDataFromCache();
}

export default async function Home() {
  const data = await getSanityData();

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
