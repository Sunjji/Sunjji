"use client";
import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQueries } from "@tanstack/react-query";
import MyFirstPetSelectButton from "./MyFirstPetSelectButton";
import { FaWheelchair } from "react-icons/fa";
import { useEffect, useState } from "react";

function MyPets() {
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const firstPetIdState = useAuthStore((state) => state.firstPetIdState);
  const setFirstPetIdState = useAuthStore((state) => state.setFirstPetIdState);
  const [firstPetId, setFirstPetId] = useState<number | null>(null);

  const result = useQueries({
    queries: [
      {
        queryKey: ["pets", { currentUserId }],
        queryFn: () => api.pets.getMyPets(currentUserId!),
        enabled: !!currentUserId,
      },
      {
        queryKey: ["profiles"],
        queryFn: () => api.pets.getMyFirstPet(currentUserId!),
        enabled: !!firstPetIdState,
      },
    ],
  });

  const petsData = result[0].data;
  const firstPetData = result[1].data;

  // 첫 번째 반려동물 정보를 로컬 스토리지에서 불러오기
  useEffect(() => {
    const storedPetId = localStorage.getItem("firstPetId");
    if (storedPetId) {
      setFirstPetId(Number(storedPetId)); // 문자열을 숫자로 변환하여 상태에 설정
    }
  }, []);

  // firstPetId가 변경될 때 로컬 스토리지에 저장
  useEffect(() => {
    if (firstPetId !== null) {
      localStorage.setItem("firstPetId", firstPetId.toString()); // 숫자를 문자열로 변환하여 저장
      setFirstPetIdState(firstPetId); // Zustand 상태에도 업데이트
    }
  }, [firstPetId]);

  // firstPetId를 서버에서 가져온 값으로 업데이트
  useEffect(() => {
    if (firstPetData && firstPetData.length > 0) {
      setFirstPetId(firstPetData[0].firstPetId); // 첫 번째 반려동물 ID로 업데이트
    }
  }, [firstPetData]);

  const handlePetSelect = (petId) => {
    setFirstPetId(petId); // 사용자가 선택한 반려동물의 ID로 업데이트
  };

  return (
    <div className="mt-8 pb-3 flex flex-col gap-y-4 text-sm text-BrownPoint w-full h-[calc(100%-20px)] overflow-y-auto">
      {petsData ? (
        petsData.map((pet) => (
          <div key={pet.id} className="flex gap-x-4 border rounded-lg p-4">
            <img
              className="rounded-full bg-white object-cover w-10 h-10"
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
    </div>
  );
}

export default MyPets;
