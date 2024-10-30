"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useCallback, useEffect, useState } from "react";
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

    return alert("대표 반려동물을 정했다");
  };

  const handleClickSelect = () => {
    setShowSelectButton(true);
  };

  // 수정, 삭제 버튼이 아닌 곳을 클릭했을 때 수정, 삭제 버튼 사라지게 만들기
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        showSelectButton &&
        !target.closest(".edit-button-container") &&
        !target.closest(".edit-button")
      ) {
        setShowSelectButton(false);
      }
    },
    [showSelectButton]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      {showSelectButton ? (
        <div className="bg-white edit-button-container">
          <button
            className="border border-BrownPoint hover:bg-point rounded-md px-2 py-1"
            onClick={handleClickSelectButton}
          >
            대표 반려동물 선택하기
          </button>
        </div>
      ) : (
        <button>
          <IoIosMore onClick={handleClickSelect} />
        </button>
      )}
    </>
  );
}

export default MyFirstPetSelectButton;
