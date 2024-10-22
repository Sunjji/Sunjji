"use client";
import { useRouter } from "next/navigation";

function DiariesWriteButton() {
  const router = useRouter();

  const handleClickDiariesWriteButton = () => {
    // 일기쓰기 눌렀을 때
    router.push("/diaries/write");
  };

  return (
    <button
      className="rounded-[8px] w-[150px] h-[60px] text-3xl text-opacity-50 font-semibold text-BrownPoint bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white"
      onClick={handleClickDiariesWriteButton}
    >
      일기 쓰기
    </button>
  );
}

export default DiariesWriteButton;
