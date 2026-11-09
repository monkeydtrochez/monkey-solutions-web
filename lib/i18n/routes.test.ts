import { describe, expect, it } from "vitest";
import {
  languageAlternates,
  livePages,
  liveSlugs,
  pageKeyForSlug,
  pathFor,
  switchTarget,
  withHash,
} from "./routes";

describe("routes", () => {
  it("gives paths for live pages only", () => {
    expect(pathFor("home", "sv")).toBe("/");
    expect(pathFor("home", "en")).toBe("/en");
    expect(pathFor("website", "sv")).toBeNull();
  });

  it("builds hreflang alternates for pages live in both languages", () => {
    expect(languageAlternates("home")).toEqual({
      "sv-SE": "/",
      en: "/en",
      "x-default": "/",
    });
    expect(languageAlternates("website")).toEqual({});
  });

  it("switches to the same page in the other language", () => {
    expect(switchTarget("home", "sv")).toBe("/en");
    expect(switchTarget("home", "en")).toBe("/");
  });

  it("falls back to the other language's home when the page is not live", () => {
    expect(switchTarget("website", "sv")).toBe("/en");
    expect(switchTarget("website", "en")).toBe("/");
  });

  it.each([
    ["/en", "#work", "/en#work"],
    ["/", "#work", "/#work"],
    ["/en", "", "/en"],
    ["/en", "#", "/en"],
  ])("withHash(%s, %s) is %s", (path, hash, expected) => {
    expect(withHash(path, hash)).toBe(expected);
  });

  it("resolves slugs only for live pages", () => {
    expect(pageKeyForSlug("sv", "hemsida")).toBeNull();
    expect(pageKeyForSlug("en", "website")).toBeNull();
    expect(liveSlugs("sv")).toEqual([]);
    expect(liveSlugs("en")).toEqual([]);
  });

  it("lists live pages with their paths", () => {
    expect(livePages()).toEqual([
      { key: "home", lang: "sv", path: "/" },
      { key: "home", lang: "en", path: "/en" },
    ]);
  });
});
