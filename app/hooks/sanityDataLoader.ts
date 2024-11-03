import { useQuery } from "@tanstack/react-query";
import { SanityApiResponse } from "../models/sanityTypes";
import axios from "axios";

export const useSanityDataLoader = () => {
  const { data, error } = useQuery<SanityApiResponse[]>({
    queryKey: ["sanityData"],
    queryFn: async () => {
      const result = await axios.get("/api/sanity-data");
      return result.data;
    },
  });
  return { data, error };
};
