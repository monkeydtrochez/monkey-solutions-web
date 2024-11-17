import { useQuery } from "@tanstack/react-query";
import { SanityApiResponse } from "../models/sanityTypes";
import { cache } from "react";
import axios from "axios";

export const useSanityDataLoader = () => {
  const { data, error } = useQuery<SanityApiResponse[]>({
    queryKey: ["sanityData"],
    queryFn: async () => {
      const result = await axios.get("/api/getSanityData");
      return result.data;
    },
  });

  if (error) {
    throw new Error(
      `Unexpected error when loading data from Sanity. Error: ${error?.message}, Stack: ${error?.stack}`
    );
  }

  return { data };
};

// Create a cache for storing the data
const sanityDataCache = new Map<string, SanityApiResponse[]>();

export const loadSanityData = async () => {
  const cachedData = sanityDataCache.get("sanityData");
  if (!cachedData) {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin // Client-side
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await axios.get(`${baseUrl}/api/getSanityData`);

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch Sanity data. Status: ${response.status}`
      );
    }

    sanityDataCache.set("sanityData", response.data);
  }
};

// Get data from the cache
export const getSanityDataFromCache = cache((): SanityApiResponse[] => {
  const cachedData = sanityDataCache.get("sanityData");
  if (!cachedData) {
    throw new Error("Sanity data is not available in the cache.");
  }
  return cachedData;
});
