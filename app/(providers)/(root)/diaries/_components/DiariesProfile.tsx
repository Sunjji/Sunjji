/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
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
        <p className="font-bold inline-block">{diary.author?.nickname}</p>
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
