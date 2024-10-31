/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
function UserProfile() {
  const profiles = useAuthStore((state) => state.profile);

  const { data } = useQuery({
    queryKey: ["pet"],
    queryFn: () => api.pets.getMyFirstPet(),
  });

  console.log(data);

  return (
    <div className="flex items-center p-2 bg-[#FEFBF2] text-BrownPoint text-sm rounded-[100px]">
      <img
        className="mx-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
        src={profiles?.imageUrl}
        alt="프로필 이미지"
      />
      <div>
        <p>{profiles?.nickname} 집사님</p>
        <p>
          {data?.name}· {data?.breed} · {data?.gender}
        </p>
      </div>
    </div>
  );
}
export default UserProfile;
