import { describe, expect, it } from "vitest";
import { sv } from "./sv";
import { en } from "./en";

type Node = unknown;

// Walks two dictionary trees in parallel and reports any structural mismatch.
// Arrays may differ in length per language; their elements must share keys.
function shapeErrors(a: Node, b: Node, path: string): string[] {
  if (typeof a === "string" || typeof b === "string") {
    return typeof a === typeof b ? [] : [`${path}: string vs ${typeof b}`];
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return [`${path}: array mismatch`];
    const errors: string[] = [];
    const ref = a[0] ?? b[0];
    for (const [i, item] of [...a, ...b].entries()) {
      errors.push(...shapeErrors(ref, item, `${path}[${i}]`));
    }
    return errors;
  }
  if (typeof a === "object" && a && typeof b === "object" && b) {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    if (ak.join() !== bk.join()) {
      return [`${path}: keys ${ak.join(",")} vs ${bk.join(",")}`];
    }
    return ak.flatMap((k) =>
      shapeErrors(
        (a as Record<string, Node>)[k],
        (b as Record<string, Node>)[k],
        `${path}.${k}`
      )
    );
  }
  return [`${path}: unexpected ${typeof a}/${typeof b}`];
}

function strings(node: Node, path: string): [string, string][] {
  if (typeof node === "string") return [[path, node]];
  if (Array.isArray(node)) return node.flatMap((n, i) => strings(n, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  }
  return [];
}

const placeholders = (s: string): string[] => [...(s.match(/\{\w+\}/g) ?? [])].sort();

describe("dictionaries", () => {
  it("have the same keys at every level in sv and en", () => {
    expect(shapeErrors(sv, en, "dict")).toEqual([]);
  });

  it("contain no empty strings", () => {
    const empty = [...strings(sv, "sv"), ...strings(en, "en")].filter(
      ([, s]) => s.trim() === ""
    );
    expect(empty.map(([p]) => p)).toEqual([]);
  });

  it("keep every sv placeholder in the matching en string", () => {
    const enStrings = new Map(strings(en, "dict"));
    const missing = strings(sv, "dict").flatMap(([path, s]) => {
      const other = enStrings.get(path);
      if (other === undefined) return [];
      return placeholders(s)
        .filter((p) => !placeholders(other).includes(p))
        .map((p) => `${path} ${p}`);
    });
    expect(missing).toEqual([]);
  });
});
