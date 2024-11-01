/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface DiaryBoxProps {
  diary: Exclude<
    Awaited<ReturnType<typeof api.diaries.getPublicDiaries>>,
    null
  >[number];
}

function DiariesProfile({ diary }: DiaryBoxProps) {
  const [pets, setPets] = useState<Tables<"pets">>();

  const { data: popularDiaries = [] } = useQuery({
    queryKey: ["diaries", { type: "popular" }],
    queryFn: api.diaries.getPopularDiaries,
  });
  const popular = popularDiaries.map((data) => data.id);

  // 나이 계산 함수
  function calculateAge(birthDate: string): string {
    const birth = dayjs(birthDate);
    const today = dayjs();
    const years = today.diff(birth, "year");
    const months = today.diff(birth, "month");

    return years < 1 ? `${months}개월` : `${years}살`;
  }

  useEffect(() => {
    (async () => {
      if (diary.author?.firstPetId) {
        const { data: pets, error: petsError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", diary.author?.firstPetId)
          .single();
        if (petsError) {
          return console.log("pets error", petsError);
        }
        setPets(pets);
      }
    })();
  }, [diary]);

  return (
    <div className="flex items-center p-2 text-BrownPoint text-sm">
      <img
        className="inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
        src={diary.author?.imageUrl || ""}
        alt="프로필 이미지"
      />
      <div className="ml-2">
        <p className="font-bold flex gap-x-4">
          {diary.author?.nickname}

          {/* 인기있는 일기라면 불 이모지 붙여주기 */}
          {popular.includes(diary.id) ? (
            <img
              className="w-5 h-5"
              src="https://em-content.zobj.net/source/apple/391/fire_1f525.png"
              alt="이달의 인기 일기 이모지"
            />
          ) : null}
        </p>
        <p className="font-bold ml-2 text-xs inline-block">
          {pets?.name} · {pets?.breed} · {pets?.gender}
        </p>
        <p className="text-xs">
          {pets?.weight}kg / {pets?.birth ? calculateAge(pets.birth) : ""}
        </p>
      </div>
    </div>
  );
}

export default DiariesProfile;
