import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface AllPetProps {
  pets: Tables<"pets">[];
}

function AllPet({ pets: passedPets }: AllPetProps) {
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
      {pets?.map((pets) => (
        <li key={pets.id}>
          <h2>{pets.title}</h2>
          <img
            className="w-48 h-auto"
            src={`${baseURL}${pets.imageUrl}`}
            alt={pets.title}
          ></img>
        </li>
      ))}
    </ul>
  );
}

export default AllPet;
