"use client";

import api from "@/api/api";
import Modal from "@/components/Modal";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ChooseMyPetsProps = {
  setSelectedPetIds: Dispatch<SetStateAction<number[]>>;
};

function ChooseMyPets({ setSelectedPetIds }: ChooseMyPetsProps) {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const [profiles, setProfiles] = useState<Tables<"profiles">>();
  // const [myPets, setMyPets] = useState<Tables<"pets">[]>([]);
  const closeModal = useModalStore((state) => state.closeModal);

  const { data: myPets1 = [] } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId)
        .single();

      setProfiles(profiles);
    })();
  }, [currentUserId]);

  // 대표 펫 선택하지 못하게 제외함
  const myPets = myPets1?.filter((data) => data.id !== profiles?.firstPetId);

  const click = async (petId: number) => {
    const { data: pets } = await supabase
      .from("pets")
      .select("*")
      .eq("id", petId)
      .single();

    if (!pets) return console.log("pets error");
    setSelectedPetIds((selectedPets) => [...selectedPets, pets.id]);
    closeModal();
  };

  // useEffect(() => {
  //   (async () => {})();
  // }, [currentUserId]);

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
