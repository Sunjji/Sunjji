"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";

type DiariesType = {
  id: number;
  title: string;
  content: string;
};

function DiaryWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [diaries, setDiaries] = useState<DiariesType[]>([]);

  const router = useRouter();

  const handleChangeButton: ComponentProps<"input">["onChange"] = (e) => {
    setIsPublic(e.target.checked);
    console.log(isPublic);
  };

  useEffect(() => {
    const loadDiary = async () => {
      const { data, error } = await supabase.from("diaries").select("*");
      if (error) {
        console.error("error", error);
      } else {
        setDiaries(data);
        console.log(data);
      }
    };

    loadDiary();
  }, []);

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (title === "") return alert("제목을 적어주세요");
    if (content === "") return alert("내용을 적어주세요");

    const { data, error } = await supabase
      .from("diaries")
      .insert([{ title, content, isPublic }])
      .select();

    if (error) {
      console.error("Error", error);
    } else {
      console.log("data", data);

      alert("일기를 작성했습니다");
      router.push("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitButton} className="flex flex-col gap-y-2">
        <label htmlFor="file">사진이나 동영상을 선택해주세요</label>
        <input id="file" type="file" />

        <label htmlFor="title">일기 제목</label>
        <textarea
          id="title"
          className="border w-72 resize-none"
          placeholder="일기 제목을 적어주세요"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">일기 내용</label>
        <textarea
          id="content"
          className="border w-72 h-44 resize-none"
          placeholder="일기 내용을 적어주세요"
          onChange={(e) => setContent(e.target.value)}
        />

        {/* true: 공개, false: 비공개 */}
        <div className="flex gap-x-5">
          <label htmlFor="isPublic">비공개</label>
          <input
            onChange={handleChangeButton}
            id="isPublic"
            checked={isPublic}
            type="checkbox"
          />
        </div>

        <button className="border w-72 active:brightness-75">작성하기</button>
      </form>

      {/* 홈페이지 어디에 적어야 할지 몰라서 임시로 적음 */}
      <div>
        <ul>
          {diaries.map((diary: DiariesType) => (
            <li key={diary.id}>
              <Link className="flex gap-x-3" href={`/diaries/${diary.id}/edit`}>
                <p>{diary.id}</p>
                <h2>제목: {diary.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default DiaryWritePage;
