import { describe, expect, it } from "vitest";
import { normalizeSanityData } from "./normalize";
import type {
  Education,
  Profile,
  Project,
  SanityApiResponse,
  WorkExperience,
} from "@/app/models/sanityTypes";

const profile = { _id: "p", _type: "profile", title: "Daniel" } as Profile;
const edu = (id: string) =>
  ({ _id: id, _type: "education", title: id }) as Education;
const work = (id: string, sortIndex: number) =>
  ({ _id: id, _type: "workExperience", title: id, sortIndex }) as WorkExperience;
const project = (id: string, sortIndex: number) =>
  ({ _id: id, _type: "project", title: id, sortIndex }) as Project;

const empty = { profile: null, education: [], workExperience: [], projects: [] };

describe("normalizeSanityData", () => {
  it("returns empty content for null and undefined", () => {
    expect(normalizeSanityData(null)).toEqual(empty);
    expect(normalizeSanityData(undefined)).toEqual(empty);
  });

  it("splits mixed input by _type and sorts work and projects by sortIndex", () => {
    const input: SanityApiResponse[] = [
      work("w3", 3),
      project("p2", 2),
      edu("e2"),
      profile,
      work("w1", 1),
      project("p3", 3),
      edu("e1"),
      work("w2", 2),
      project("p1", 1),
    ];
    const out = normalizeSanityData(input);
    expect(out.profile).toBe(profile);
    expect(out.workExperience.map((w) => w._id)).toEqual(["w1", "w2", "w3"]);
    expect(out.projects.map((p) => p._id)).toEqual(["p1", "p2", "p3"]);
    expect(out.education.map((e) => e._id)).toEqual(["e2", "e1"]);
  });

  it("does not mutate the input array", () => {
    const input: SanityApiResponse[] = [work("w2", 2), work("w1", 1)];
    const snapshot = [...input];
    normalizeSanityData(input);
    expect(input).toEqual(snapshot);
    expect(input[0]).toBe(snapshot[0]);
  });
});
