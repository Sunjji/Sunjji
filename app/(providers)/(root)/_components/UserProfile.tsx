/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
function UserProfile() {
  const profile = useAuthStore((state) => state.profile);

  const { data: firstPet } = useQuery({
    queryKey: ["firstPet"],
    queryFn: () => api.pets.getMyFirstPet(),
    enabled: !!profile,
  });

  return (
    <div className="flex items-center p-2 bg-[#FEFBF2] text-BrownPoint text-sm rounded-[100px]">
      <img
        className="mx-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
        src={profile?.imageUrl}
        alt="프로필 이미지"
      />
      <div>
        <p>{profile?.nickname} 집사님</p>
        <p>
          {firstPet?.name}· {firstPet?.breed} · {firstPet?.gender}
        </p>
      </div>
    </div>
  );
}
export default UserProfile;
