import { describe, expect, it } from "vitest";
import { format } from "./format";

describe("format", () => {
  it("replaces named placeholders", () => {
    expect(format("Visit {title} site", { title: "X" })).toBe("Visit X site");
    expect(format("{n} engagements", { n: 3 })).toBe("3 engagements");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(format("Hi {name} {other}", { name: "Daniel" })).toBe(
      "Hi Daniel {other}"
    );
  });
});
