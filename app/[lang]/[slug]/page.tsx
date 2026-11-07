import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { liveSlugs, pageKeyForSlug } from "@/lib/i18n/routes";

// Service and about pages. Slugs come from lib/i18n/routes.ts and only pages
// marked live there are generated; every other slug is a 404.
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
