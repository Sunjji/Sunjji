"use client";
import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQueries } from "@tanstack/react-query";
import MyFirstPetSelectButton from "./MyFirstPetSelectButton";
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

  const handlePetSelect = (petId: number) => {
    setFirstPetIdState(petId);
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
            <div className="flex flex-col">
              <p className="font-semibold">
                {pet.name} · {pet.breed} · {pet.gender}
              </p>

              <p>{pet.weight}kg</p>
            </div>

            <div className="ml-auto flex flex-col items-center justify-center">
              <MyFirstPetSelectButton
                petId={pet.id}
                onSelect={handlePetSelect}
              />

              {firstPetIdState === pet.id && "👑"}
            </div>
          </div>
        ))
      ) : (
        <p>반려동물 불러오는 중...</p>
      )}
    </div>
  );
}
export default MyPets;
