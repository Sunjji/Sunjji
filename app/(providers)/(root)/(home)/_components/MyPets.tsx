"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQueries } from "@tanstack/react-query";
import MyFirstPetSelectButton from "./MyFirstPetSelectButton";
import { useEffect, useState } from "react";
import { FaWheelchair } from "react-icons/fa";

function MyPets() {
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const [firstPetId, setFirstPetId] = useState(null);

  const result = useQueries({
    queries: [
      {
        queryKey: ["pets", { currentUserId }],
        queryFn: () => api.pets.getMyPets(currentUserId!),
        enabled: !!currentUserId,
      },
      {
        queryKey: ["profiles"],
        queryFn: () => api.pets.getMyFirstPet(firstPetId!),
        enabled: !!firstPetId,
      },
    ],
  });

  useEffect(() => {
    const petsResult = result[0].data; // pets 쿼리 결과 가져오기
    if (petsResult && petsResult.length > 0) {
      // petsResult에서 firstPetId를 추출
      const firstPet = petsResult[0].firstPetId; // 여기를 확인하고 적절히 수정
      setFirstPetId(firstPet); // UUID 형식의 firstPetId 설정
    }
  }, [result[0].data]); // pets 데이터가 변경될 때마다 실행

  const profilesResult = result[1].data; // profiles 쿼리 결과 가져오기
  console.log(profilesResult); // profilesResult 확인

  const petsData = result[0].data;

  return (
    <>
      {petsData ? (
        petsData.map((pet) => (
          <div key={pet.id}>
            <MyFirstPetSelectButton petId={pet.id} />
            <img
              className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
              src={`${baseURL}${pet.imageUrl}`}
            />
            <h2>
              {pet.name} · {pet.breed} · {pet.gender}
            </h2>
            {firstPetId === pet.id && <FaWheelchair />}
            <p>
              {pet.weight}kg / {pet.age}개월
            </p>
          </div>
        ))
      ) : (
        <p>반려동물 불러오는 중...</p>
      )}
    </>
  );
}

export default MyPets;
