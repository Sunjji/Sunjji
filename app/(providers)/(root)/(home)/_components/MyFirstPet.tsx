"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";

function MyFirstPet() {
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const { data } = useQuery({
    queryKey: ["pets"],
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  const pets = data || [];

  console.log(pets);

  return (
    <>
      {pets.map((pet) => (
        <div key={pet.id}>
          <img
            className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
            src={`${baseURL}${pet.imageUrl}`}
          ></img>
          <h2>
            {pet.name} · {pet.breed} · {pet.gender}
          </h2>
          <p>
            {pet.weight}kg / {pet.age}개월
          </p>
        </div>
      ))}
    </>
  );
}

export default MyFirstPet;
