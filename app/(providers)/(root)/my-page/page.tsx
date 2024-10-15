/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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

      if (user) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);

        if (profilesData && profilesData.length > 0) {
          setProfile(profilesData[0]);
        }
      }
    };
    getCurrentUser();
  }, []);

  return (
    <main className="flex justify-center">
      <section className="bg-white p-5 mt-10">
        <h1 className="text-3xl mb-5 font-bold">마이 페이지</h1>
        {profile ? (
          <>
            <p className="text-xl">이름: {profile.nickname}</p>
            <img className="w-32 inline rounded-xl" src={profile.imageUrl} alt="Profile" />
            <p className="text-xl">한 줄 소개: {profile.comment}</p>
            <p className="text-xl">
              계정 생성 날짜:{" "}
              {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
            </p>
          </>
        ) : (
          <p>사용자 정보를 불러오는 중입니다...</p>
        )}
      </section>
    </main>
  );
}

export default MyPage;
