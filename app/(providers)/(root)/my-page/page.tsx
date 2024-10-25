"use client";

import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import AllPets from "./_components/AllPets";
import CreatePet from "./_components/PetProfile";
import UserProfile from "./_components/UserProfile";

type Profile = {
  id: string;
  nickname: string;
  createdAt: string;
  imageUrl: string;
  comment: string;
};

function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await supabase.auth.getUser();
      const user = response.data.user;

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id);

      if (profilesData) {
        setProfile(profilesData[0]);
      }
    };
    getCurrentUser();
  }, []);

  const updateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
  };

  return (
    <Page>
      <div className="flex flex-wrap gap-[5%] rounded-2xl bg-whitePoint p-8 w-full">
        <div className="w-[25%]">
          <h1 className="text-2xl font-bold mb-5 text-BrownPoint">내 프로필</h1>
          {profile ? (
            <UserProfile profile={profile} updateProfile={updateProfile} />
          ) : (
            <p>사용자 정보를 불러오는 중입니다...</p>
          )}
        </div>

        <div className="w-[70%]">
          <h1 className="text-2xl font-bold mb-5 text-BrownPoint">반려동물</h1>
          <CreatePet />
          {profile && <AllPets />}
        </div>
      </div>
    </Page>
  );
}

export default MyPage;
