import { describe, expect, it } from "vitest";
import { resolveProxy } from "./proxyRules";

describe("resolveProxy", () => {
  it.each([
    ["/", "/sv"],
    ["/hemsida", "/sv/hemsida"],
    ["/svenska", "/sv/svenska"],
    ["/english", "/sv/english"],
    ["/EN", "/sv/EN"],
  ])("rewrites Swedish path %s to %s", (input, pathname) => {
    expect(resolveProxy(input)).toEqual({ action: "rewrite", pathname });
  });

  it.each([
    ["/sv", "/"],
    ["/sv/", "/"],
    ["/sv/hemsida", "/hemsida"],
    ["/sv/a/b", "/a/b"],
  ])("redirects prefixed Swedish path %s to %s", (input, pathname) => {
    expect(resolveProxy(input)).toEqual({ action: "redirect", pathname });
  });

  it.each(["/en", "/en/", "/en/website", "/en/a/b"])(
    "passes English path %s through",
    (input) => {
      expect(resolveProxy(input)).toEqual({ action: "next" });
    }
  );
});
