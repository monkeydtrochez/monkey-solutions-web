import { createClientFromParam, SanityClientConfig } from "@/app/sanityClient";
import { SanityApiResponse } from "@/app/models/sanityTypes";
import type { Locale } from "@/lib/i18n/config";
import { buildSiteQuery } from "./siteQuery";

export const loadSanityData = async (
  lang: Locale
): Promise<SanityApiResponse[]> => {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const apiVersion = process.env.SANITY_API_VERSION;

  if (!projectId || !dataset || !apiVersion) {
    throw new Error(
      `Missing Sanity env vars: ${[
        !projectId && "SANITY_PROJECT_ID",
        !dataset && "SANITY_DATASET",
        !apiVersion && "SANITY_API_VERSION",
      ]
        .filter(Boolean)
        .join(", ")}`
    );
  }

  const config: SanityClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  };
  const sanityClient = createClientFromParam(config);
  return sanityClient.fetch(buildSiteQuery(lang));
};
