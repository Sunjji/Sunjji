"use client";

import { supabase } from "@/supabase/client";
import { ComponentProps, useEffect, useState } from "react";
import { RiMessage3Line } from "react-icons/ri";

interface CommentButtonProps {
  diaryId: string;
}

function CommentButton({ diaryId }: CommentButtonProps) {
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    // 댓글 수를 가져오는 함수
    const fetchCommentCount = async () => {
      const { count } = await supabase
        .from("comments")
        .select("id", { count: "exact" })
        .eq("diaryId", diaryId);

      setCommentCount(count || 0);
    };

    fetchCommentCount();
  }, [diaryId]);

  // 댓글 버튼 클릭
  const handleCommentButtonClick: ComponentProps<"button">["onClick"] = (
  ) => {
    // 댓글 버튼 눌렀을 때 기능
  };

  return (
    <button
      className="flex items-center z-20"
      onClick={handleCommentButtonClick}
    >
      <RiMessage3Line className="w-[30px] h-[30px] text-BrownPoint" />
      <p>{commentCount}</p>
    </button>
  );
}

export default CommentButton;
