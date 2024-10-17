"use client";

import { ComponentProps } from "react";
import { FaRegHeart } from "react-icons/fa";

function HeartButton() {
  const handleClickHeartButton: ComponentProps<"button">["onClick"] = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    // 좋아요 버튼 눌렀을 때 기능
  };

  return (
    <button
      className="flex items-center gap-[2px] z-20"
      onClick={handleClickHeartButton}
    >
      <FaRegHeart className="mt-[2px] w-[25px] h-[25px] text-BrownPoint" />
      <p>123</p>
    </button>
  );
}

export default HeartButton;
