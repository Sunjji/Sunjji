"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Profile = Tables["profiles"];
type Pet = Tables["pets"];

function DiariesProfile() {
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet | null>(null);

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
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();

      if (error) {
        console.log("diary error", error);
        return;
      }
      setProfile(profiles);

      if (profiles?.firstPetId) {
        const { data: pets, error: petsError } = await supabase
          .from("pets")
          .select("*")
          .eq("id", profiles.firstPetId)
          .single();

        if (petsError) {
          console.log("pets error", petsError);
          return;
        }
        setPets(pets);
      }
    })();
  }, [currentUserId]);

  return (
    <div className="flex items-center p-2 text-BrownPoint text-sm">
      <img
        className="inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
        src={profile?.imageUrl || ""}
        alt="프로필 이미지"
      />
      <div className="ml-2">
        <p className="font-bold inline-block">{profile?.nickname}</p>
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
