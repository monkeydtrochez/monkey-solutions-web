import React from "react";

const WorkExperience = () => {
  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">EXPERIENCE</h3>
        <div className="mb-6">
          <h4 className="text-sm font-semibold">
            SENIOR SOFTWARE DEVELOPER | STENA LINE.
          </h4>
          <p className="text-sm text-gray-600">FROM 2022 TO PRESENT</p>
          <p className="text-sm text-gray-600 mt-2">
            Played an important role in one of the biggest developing teams of
            Stena Line which is the Freight team. Here i worked daily with
            implementing improvements and new features to all the digital sales
            platforms that the Freight Sales team uses. He mainly focuses on the
            backend side but assists as well on the logical parts of frontend
            when needed.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>
              Collaborated with cross-functional teams to ensure seamless
              implementations of new features
            </li>
            <li>Mentored junior developers</li>
          </ul>
        </div>
        <div className="mb-6">
          <h4 className="text-sm font-semibold">
            UX DESIGNER | CREATIVE SOLUTIONS CO.
          </h4>
          <p className="text-sm text-gray-600">FROM 2021 TO 2024</p>
          <p className="text-sm text-gray-600 mt-2">
            Designed user-centered interfaces for web and mobile applications,
            improving overall user satisfaction scores by 35%.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>
              Created wireframes, prototypes, and high-fidelity mockups using
              industry-standard tools
            </li>
            <li>
              Conducted A/B testing to optimize user flows and increase
              conversion rates
            </li>
            <li>
              Collaborated with developers to ensure accurate implementation of
              designs
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">
            JUNIOR UI/UX DESIGNER | DIGITAL FRONTIERS LLC
          </h4>
          <p className="text-sm text-gray-600">FROM 2019 TO 2021</p>
          <p className="text-sm text-gray-600 mt-2">
            Assisted in the design of user interfaces for various client
            projects, focusing on creating visually appealing and intuitive
            designs.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 mt-2">
            <li>
              Contributed to the development of the company's design system
            </li>
            <li>
              Participated in client meetings and presented design concepts
            </li>
            <li>Conducted competitive analysis to inform design strategies</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default WorkExperience;
