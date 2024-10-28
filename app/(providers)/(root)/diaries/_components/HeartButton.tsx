"use client";

import LogInModal from "@/components/LoginModal";
import { supabase } from "@/supabase/client";
import { useModalStore } from "@/zustand/modal.store";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface HeartButtonProps {
  diaryId: number;
}

function HeartButton({ diaryId }: HeartButtonProps) {
  const [like, setLike] = useState(0); // 좋아요 수
  const [isLike, setIsLike] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    // 현재 사용자 정보를 가져오는 함수
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // 좋아요 수와 현재 사용자의 좋아요 여부 저장
    const fetchLikes = async () => {
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact" })
        .eq("diaryId", diaryId);

      setLike(count || 0);

      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("diaryId", diaryId)
        .eq("userId", userId);

      setIsLike(data ? data.length > 0 : false);
    };

    fetchLikes();
  }, [diaryId, userId]);

  // 좋아요 버튼 클릭
  const handleClickHeartButton = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();

    // 좋아요 여부가 아직 저장되지 않았을 경우 return
    if (isLike === null) return;

    // 로그인 하지 않았을 경우 로그인 모달 띄우기
    if (!userId) {
      openModal(<LogInModal />);
      return;
    }

    // 좋아요가 눌러져 있는지 확인
    if (isLike) {
      // 눌러져 있을 경우
      await supabase
        .from("likes")
        .delete()
        .eq("diaryId", diaryId)
        .eq("userId", userId);
      setLike(like - 1);
      setIsLike(false);
    } else {
      // 눌러져 있지 않은 경우
      await supabase.from("likes").insert({ diaryId, userId });
      setLike(like + 1);
      setIsLike(true);
    }
  };

  return (
    <button
      className="flex items-center gap-[2px] z-20"
      onClick={handleClickHeartButton}
    >
      {/* 좋아요를 눌렀는지에 따라 이미지 변경 */}
      {isLike ? (
        <FaHeart className="mt-[2px] w-[25px] h-[25px] text-BrownPoint" />
      ) : (
        <FaRegHeart className="mt-[2px] w-[25px] h-[25px] text-BrownPoint" />
      )}
      {/* 좋아요 수에 따라 값이 변경 */}
      <p>{like}</p>
    </button>
  );
}

export default HeartButton;
