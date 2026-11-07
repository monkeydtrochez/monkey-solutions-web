import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { liveSlugs, pageKeyForSlug } from "@/lib/i18n/routes";

// Service and about pages. Slugs come from lib/i18n/routes.ts and only pages
// marked live there are generated; every other slug is a 404.
//
// WARNING before marking a page live: dynamicParams = false plus
// revalidatePath("/", "layout") (the Sanity webhook) regenerates generated
// pages as cached 404s (NoFallbackError). The same bug hit app/[lang]/layout.tsx.
// It stays here because it 404s unknown slugs and dotted bot paths at routing
// time. When the first page goes live, run verify-i18n.sh with CRON_SECRET set:
// it checks every sitemap page still renders after revalidation.
export const dynamicParams = false;

export async function generateStaticParams({
  params,
}: {
  params: { lang: string };
}) {
  return isLocale(params.lang)
    ? liveSlugs(params.lang).map((slug) => ({ slug }))
    : [];
}

export default async function ServicePage({
  params,
}: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !pageKeyForSlug(lang, slug)) notFound();
  // Page content ships with the service pages step.
  notFound();
}
