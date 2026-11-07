import { loadSanityData } from "@/lib/api/sanityDataLoader";
import { normalizeSanityData } from "@/lib/content/normalize";
import { GlobalContextProvider } from "@/app/context/GlobalContext";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default async function Home() {
  const content = normalizeSanityData(await loadSanityData());
  return (
    <GlobalContextProvider initialData={content}>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ExperienceSection />
        <SkillsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <FooterSection />
    </GlobalContextProvider>
  );
}
