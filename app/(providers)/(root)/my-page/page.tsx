"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import AllPets from "./_components/AllPets";
import UserProfile from "./_components/UserProfile";
import PetProfile from "./_components/PetProfile";

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
    <main className="flex justify-center">
      <section className="bg-white p-5 mt-10">
        <h1 className="text-3xl mb-5 font-bold">마이 페이지</h1>
        {profile ? (
          <>
            <UserProfile profile={profile} updateProfile={updateProfile} />{" "}
            <PetProfile />
          </>
        ) : (
          <p>사용자 정보를 불러오는 중입니다...</p>
        )}
        {profile && <AllPets />}
      </section>
    </main>
  );
}

export default MyPage;
