"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface AllPetProps {
  pets: Tables<"pets">[];
}

function AllPet({ pets: passedPets }: AllPetProps) {
  const [butlerId, setButlerId] = useState<string | undefined>("");
  const getButlerId = async () => {
    const { data } = await supabase.auth.getUser();

    const getId = data.user?.id;

    setButlerId(getId);
  };

  useEffect(() => {
    getButlerId();
  }, []);
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const { data: pets } = useQuery({
    queryKey: ["pets"],
    queryFn: async () =>
      await supabase
        .from("pets")
        .select()
        .then((response) => response.data),
    initialData: passedPets,
  });

  return (
    <ul>
      <h1 className="bold">사진을 누르면 수정페이지로 갈수 있습니다</h1>
      {pets?.map((pets) => (
        <li key={pets.id}>
          <h2>{pets.name}</h2>

          <Link href={`/profile/${butlerId}/edit`}>
            <button
              onClick={getButlerId}
              className="border border-black px-2 py-1 rounded-lg"
            ></button>
            펫 프로필 추가등록
            <img
              className="w-48 h-auto"
              src={`${baseURL}${pets.imageUrl}`}
            ></img>
          </Link>
          <p>몸무게 : {pets.weight}</p>
          <p>나이 : {pets.age}</p>
          <p>성별 : {pets.gender}</p>
          <p>반려동물 한줄평가 : {pets.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default AllPet;
