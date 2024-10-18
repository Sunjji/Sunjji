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
      className="mt-[30px] ml-[50px] py-2 rounded-[8px] w-[100px] h-[40px] font-semibold text-BrownPoint bg-point text-center transition duration-300 hover:bg-BrownPoint hover:text-white"
      onClick={handleClickDiariesWriteButton}
    >
      일기쓰기
    </button>
  );
}

export default DiariesWriteButton;
