"use client";

import api from "@/api/api";
import Modal from "@/components/Modal";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

type ChooseMyPetsProps = {
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<boolean>>;
};

function ChooseMyPets({ isSelected, setIsSelected }: ChooseMyPetsProps) {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const closeModal = useModalStore((state) => state.closeModal);

  const { data: myPets } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  const handleClick = async () => {
    if (isSelected) return setIsSelected(false);
    closeModal();
  };

  return (
    <Modal>
      <h4 className="mb-10">일기에 쓸 반려동물을 선택해주세요</h4>
      {myPets?.map((pet) => (
        <p onClick={handleClick} className="cursor-pointer hover:text-red-500">
          {pet.name}
        </p>
      ))}
    </Modal>
  );
}

export default ChooseMyPets;
