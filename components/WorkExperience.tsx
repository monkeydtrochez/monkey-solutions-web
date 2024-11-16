import React, { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import WorkExperienceItem from "./WorkExperienceItem";

const WorkExperience = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "GloblaContext is null!";
  }

  const { workExperience } = globalContext;

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">EXPERIENCE</h3>
        {workExperience &&
          workExperience.map((workExperienceItem, index) => (
            <WorkExperienceItem
              key={index}
              workExperience={workExperienceItem}
            />
          ))}
      </div>
    </>
  );
};

export default WorkExperience;
