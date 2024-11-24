import React, { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const Skills = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Global context is null";
  }

  const { profile } = globalContext;
  const personalitySkills = profile?.personalitySkills;
  const professionalSkills = profile?.professionalSkills;
  const languages = profile?.languages;

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">SKILLS</h3>
        <h4 className="text-sm font-semibold mb-1">PERSONALITY</h4>
        <ul className="list-disc list-inside text-sm space-y-1 mb-4">
          {personalitySkills?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h4 className="text-sm font-semibold mb-1">PROFESSIONAL</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {professionalSkills?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h4 className="text-sm font-semibold mt-5">LANGUAGES</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {languages?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Skills;
