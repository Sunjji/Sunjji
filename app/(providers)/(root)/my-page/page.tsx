"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import AllPets from "./_components/AllPets";
import PetProfile from "./_components/PetProfile";
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
    <main className="flex flex-col p-5">
      <h1 className="text-3xl mb-5 font-bold">마이 페이지</h1>
      <section className="flex gap-10">
        <div className="w-[30%] bg-point p-10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-3">내 정보</h1>
          {profile ? (
            <UserProfile profile={profile} updateProfile={updateProfile} />
          ) : (
            <p>사용자 정보를 불러오는 중입니다...</p>
          )}
        </div>

        <div className="w-[70%] bg-point p-10 rounded-3xl">
          <h1 className="text-3xl font-bold mb-3">반려동물 정보</h1>
          <PetProfile />
          {profile && <AllPets />}
        </div>
      </section>
    </main>
  );
}

export default MyPage;
