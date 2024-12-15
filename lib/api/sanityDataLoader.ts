import { SanityApiResponse } from "@/app/models/sanityTypes";
import { CACHE_REVALIDATION_INTERVAL } from "@/lib/constants";
import redis from "@/lib/redis";
import axios from "axios";

const cacheKey = "sanityData";

const loadSanityData = async (): Promise<void> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await axios.get(`${baseUrl}/api/sanity-data`);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch Sanity data. Status: ${response.status}`);
  }

  await redis.set(cacheKey, JSON.stringify(response.data));
};

export const revalidateCache = async (): Promise<void> => {
  const cachedData = await redis.get(cacheKey);

  console.log("Revalidate Init: ", cachedData !== null);
  if (cachedData !== null) {
    console.log("Found cached data");
    await redis.getdel(cacheKey);
    console.log("Deleted cached data");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await axios.get(`${baseUrl}/api/sanity-data`);

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch Sanity data. Status: ${response.status}`
      );
    }
    console.log("Fetched new data to cache: ");
    await redis.set(cacheKey, JSON.stringify(response.data));
  }
};

export const getSanityDataFromCache = async (): Promise<
  SanityApiResponse[]
> => {
  const cachedData = await redis.get(cacheKey);
  if (cachedData === null) {
    await loadSanityData();
    const newCachedData = await redis.get(cacheKey);
    console.log("Got fresh data");
    return newCachedData
      ? (JSON.parse(newCachedData) as SanityApiResponse[])
      : [];
  }
  console.log("Got data from cache");
  return cachedData ? (JSON.parse(cachedData) as SanityApiResponse[]) : [];
};
