"use client";
import { Tables } from "@/supabase/database.types";
import { FaWheelchair } from "react-icons/fa";
import MyFirstPetSelectButton from "./MyFirstPetSelectButton";

interface MyAllPetsProps {
  pets: Tables<"pets">[] | null | undefined;
  firstPetId: number | undefined;
}

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function MyAllPets({ pets = [], firstPetId }: MyAllPetsProps) {
  return (
    <div className="mt-8 pb-3 flex flex-col gap-y-4 text-sm text-BrownPoint w-full h-[calc(100%-20px)] overflow-y-auto">
      {pets.map((pet) => (
        <div key={pet.id} className="flex gap-x-4 border rounded-lg p-4">
          <img
            className="rounded-full bg-white object-cover w-10 h-10"
            src={`${baseURL}${pet.imageUrl}`}
          />
          <h2>
            {pet.name} · {pet.breed} · {pet.gender}
          </h2>
          {!!firstPetId && firstPetId === pet.id && <FaWheelchair />}
          <p>{/* {pet.weight}kg / {pet.age}개월 */}</p>
          <MyFirstPetSelectButton petId={pet.id} />
        </div>
      ))}
    </div>
  );
}

export default MyAllPets;
