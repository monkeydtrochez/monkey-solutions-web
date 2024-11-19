import { SanityApiResponse } from "@/app/models/sanityTypes";
import { CACHE_REVALIDATION_INTERVAL } from "@/lib/constants";
import { cache } from "react";
import axios from "axios";

const sanityDataCache = new Map<
  string,
  { data: SanityApiResponse[]; timestamp: number }
>();

export const loadSanityData = async (): Promise<void> => {
  const cachedData = sanityDataCache.get("sanityData");
  const now = Date.now();

  if (!cachedData || now - cachedData.timestamp > CACHE_REVALIDATION_INTERVAL) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await axios.get(`${baseUrl}/api/getSanityData`);

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch Sanity data. Status: ${response.status}`
      );
    }

    sanityDataCache.set("sanityData", { data: response.data, timestamp: now });
  }
};

export const getSanityDataFromCache = cache((): SanityApiResponse[] => {
  const cachedData = sanityDataCache.get("sanityData");
  if (!cachedData) {
    throw new Error("Sanity data is not available in the cache.");
  }
  return cachedData.data;
});
