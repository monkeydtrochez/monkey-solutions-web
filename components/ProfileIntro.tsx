import { Profile } from "@/app/models/sanityTypes";
import Image from "next/image";
import SocialMediaButtons from "./ui/SocialMediaButtons";
import Skills from "./Skills";

interface ProfileIntroProps {
  profile: Profile;
  imageUrl: string;
}

const ProfileIntro = ({ profile, imageUrl }: ProfileIntroProps) => {
  return (
    <>
      <div className="bg-gray-100 rounded-t-full overflow-hidden mb-6">
        <div className="w-full h-auto object-cover">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Daniel Trochez"
              width={800}
              height={600}
            />
          )}
        </div>
      </div>
      {profile && (
        <SocialMediaButtons
          githubUrl={profile.githubUrl}
          linkedInUrl={profile.linkedInUrl}
        />
      )}
      <Skills />
    </>
  );
};

export default ProfileIntro;
