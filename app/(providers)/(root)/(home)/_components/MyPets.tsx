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

  useEffect(() => {
    const storedPetId = localStorage.getItem("firstPetId");
    if (storedPetId) {
      setFirstPetId(Number(storedPetId));
    }
  }, []);

  useEffect(() => {
    if (firstPetId !== null) {
      localStorage.setItem("firstPetId", firstPetId.toString());
      setFirstPetIdState(firstPetId);
    }
  }, [firstPetId]);
  useEffect(() => {
    const firstPetData = result[1].data;

    if (firstPetData && firstPetData.data && firstPetData.data.length > 0) {
      setFirstPetId(firstPetData.data[0].firstPetId);
    }
  }, [firstPetData]);

  const handlePetSelect = (petId: number) => {
    setFirstPetId(petId);
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
            <MyFirstPetSelectButton petId={pet.id} onSelect={handlePetSelect} />
          </div>
        ))
      ) : (
        <p>반려동물 불러오는 중...</p>
      )}
    </div>
  );
}

export default MyPets;
