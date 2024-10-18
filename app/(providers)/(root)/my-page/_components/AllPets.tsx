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
    <ul>
      <h1 className="bold">사진을 누르면 수정페이지로 갈수 있습니다</h1>
      {pets?.map((pet) => (
        <li key={pet.id}>
          <h2>{pet.name}</h2>
          <button
            className="border border-black px-2 py-1 rounded-lg"
            onClick={() => handleClickDeletePets(pet.id)}
          >
            반려동물 삭제
          </button>
          <Link href={`/pets/${pet.id}/edit`}>
            <img
              className="w-48 h-auto"
              src={`${baseURL}${pet.imageUrl}`} //img를 소문자로 써서 생기는것
            ></img>
          </Link>

          <p>몸무게 : {pet.weight}</p>
          <p>나이 : {pet.age}</p>
          <p>성별 : {pet.gender}</p>
          <p>반려동물 한줄평가 : {pet.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default AllPets;
