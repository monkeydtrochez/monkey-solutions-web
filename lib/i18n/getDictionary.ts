import type { Locale } from "./config";
import { sv } from "./dictionaries/sv";
import { en } from "./dictionaries/en";
import type { Dictionary } from "./dictionaries/types";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { sv, en };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
