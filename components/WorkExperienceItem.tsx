import { WorkExperience } from "@/app/models/sanityTypes";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import React from "react";

interface WorkExperienceItemProps {
  workExperience: WorkExperience;
}

const contentComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => {
      return <p className="text-sm text-gray-600 mb-2">{children}</p>;
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside text-sm space-y-1 mt-2">
        {children}
      </ul>
    ),
  },
};

const WorkExperienceItem = ({ workExperience }: WorkExperienceItemProps) => {
  return (
    <>
      <div className="mb-6">
        <h4 className="text-sm font-semibold">{workExperience.title}</h4>
        <p className="text-sm text-gray-600 mb-2">
          {workExperience.duration.startYear} -
          {!workExperience.duration.endYear
            ? " PRESENT "
            : ` ${workExperience.duration.endYear}`}
        </p>
        <PortableText
          value={workExperience.description}
          components={contentComponents}
        />
      </div>
    </>
  );
};

export default WorkExperienceItem;
