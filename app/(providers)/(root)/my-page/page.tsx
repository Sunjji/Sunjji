"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import "dayjs/locale/ko";
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
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    dayjs.locale("ko");
    const today = dayjs().format("DD dddd");
    setCurrentDate(today);

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
    <main className="flex flex-col p-[2.5vh]">
      <section className="flex flex-col bg-point rounded-3xl h-[95vh]">
        <h1 className="px-10 pt-10 pb-7 text-3xl font-bold text-BrownPoint">{currentDate}</h1>
        <div className="flex flex-wrap gap-[5%] rounded-2xl bg-whitePoint p-8 w-[95%] ml-[2.5%]">
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
            <PetProfile />
            {profile && <AllPets />}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MyPage;
