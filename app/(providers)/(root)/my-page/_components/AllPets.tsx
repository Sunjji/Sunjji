"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function AllPets() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const { mutate: deletePets } = useMutation({
    mutationFn: api.pets.deleteMyPets,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pets"], exact: true }),
    mutationKey: ["blabla"],
  });
  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  const handleClickDeletePets = async (petId: number) => {
    deletePets(petId);

    if (pets) return alert("반려동물 삭제에 성공하셨습니다");
  };

  return (
    <ul className="flex flex-wrap gap-4 justify-between">
      {pets?.map((pet) => (
        <li key={pet.id} className="flex flex-col items-center border p-4 w-64">
          <h2>{pet.name}</h2>

          <img
            className="w-full h-auto rounded-md mb-4"
            src={`${baseURL}${pet.imageUrl}`}
          ></img>

          <p>몸무게 : {pet.weight}</p>
          <p>나이 : {pet.age}</p>
          <p>성별 : {pet.gender}</p>
          <p>반려동물 한줄평가 : {pet.comment}</p>
          <div className="flex justify-between gap-5">
            <Link href={`/pets/${pet.id}/edit`}>
              <button className="border border-black px-2 py-1 rounded-lg">
                반려동물 수정
              </button>
            </Link>
            <button
              className="border border-black px-2 py-1 rounded-lg"
              onClick={() => handleClickDeletePets(pet.id)}
            >
              반려동물 삭제
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default AllPets;
