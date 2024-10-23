"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import IsPublicToggle from "../_components/IsPublicToggle";

function DiaryWritePage() {
  const [file, setFile] = useState<null | File>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState(""); // 테이블 수정되면 기능 구체화 할게요
  const [imageUrl, setImageUrl] = useState("");
  const [isClicked, setIsClicked] = useState([false, false, false]);
  const router = useRouter();

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!file) return alert("사진을 선택해 주세요");
    if (!title) return alert("제목을 적어주세요");
    if (!content) return alert("내용을 적어주세요");
    if (!memo) return alert("메모를 적어주세요");

    const filename = nanoid();
    const extension = file.name.split(".").slice(-1)[0];
    const path = `${filename}.${extension}`;

    const result = await supabase.storage
      .from("diaries")
      .upload(path, file, { upsert: true });
    console.log(result);

    const { error } = await supabase
      .from("diaries")
      .insert({ title, content, isPublic, imageUrl: result.data?.fullPath })
      .select();

    if (error) {
      console.error("Error", error);
    } else {
      if (isPublic) {
        alert("공개 일기를 작성했습니다");
        router.push("/diaries");
      } else {
        alert("비공개 일기를 작성했습니다");
        router.push("/diaries");
      }
    }
  };

  const handleClick = (index: number) => {
    const newClickedState = [false, false, false]; // 초기화
    newClickedState[index] = !isClicked[index]; // 클릭한 버튼만 반전
    setIsClicked(newClickedState);
  };

  // 날짜 가져오기
  const now = dayjs();
  const dayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const today = dayNames[now.day() + 1];

  return (
    <form
      onSubmit={handleSubmitButton}
      className="flex flex-col m-5 p-5 bg-[#FEFBF2] rounded-[8px]"
    >
      <div className="flex items-center gap-x-4 mb-4">
        <p className="text-[#A17762] text-2xl font-semibold">
          {now.date()} <span className="text-xl font-medium">{today}</span>
        </p>

        <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />
      </div>

      <div className="grid grid-cols-3 gap-x-3 p-5 bg-[#FFFEFA] rounded-[8px] w-full">
        <div className="col-span-3 flex items-center mb-4">
          <p className="text-[#A17762]">오늘 어떤 변화가 있었나요?</p>
          <button
            type="submit"
            className="text-[#A17762] border ml-auto py-2 rounded-[8px] w-[100px] h-[40px] font-semibold text-center"
          >
            저장하기
          </button>
        </div>

        <div className="col-span-1">
          <div className="flex gap-x-4 mb-4">
            {isPublic ? (
              <button
                onClick={() => handleClick(0)}
                type="button"
                className={`border px-3 py-2 rounded-[8px] ${
                  isClicked[0]
                    ? "bg-[#A17762] text-point"
                    : "text-[#A17762] bg-point"
                } transition`}
              >
                공개 일기
              </button>
            ) : null}
            <button
              onClick={() => handleClick(1)}
              type="button"
              className={`border px-3 py-2 rounded-[8px] ${
                isClicked[1]
                  ? "bg-[#A17762] text-point"
                  : "text-[#A17762] bg-point"
              } transition`}
            >
              사고 뭉치
            </button>
            <button
              onClick={() => handleClick(2)}
              type="button"
              className={`border px-3 py-2 rounded-[8px] ${
                isClicked[2]
                  ? "bg-[#A17762] text-point"
                  : "text-[#A17762] bg-point"
              } transition`}
            >
              저장 일기
            </button>
          </div>
          <div className="flex flex-col gap-y-4">
            <textarea
              className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
              placeholder="제목"
              onChange={(e) => setTitle(e.target.value)}
              rows={1}
            />

            {/* 한 줄 메모가 뭔지 몰라서 기능 없음 */}
            <textarea
              className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
              placeholder="한 줄 메모"
              onChange={(e) => setMemo(e.target.value)}
              rows={14}
            />
          </div>
        </div>

        <textarea
          className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
          placeholder="오늘의 일기"
          onChange={(e) => setContent(e.target.value)}
          rows={16}
        />

        <div className="flex flex-col">
          <img
            className={imageUrl !== "" ? "w-full rounded-[8px]" : ""}
            src={imageUrl}
          />

          <div className="flex flex-col gap-y-2 ">
            <label htmlFor="file">
              <input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              <span className="block mt-4 px-1 py-2 border rounded-[8px] text-[#A17762] text-center text-sm">
                사진 첨부하기
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
export default DiaryWritePage;
