import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SanityClientConfig } from "../sanityClient";

// TODO make this on to be called from server similar to sanityDataLoader
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
