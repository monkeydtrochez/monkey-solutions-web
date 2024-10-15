import React from "react";

const Profile = () => {
  return (
    <>
      {" "}
      <h1 className="text-5xl font-light mb-2">
        Daniel <span className="text-orange-500 font-normal">T</span>
        rochez
      </h1>
      <h2 className="text-xl text-gray-600 mb-6">SOFTWARE DEVELOPER</h2>
      <div className="border-l-2 border-orange-500 pl-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">PROFILE</h3>
        <p className="text-sm text-gray-600 mb-4">
          Career objective short description here & omnis iste volnmperisam
          eaque ipsa quae ab illo inve ntore veritatis et quasi hlecto beatae
          vitae. Career objective short description here & omnis iste ntsrut
          voluptae lorem ipsum dolor objective.
        </p>
        <h3 className="text-lg font-semibold mb-2">CONTACT</h3>
        <p className="text-sm text-gray-600">P: +4676 032 07 26</p>
        <p className="text-sm text-gray-600">E: daniel@monkeysolutions.se</p>
        <p className="text-sm text-gray-600">Gothenburg, Sweden</p>
      </div>
    </>
  );
};

export default Profile;
