import { loadSanityData } from "@/lib/api/sanityDataLoader";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = (await loadSanityData()) as SanityApiResponse[];
  return (
    <QueryClientWrapper>
      <DataHydrator data={data} />
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
    </QueryClientWrapper>
  );
}
