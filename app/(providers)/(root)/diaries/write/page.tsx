"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";

type PropsType = {
  params: {
    diaryId: string;
  };

  id: number;
  authorId: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  isPublic: boolean;
};

function DiaryWritePage(props: PropsType) {
  const [file, setFile] = useState<null | File>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const router = useRouter();

  const handleChangeButton: ComponentProps<"input">["onChange"] = async (e) => {
    setIsPublic(e.target.checked);

    await supabase
      .from("diaries")
      .update({ isPublic: isPublic })
      .eq("id", props.params.diaryId);
  };

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    if (!file) return alert("사진을 선택해 주세요");
    if (!title) return alert("제목을 적어주세요");
    if (content === "") return alert("내용을 적어주세요");

    const filename = nanoid();
    const extension = file.name.split(".").slice(-1)[0];
    const path = `${filename}.${extension}`;

    const result = await supabase.storage
      .from("diaries")
      .upload(path, file, { upsert: true });

    const { data, error } = await supabase
      .from("diaries")
      .insert([{ title, content, isPublic, imageUrl: result.data?.fullPath }])
      .select();

    if (error) {
      console.error("Error", error);
    } else {
      console.log("data", data);

      alert("일기를 작성했습니다");
      router.push("./card");
    }
  };

  return (
    <form onSubmit={handleSubmitButton} className="flex flex-col gap-y-2">
      <label htmlFor="file">사진이나 동영상을 선택해주세요</label>
      <input
        id="file"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <label htmlFor="title">일기 제목</label>
      <textarea
        id="title"
        className="border w-72 resize-none"
        placeholder="일기 제목을 적어주세요"
        onChange={(e) => setTitle(e.target.value)}
        rows={2}
      />

      <label htmlFor="content">일기 내용</label>
      <textarea
        id="content"
        className="border w-72 h-44 resize-none"
        placeholder="일기 내용을 적어주세요"
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />

      <div className="flex gap-x-5">
        <label htmlFor="isPublic">공개</label>
        <input
          onChange={handleChangeButton}
          id="isPublic"
          checked={isPublic}
          type="checkbox"
        />
      </div>

      <button className="border w-72 active:brightness-75">작성하기</button>
    </form>
  );
}
export default DiaryWritePage;
