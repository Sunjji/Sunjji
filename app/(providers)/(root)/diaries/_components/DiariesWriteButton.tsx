"use client";
import { useAuthStore } from "@/zustand/auth.store";
import { useRouter } from "next/navigation";

function DiariesWriteButton() {
  const currentUserId = useAuthStore((state) => state.currentUserId);

  console.log(currentUserId);
  const router = useRouter();

  const handleClickDiariesWriteButton = () => {
    // 일기쓰기 눌렀을 때
    router.push("/diaries/write");
  };

  return (
    <>
      {currentUserId !== null ? (
        <button
          className="rounded-[8px] w-[150px] h-[60px] text-3xl text-opacity-50 font-semibold text-BrownPoint bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white" // 선주가 버튼 테두리 빼라고 요청함
          onClick={handleClickDiariesWriteButton}
        >
          일기 쓰기
        </button>
      ) : null}
    </>
  );
}

export default DiariesWriteButton;
