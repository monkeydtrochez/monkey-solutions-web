import {
  loadSanityData,
  getSanityDataFromCache,
} from "@/app/hooks/sanityDataLoader";
import BusinessCard from "@/components/BusinessCard";
import CV from "@/components/CV";
import { SanityApiResponse } from "./models/sanityTypes";
import Projects from "@/components/Projects";
import SiteWrapper from "@/components/wrappers/SiteWrapper";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";

export default function Home() {
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
