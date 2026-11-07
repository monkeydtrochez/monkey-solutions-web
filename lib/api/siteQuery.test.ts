import { describe, expect, it } from "vitest";
import { evaluate, parse } from "groq-js";
import { buildSiteQuery } from "./siteQuery";
import type { Locale } from "@/lib/i18n/config";

const block = (key: string, text: string) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `${key}s`, _type: "span", marks: [], text }],
});

const dataset = [
  {
    _id: "profile",
    _type: "profile",
    title: "Profile",
    heroBio: "English bio",
    heroBioSv: "",
    location: "Gothenburg, Sweden",
    locationSv: "Göteborg, Sverige",
    availabilityStatus: "Open for projects",
    languages: ["Swedish", "English"],
    languagesSv: [],
    personalitySkills: ["Calm"],
    personalitySkillsSv: ["Lugn"],
    description: [block("d1", "About me")],
    descriptionSv: [block("d1", "Om mig")],
    communityWork: [
      { _key: "c1", assignment: "Board member", assignmentSv: "Styrelseledamot", organisation: "Handelsakademin" },
      { _key: "c2", assignment: "Mentor", organisation: "Code club" },
    ],
  },
  {
    _id: "we1",
    _type: "workExperience",
    sortIndex: 1,
    title: "SENIOR FULLSTACK DEVELOPER | VÄSTTRAFIK",
    titleSv: "SENIOR FULLSTACKUTVECKLARE | VÄSTTRAFIK",
    description: [block("w1", "Built things")],
    company: "Linksson",
  },
  {
    _id: "p1",
    _type: "project",
    sortIndex: 1,
    title: "Shop",
    titleSv: "Butik",
    kind: "Web",
    body: [block("b1", "A shop")],
    bodySv: [],
    tags: ["Next.js"],
    metrics: [{ _key: "m1", label: "Orders", labelSv: "Ordrar", value: "10", suffix: "per day" }],
  },
  {
    _id: "e1",
    _type: "education",
    title: "Systems Developer",
    titleSv: "Systemutvecklare",
    school: "Handelsakademin",
    fieldOfStudy: ".NET",
  },
];

// Query results are untyped JSON; tests reach into them by path.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

async function run(lang: Locale) {
  const value = await evaluate(parse(buildSiteQuery(lang)), { dataset });
  const rows = (await value.get()) as Row[];
  return Object.fromEntries(rows.map((r) => [r._id, r]));
}

describe("buildSiteQuery", () => {
  it("uses Swedish work titles and falls back to English descriptions", async () => {
    const { we1 } = await run("sv");
    expect(we1.title).toBe("SENIOR FULLSTACKUTVECKLARE | VÄSTTRAFIK");
    expect(we1.description[0].children[0].text).toBe("Built things");
    expect(we1.company).toBe("Linksson");
    expect(we1.titleSv).toBeUndefined();
  });

  it("falls back to English for empty Swedish strings and arrays", async () => {
    const { profile } = await run("sv");
    expect(profile.heroBio).toBe("English bio");
    expect(profile.languages).toEqual(["Swedish", "English"]);
    expect(profile.personalitySkills).toEqual(["Lugn"]);
    expect(profile.location).toBe("Göteborg, Sverige");
    expect(profile.availabilityStatus).toBe("Open for projects");
    expect(profile.description[0].children[0].text).toBe("Om mig");
  });

  it("picks Swedish per metric field and per community entry", async () => {
    const { p1, profile } = await run("sv");
    expect(p1.title).toBe("Butik");
    expect(p1.kind).toBe("Web");
    expect(p1.body[0].children[0].text).toBe("A shop");
    expect(p1.metrics).toEqual([
      { _key: "m1", label: "Ordrar", value: "10", suffix: "per day" },
    ]);
    expect(profile.communityWork).toEqual([
      { _key: "c1", assignment: "Styrelseledamot", organisation: "Handelsakademin" },
      { _key: "c2", assignment: "Mentor", organisation: "Code club" },
    ]);
  });

  it("translates education titles", async () => {
    const { e1 } = await run("sv");
    expect(e1.title).toBe("Systemutvecklare");
    expect(e1.fieldOfStudy).toBe(".NET");
  });

  it("ignores every Sv field for English", async () => {
    const { profile, we1, p1, e1 } = await run("en");
    expect(we1.title).toBe("SENIOR FULLSTACK DEVELOPER | VÄSTTRAFIK");
    expect(profile.location).toBe("Gothenburg, Sweden");
    expect(profile.personalitySkills).toEqual(["Calm"]);
    expect(profile.description[0].children[0].text).toBe("About me");
    expect(profile.communityWork[0].assignment).toBe("Board member");
    expect(p1.title).toBe("Shop");
    expect(p1.metrics[0].label).toBe("Orders");
    expect(e1.title).toBe("Systems Developer");
  });
});
