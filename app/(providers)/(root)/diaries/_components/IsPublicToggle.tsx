"use client";

import { Dispatch, SetStateAction } from "react";

type IsPublicToggleProps = {
  isPublic: boolean;
  setIsPublic: Dispatch<SetStateAction<boolean>>;
};

function IsPublicToggle({ isPublic, setIsPublic }: IsPublicToggleProps) {
  // 공개/비공개 버튼
  const handleToggleIsPublic = async () => {
    if (isPublic) {
      setIsPublic(false);
    } else {
      setIsPublic(true);
    }
  };
  return (
    <button
      type="button"
      onClick={handleToggleIsPublic}
      className={`
        ${isPublic ? "bg-BrownPoint text-point" : "text-BrownPoint bg-point"}
        py-2 rounded-[8px] w-[100px] h-[40px] font-semibold text-center transition duration-300
        text-BrownPoint border
        `}
    >
      {isPublic ? "공개 일기" : "비공개 일기"}
    </button>
  );
}

export default IsPublicToggle;
