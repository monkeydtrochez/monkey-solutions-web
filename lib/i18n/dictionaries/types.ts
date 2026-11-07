import type { sv } from "./sv";

// String literals widen to string and tuples widen to readonly arrays, so the
// English dictionary must have the same shape as the Swedish source but may
// hold different text and a different number of list items.
export type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepStringify<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepStringify<T[K]> }
      : T;

export type Dictionary = DeepStringify<typeof sv>;
