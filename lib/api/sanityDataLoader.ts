import { SanityApiResponse } from "@/app/models/sanityTypes";
import redis from "@/lib/redis";
import axios from "axios";

const cacheKey = "sanityData";

const loadSanityData = async (): Promise<SanityApiResponse[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await axios.get<SanityApiResponse[]>(
    `${baseUrl}/api/sanity-data`
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch Sanity data. Status: ${response.status}`);
  }

  return response.data;
};

export const revalidateCache = async (): Promise<void> => {
  if (redis !== null) {
    const cachedData = await redis.get(cacheKey);
    console.info("Revalidate Init: ", cachedData !== null);

    if (cachedData !== null) {
      console.info("Found cached data");
      await redis.getdel(cacheKey);
      console.info("Deleted cached data");

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await axios.get(`${baseUrl}/api/sanity-data`, {
        params: {
          _t: Date.now(),
        },
      });

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch Sanity data. Status: ${response.status}`
        );
      }
      console.log("Fetched fresh sanity data");
      await redis.set(cacheKey, JSON.stringify(response.data));
    }
  }
};

export const getSanityDataFromCache = async (): Promise<
  SanityApiResponse[]
> => {
  if (redis !== null) {
    const cachedData = await redis.get(cacheKey);
    if (cachedData === null) {
      console.info("No data found in cache, fetching new from sanity");
      const data = await loadSanityData();
      await redis.set(cacheKey, JSON.stringify(data));

      return data;
    }

    console.info("Found cached data.");
    return cachedData ? (JSON.parse(cachedData) as SanityApiResponse[]) : [];
  } else {
    console.info("Redis client is null, fetch for fresh data.");
    const data = await loadSanityData();
    return data as SanityApiResponse[];
  }
};
