"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import IsPublicToggle from "../_components/IsPublicToggle";

function DiaryWritePage() {
  const [file, setFile] = useState<null | File>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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

    const filename = nanoid();
    const extension = file.name.split(".").slice(-1)[0];
    const path = `${filename}.${extension}`;

    const result = await supabase.storage
      .from("diaries")
      .upload(path, file, { upsert: true });
    console.log(result);

    const { error } = await supabase
      .from("diaries")
      .insert({ title, content, isPublic, imageUrl })
      .select();
    // title, content, isPublic, imageUrl: result.data?.fullPath
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

  return (
    <form
      onSubmit={handleSubmitButton}
      className="flex flex-col gap-y-2 p-5 w-[500px]"
    >
      <div className="flex gap-x-7">
        <img className={imageUrl !== "" ? "w-32" : ""} src={imageUrl} />

        <div className="flex flex-col gap-y-2 flex-grow">
          <label htmlFor="file">사진을 선택해주세요</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className=" px-1 py-2 border rounded-lg hover:border-gray-400"
          />
        </div>
      </div>

      <label htmlFor="title">일기 제목</label>
      <textarea
        id="title"
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        placeholder="일기 제목을 적어주세요"
        onChange={(e) => setTitle(e.target.value)}
        rows={2}
      />

      <label htmlFor="content">일기 내용</label>
      <textarea
        id="content"
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        placeholder="일기 내용을 적어주세요"
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />

      <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />

      <button
        type="submit"
        className="border rounded-lg text-center py-2 hover:border-gray-400 active:brightness-50"
      >
        작성하기
      </button>
    </form>
  );
}
export default DiaryWritePage;
