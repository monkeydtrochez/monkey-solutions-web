import React, { useContext } from "react";
import GlobalContext from "@/app/context/GlobalContext";

const Education = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "GlobalContext is null!";
  }

  const { education } = globalContext;

  return (
    <>
      <div>
        <h3 className="text-lg font-semibold mb-2">EDUCATION</h3>
        <h4 className="text-sm font-semibold">{education?.title}</h4>
        <p className="text-sm text-gray-600">{education?.school}</p>
        <p className="text-sm text-gray-600 mb-2">
          {education?.start} - {education?.end}
        </p>
      </div>
    </>
  );
};

export default Education;
