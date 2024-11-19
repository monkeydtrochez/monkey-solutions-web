import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SanityClientConfig } from "@/app/sanityClient";

export const useSanityConfigLoader = () => {
  const { data, error } = useQuery<SanityClientConfig>({
    queryKey: ["sanityConfig"],
    queryFn: async () => {
      const result = await axios.get("/api/getSanityConfig");
      return result.data;
    },
  });
  return { config: data, error };
};

export const fetchSanityConfig = async (): Promise<SanityClientConfig> => {
  try {
    const response = await axios.get<SanityClientConfig>(
      "/api/getSanityConfig"
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch Sanity config. Status: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching Sanity config:", error);
    throw new Error("Unable to fetch Sanity configuration.");
  }
};
