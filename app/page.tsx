import { loadSanityData } from "@/lib/api/sanityDataLoader";
import DataHydrator from "@/components/wrappers/DataHydrator";
import QueryClientWrapper from "@/components/wrappers/QueryClientWrapper";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadSanityData();
  return (
    <QueryClientWrapper>
      <DataHydrator data={data} />
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
      </main>
    </QueryClientWrapper>
  );
}
