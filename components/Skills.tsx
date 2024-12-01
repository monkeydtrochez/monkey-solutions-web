import React, { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";
import { Badge } from "./ui/badge";

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
        <div className=" flex flex-wrap gap-1 mb-4">
          {personalitySkills?.map((item, index) => (
            <Badge key={index} className="text-xs text-gray-700">
              {item}
            </Badge>
          ))}
        </div>
        <h4 className="text-sm font-semibold mb-1">PROFESSIONAL</h4>
        <div className=" flex flex-wrap gap-1 mb-4">
          {professionalSkills?.map((item, index) => (
            <Badge key={index} className="text-xs text-gray-700">
              {item}
            </Badge>
          ))}
        </div>
        <h4 className="text-sm font-semibold mt-5">LANGUAGES</h4>
        <div className=" flex flex-wrap gap-1 mb-4">
          {languages?.map((item, index) => (
            <Badge key={index} className="text-xs text-gray-700">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default Skills;
