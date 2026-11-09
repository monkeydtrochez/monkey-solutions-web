import { describe, expect, it } from "vitest";
import { swedishPatches, translationFor, type SourceDoc } from "./patches";
import type { SvTranslation } from "./translations";

const profile: SourceDoc = {
  _id: "profile-1",
  _type: "profile",
  description: [
    {
      _key: "b1",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        { _key: "s1", _type: "span", marks: ["strong"], text: "Hello" },
        { _key: "s2", _type: "span", marks: [], text: "! I build things." },
      ],
    },
    {
      _key: "b2",
      _type: "block",
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs: [],
      children: [{ _key: "s3", _type: "span", marks: [], text: "" }],
    },
  ],
  communityWork: [{ _key: "e7534276dff9", assignment: "Board member" }],
};

describe("swedishPatches", () => {
  it("clones English blocks and swaps only span text", () => {
    const t: SvTranslation = {
      _type: "profile",
      blocks: { descriptionSv: [["Hej", "! Jag bygger saker."], [""]] },
    };
    const [patch] = swedishPatches(profile, t);
    expect(patch.path).toEqual(["descriptionSv"]);
    expect(patch.value).toEqual([
      {
        _key: "b1",
        _type: "block",
        style: "normal",
        markDefs: [],
        children: [
          { _key: "s1", _type: "span", marks: ["strong"], text: "Hej" },
          { _key: "s2", _type: "span", marks: [], text: "! Jag bygger saker." },
        ],
      },
      {
        _key: "b2",
        _type: "block",
        style: "normal",
        listItem: "bullet",
        level: 1,
        markDefs: [],
        children: [{ _key: "s3", _type: "span", marks: [], text: "" }],
      },
    ]);
  });

  it("does not mutate the source blocks", () => {
    const t: SvTranslation = {
      _type: "profile",
      blocks: { descriptionSv: [["Hej", "!"], [""]] },
    };
    swedishPatches(profile, t);
    expect(profile.description?.[0].children?.[0].text).toBe("Hello");
  });

  it("throws with the document id when span counts differ", () => {
    const t: SvTranslation = {
      _type: "profile",
      blocks: { descriptionSv: [["Hej allihop!"], [""]] },
    };
    expect(() => swedishPatches(profile, t)).toThrow(/profile-1.*descriptionSv/);
  });

  it("throws with the document id when block counts differ", () => {
    const t: SvTranslation = {
      _type: "profile",
      blocks: { descriptionSv: [["Hej", "!"]] },
    };
    expect(() => swedishPatches(profile, t)).toThrow(/profile-1.*descriptionSv/);
  });

  it("targets array members by _key", () => {
    const t: SvTranslation = {
      _type: "profile",
      members: [
        { array: "communityWork", _key: "e7534276dff9", fields: { assignmentSv: "Styrelseledamot" } },
      ],
    };
    expect(swedishPatches(profile, t)).toEqual([
      {
        path: ["communityWork", { _key: "e7534276dff9" }, "assignmentSv"],
        value: "Styrelseledamot",
      },
    ]);
  });

  it("throws when a member _key does not exist", () => {
    const t: SvTranslation = {
      _type: "profile",
      members: [{ array: "communityWork", _key: "missing", fields: { assignmentSv: "x" } }],
    };
    expect(() => swedishPatches(profile, t)).toThrow(/profile-1.*missing/);
  });

  it("only patches fields present in the translation", () => {
    const t: SvTranslation = { _type: "profile", fields: { locationSv: "Göteborg, Sverige" } };
    expect(swedishPatches(profile, t)).toEqual([
      { path: ["locationSv"], value: "Göteborg, Sverige" },
    ]);
    expect(swedishPatches(profile, { _type: "profile" })).toEqual([]);
  });

  it("throws when the translation type does not match the document", () => {
    expect(() => swedishPatches(profile, { _type: "project" })).toThrow(/profile-1/);
  });
});

describe("translationFor", () => {
  const translations: Record<string, SvTranslation> = {
    "abc-123": { _type: "education", fields: { titleSv: "Systemutvecklare" } },
  };

  it("matches drafts to the published id", () => {
    expect(translationFor("abc-123", translations)).toBe(translations["abc-123"]);
    expect(translationFor("drafts.abc-123", translations)).toBe(translations["abc-123"]);
    expect(translationFor("other", translations)).toBeUndefined();
  });
});
