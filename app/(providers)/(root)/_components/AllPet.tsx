"use client";

import { supabase } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function AllPet() {
  const [currentUserId, setCurrentUserId] = useState<string>();

  useEffect(() => {
    supabase.auth
      .getUser()
      .then((response) => setCurrentUserId(response.data.user?.id));
  }, []);

  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const { data: pets } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: async () =>
      await supabase
        .from("pets")
        .select()
        .eq("butlerId", currentUserId)
        .then((response) => response.data),
  });

  return (
    <ul>
      <h1 className="bold">사진을 누르면 수정페이지로 갈수 있습니다</h1>
      {pets?.map((pets) => (
        <li key={pets.id}>
          <h2>{pets.name}</h2>

          <Link href={`/profile/${pets.id}/edit`}>
            <button className="border border-black px-2 py-1 rounded-lg"></button>
            <img
              className="w-48 h-auto"
              src={`${baseURL}${pets.imageUrl}`} //img를 소문자로 써서 생기는것
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
