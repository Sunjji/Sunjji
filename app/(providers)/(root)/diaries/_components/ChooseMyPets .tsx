"use client";

import api from "@/api/api";
import Modal from "@/components/Modal";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

type ChooseMyPetsProps = {
  setSelected: Dispatch<SetStateAction<[] | null>>;
  pets: {
    age: number;
    butlerId: string;
    comment: string;
    created_at: string;
    gender: string;
    id: number;
    imageUrl: string;
    name: string;
    weight: number;
  }[];
};

function ChooseMyPets({
  setSelected,
  pets,
}: ChooseMyPetsProps): void | JSX.Element {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const closeModal = useModalStore((state) => state.closeModal);

  const { data: myPets = [] } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  const click = async (petId: number) => {
    const { data: pets } = await supabase
      .from("pets")
      .select("*")
      .eq("id", petId)
      .single();

    console.log(pets.id);
    if (!pets) return console.log("pets error");
    setSelected(pets.id);
    closeModal();
  };

  return (
    <Modal>
      <h4 className="mb-10">일기에 쓸 반려동물을 선택해주세요</h4>
      {myPets?.map((pet) => (
        <p
          onClick={() => click(pet.id)}
          key={pet.id}
          className="cursor-pointer hover:text-red-500"
        >
          {pet.name}
        </p>
      ))}
    </Modal>
  );
}

export default ChooseMyPets;
