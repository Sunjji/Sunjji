"use client";

import { ComponentProps } from "react";
import { RiMessage3Line } from "react-icons/ri";

function CommentButton() {
  const handleClickCommentButton: ComponentProps<"button">["onClick"] = (
    event
  ) => {
    event.stopPropagation();
    event.preventDefault();
    // 댓글 버튼 눌렀을 때 기능
  };

  return (
    <button
      className="flex items-center z-20"
      onClick={handleClickCommentButton}
    >
      <RiMessage3Line className="w-[30px] h-[30px] text-BrownPoint" />
      <p>12</p>
    </button>
  );
}

export default CommentButton;
