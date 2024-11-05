import { createClient } from "@sanity/client";

export interface SanityClientConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
}

export function createClientFromParam(config: SanityClientConfig) {
  if (config) {
    return createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      useCdn: config.useCdn,
    });
  } else {
    return null;
  }
}
