"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useEffect, useState } from "react";

function DiariesProflie() {
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [profile, setProfile] = useState<Tables<"profiles">>();
  const [pets, setPets] = useState<Tables<"pets">>();

  useEffect(() => {
    (async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();

      const { data: pets, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .eq("id", profiles.firstPetId)
        .single();

      if (error) return console.log("diary error", error);
      if (petsError) return console.log("pets error", petsError);
      setProfile(profiles);
      setPets(pets);
    })();
  }, [currentUserId]);
  return (
    <div className="flex items-center p-2  text-BrownPoint text-sm ">
      <img
        className="mx-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
        src={profile?.imageUrl}
        alt="프로필 이미지"
      />
      <div>
        <p className="font-bold inline-block">{profile?.nickname}</p>
        <p className="ml-2 text-xs inline-block">
          {pets?.name} · {pets?.gender}
        </p>
      </div>
    </div>
  );
}
export default DiariesProflie;
