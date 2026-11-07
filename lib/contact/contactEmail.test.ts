import { describe, expect, it } from "vitest";
import { contactEmailText, parseContactBody } from "./contactEmail";

const valid = { name: " Anna ", email: "a@b.se", budget: "10k", project: "Ny hemsida" };

describe("parseContactBody", () => {
  it("keeps a valid lang", () => {
    expect(parseContactBody({ ...valid, lang: "sv" })).toEqual({
      name: "Anna",
      email: "a@b.se",
      budget: "10k",
      project: "Ny hemsida",
      lang: "sv",
    });
    expect(parseContactBody({ ...valid, lang: "en" })?.lang).toBe("en");
  });

  it("marks a missing or unknown lang as unknown", () => {
    expect(parseContactBody(valid)?.lang).toBe("unknown");
    expect(parseContactBody({ ...valid, lang: "de" })?.lang).toBe("unknown");
    expect(parseContactBody({ ...valid, lang: 1 })?.lang).toBe("unknown");
  });

  it("rejects bodies without name, email or project", () => {
    expect(parseContactBody({})).toBeNull();
    expect(parseContactBody(null)).toBeNull();
    expect(parseContactBody({ ...valid, project: "  " })).toBeNull();
  });
});

describe("contactEmailText", () => {
  it("adds a Language line after Budget", () => {
    expect(
      contactEmailText({
        name: "Anna",
        email: "a@b.se",
        budget: "10k",
        project: "Ny hemsida",
        lang: "sv",
      })
    ).toBe("Name: Anna\nEmail: a@b.se\nBudget: 10k\nLanguage: sv\n\nNy hemsida");
  });
});
