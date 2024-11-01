"use client";

import LogInModal from "@/components/LoginModal";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { ComponentProps } from "react";
import { RiMessage3Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";

interface CommentButtonProps {
  commentsCount: number;
}

function CommentButton({ commentsCount }: CommentButtonProps) {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const openModal = useModalStore((state) => state.openModal);
  const handleClick: ComponentProps<"button">["onClick"] = (e) => {
    e.preventDefault();
    // 로그인 하지 않았을 경우 로그인 모달 띄우기
    if (!currentUserId) {
      toast("💛 로그인을 해주세요", getToastOptions("warning"));
      return openModal(<LogInModal />);
    }
  };

  return (
    <button className="flex items-center z-20" onClick={handleClick}>
      <RiMessage3Line className="w-[30px] h-[30px] text-BrownPoint" />
      <h2 className="pl-1 font-bold">{commentsCount}</h2>
    </button>
  );
}

export default CommentButton;
