"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AllPets from "./_components/AllPets";
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
  const [isProfileEditing, setIsProfileEditing] = useState(false);

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

  const handleEditPetProfileButton = () => {
    setIsProfileEditing(true);
  };

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
            {/* updateProfile 함수를 props로 전달 */}
            {isProfileEditing ? (
              <Link href={"/pets"}>
                <button className="border border-black px-2 py-1 rounded-lg">
                  반려동물 프로필 추가등록
                </button>
              </Link>
            ) : (
              <Link href={"/pets"}>
                <button
                  className="border border-black px-2 py-1 rounded-lg"
                  onClick={handleEditPetProfileButton}
                >
                  반려동물 프로필 등록
                </button>
              </Link>
            )}
          </>
        ) : (
          <p>사용자 정보를 불러오는 중입니다...</p>
        )}
        <AllPets />
      </section>
    </main>
  );
}

export default MyPage;
