"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import React, { useState } from "react";
import { IoIosMore } from "react-icons/io";

interface SelectButtonProps {
  petId: number;
  onSelect: (petId: number) => void; // 선택 시 호출되는 함수
}

function MyFirstPetSelectButton({ petId, onSelect }: SelectButtonProps) {
  const [showSelectButton, setShowSelectButton] = useState(false);
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const handleClickSelectButton = async () => {
    const asr = await supabase
      .from("profiles")
      .update({ firstPetId: petId })
      .eq("id", currentUserId!);

    console.log(asr);

    onSelect(petId);

    return alert("대표 반려동물을 정해다");
  };

  const handleClickSelect = () => {
    setShowSelectButton(true);
  };

  return (
    <>
      <button>
        <IoIosMore onClick={handleClickSelect} />
      </button>
      {showSelectButton && (
        <div className="bg-white edit-button-container  top-[10px] right-[-55px]">
          <button
            className="border border-BrownPoint hover:bg-point rounded-md px-2 py-1"
            onClick={handleClickSelectButton}
          >
            대표 반려동물 선택하기
          </button>
        </div>
      )}
    </>
  );
}

export default MyFirstPetSelectButton;
