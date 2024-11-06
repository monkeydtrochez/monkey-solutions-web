import GlobalContext from "@/app/context/GlobalContext";
import React, { useContext } from "react";
import { PortableText } from "@portabletext/react";

const Profile = () => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    return "Globalcontext is null";
  }

  const { profile } = globalContext;

  return (
    <>
      <h1 className="text-5xl font-light mb-2">
        Daniel <span className="text-orange-500 font-normal">T</span>
        rochez
      </h1>
      <h2 className="text-xl text-gray-600 mb-6">SOFTWARE DEVELOPER</h2>
      <div className="border-l-2 border-orange-500 pl-4 mb-8">
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <PortableText
          value={profile?.description}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="text-sm text-gray-600 mb-2">{children}</p>
              ),
            },
          }}
        />
        <h3 className="text-lg font-semibold mb-2">CONTACT</h3>
        <p className="text-sm text-gray-600">{profile?.mobile}</p>
        <p className="text-sm text-gray-600">{profile?.email}</p>
        <p className="text-sm text-gray-600">{profile?.location}</p>
      </div>
    </>
  );
};

export default Profile;
