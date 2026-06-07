import { createClient } from "@sanity/client";

export interface SanityClientConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
}

export function createClientFromParam(config: SanityClientConfig) {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: config.useCdn,
    perspective: "published",
  });
}
