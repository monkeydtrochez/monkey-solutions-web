import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SanityClientConfig } from "@/app/sanityClient";

export const useSanityConfigLoader = () => {
  const { data, error } = useQuery<SanityClientConfig>({
    queryKey: ["sanityConfig"],
    queryFn: async () => {
      const result = await axios.get("/api/sanity-config");
      return result.data;
    },
  });
  return { config: data, error };
};
