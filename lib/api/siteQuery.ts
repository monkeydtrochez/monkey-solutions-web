import type { Locale } from "@/lib/i18n/config";

// English: the original query, untouched.
const enQuery = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
    _id,
    _type,
    title,

    _type == 'profile' => {
    profilePicture,
      "profilePictureUrl": profilePicture.asset->url,
      description,
      languages,
      mobile,
      email,
      location,
      personalitySkills,
      professionalSkills,
      skillGroups,
      communityWork,
      linkedInUrl,
      githubUrl,
      heroBio,
      availabilityStatus,
      orgNumber,
      readCvUrl,
      "resumeEnUrl": resumeEn.asset->url,
      "resumeSvUrl": resumeSv.asset->url
    },

      _type == 'education' => {
    school,
      start,
      end,
      fieldOfStudy
    },

      _type == 'workExperience' => {
      sortIndex,
      duration,
      description,
      company,
      current
    },

      _type == 'project' => {
      sortIndex,
      title,
      coverImage,
      "coverImageUrl": coverImage.asset->url,
      duration,
        client,
        site,
        tags,
        body,
        kind,
        "metrics": metrics[]{ label, value, suffix }
    }
}`;

// Swedish sibling fields are named `<field>Sv`. An empty Swedish value counts
// as missing, so the English field shows instead of an empty section.
const str = (f: string) =>
  `"${f}": select(defined(${f}Sv) && ${f}Sv != "" => ${f}Sv, ${f})`;
const arr = (f: string) => `"${f}": select(count(${f}Sv) > 0 => ${f}Sv, ${f})`;

const svQuery = `*[_type == 'profile' || _type == 'workExperience' || _type == 'education' || _type == 'project'] {
  _id,
  _type,
  ${str("title")},

  _type == 'profile' => {
    profilePicture,
    "profilePictureUrl": profilePicture.asset->url,
    ${arr("description")},
    ${arr("languages")},
    mobile,
    email,
    ${str("location")},
    ${arr("personalitySkills")},
    professionalSkills,
    skillGroups,
    "communityWork": communityWork[]{ _key, ${str("assignment")}, organisation },
    linkedInUrl,
    githubUrl,
    ${str("heroBio")},
    ${str("availabilityStatus")},
    orgNumber,
    readCvUrl,
    "resumeEnUrl": resumeEn.asset->url,
    "resumeSvUrl": resumeSv.asset->url
  },

  _type == 'education' => {
    school,
    start,
    end,
    ${str("fieldOfStudy")}
  },

  _type == 'workExperience' => {
    sortIndex,
    duration,
    ${arr("description")},
    company,
    current
  },

  _type == 'project' => {
    sortIndex,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    duration,
    client,
    site,
    tags,
    ${arr("body")},
    ${str("kind")},
    "metrics": metrics[]{ _key, ${str("label")}, value, ${str("suffix")} }
  }
}`;

export function buildSiteQuery(lang: Locale): string {
  return lang === "sv" ? svQuery : enQuery;
}
