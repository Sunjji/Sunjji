"use client";
import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQueries } from "@tanstack/react-query";
import MyFirstPetSelectButton from "./MyFirstPetSelectButton";
import { FaWheelchair } from "react-icons/fa";
function MyPets() {
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const firstPetIdState = useAuthStore((state) => state.firstPetIdState);
  const setFirstPetIdState = useAuthStore((state) => state.setFirstPetIdState);
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

  const handlePetSelect = (petId) => {
    setFirstPetIdState(petId);

    console.log(petId);
  };
  return (
    <>
      {petsData ? (
        petsData.map((pet) => (
          <div key={pet.id}>
            <MyFirstPetSelectButton petId={pet.id} onSelect={handlePetSelect} />
            <img
              className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
              src={`${baseURL}${pet.imageUrl}`}
            />
            <h2>
              {pet.name} · {pet.breed} · {pet.gender}
            </h2>
            {firstPetIdState === pet.id && <FaWheelchair />}
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
