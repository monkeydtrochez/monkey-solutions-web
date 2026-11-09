// Pure patch builder for the Swedish translation migration. No Sanity imports,
// so it runs under the repo's Vitest setup.
import type { SvTranslation } from "./translations";

type Span = { _key: string; _type: string; marks?: string[]; text: string };
type Block = {
  _key: string;
  _type: string;
  children?: Span[];
  [key: string]: unknown;
};

export type SourceDoc = {
  _id: string;
  _type: string;
  description?: Block[];
  body?: Block[];
  communityWork?: { _key: string; [key: string]: unknown }[];
  metrics?: { _key: string; [key: string]: unknown }[];
  [key: string]: unknown;
};

export type PathSegment = string | { _key: string };
export type SvPatch = { path: PathSegment[]; value: unknown };

const englishFieldFor = { descriptionSv: "description", bodySv: "body" } as const;

export function translationFor(
  id: string,
  translations: Record<string, SvTranslation>
): SvTranslation | undefined {
  return translations[id.replace(/^drafts\./, "")];
}

// Clones the English blocks (style, lists, marks, keys) and swaps each span's
// text, so formatting survives and only the words change.
function translateBlocks(
  doc: SourceDoc,
  field: keyof typeof englishFieldFor,
  spans: string[][]
): Block[] {
  const source = (doc[englishFieldFor[field]] as Block[] | undefined) ?? [];
  const where = `${doc._id} ${field}`;
  if (source.length !== spans.length) {
    throw new Error(`${where}: ${spans.length} blocks, English has ${source.length}`);
  }
  return source.map((block, i) => {
    const children = block.children ?? [];
    if (children.length !== spans[i].length) {
      throw new Error(
        `${where}[${i}]: ${spans[i].length} spans, English has ${children.length}`
      );
    }
    return {
      ...structuredClone(block),
      children: children.map((span, j) => ({ ...structuredClone(span), text: spans[i][j] })),
    };
  });
}

export function swedishPatches(doc: SourceDoc, t: SvTranslation): SvPatch[] {
  if (doc._type !== t._type) {
    throw new Error(`${doc._id}: translation is for ${t._type}, document is ${doc._type}`);
  }
  const patches: SvPatch[] = [];

  for (const [field, value] of Object.entries(t.fields ?? {})) {
    patches.push({ path: [field], value });
  }

  for (const [field, spans] of Object.entries(t.blocks ?? {})) {
    if (!spans) continue;
    const key = field as keyof typeof englishFieldFor;
    patches.push({ path: [field], value: translateBlocks(doc, key, spans) });
  }

  for (const member of t.members ?? []) {
    const items = (doc[member.array] as { _key: string }[] | undefined) ?? [];
    if (!items.some((item) => item._key === member._key)) {
      throw new Error(`${doc._id}: ${member.array} has no member ${member._key}`);
    }
    for (const [field, value] of Object.entries(member.fields)) {
      patches.push({ path: [member.array, { _key: member._key }, field], value });
    }
  }

  return patches;
}
