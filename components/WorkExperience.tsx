import React, { useContext } from "react";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import GlobalContext from "@/app/context/GlobalContext";

const WorkExperience = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "GloblaContext is null!";
  }

  const { workExperience } = globalContext;

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

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">EXPERIENCE</h3>
        {workExperience?.map((workExperienceItem, index) => (
          <div className="mb-6" key={index}>
            <h4 className="text-sm font-semibold">
              {workExperienceItem.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {workExperienceItem.duration.startYear} -
              {!workExperienceItem.duration.endYear
                ? " PRESENT "
                : ` ${workExperienceItem.duration.endYear}`}
            </p>
            <PortableText
              value={workExperienceItem.description}
              components={contentComponents}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default WorkExperience;
