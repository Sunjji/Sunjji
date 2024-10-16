"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";

type DiaryEditPageProps = {
  params: {
    diaryId: string;
  };

  id: number;
  title: string;
  content: string;
  isPublic: boolean;
};

function DiaryEditPage(props: DiaryEditPageProps) {
  const [file, setFile] = useState<null | File>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();

  // diaries 정보 가져오기
  useEffect(() => {
    (async () => {
      const response = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(props.params.diaryId))
        .single();

      setTitle(response.data.title);
      setContent(response.data.content);
      setIsPublic(response.data.isPublic);
    })();
  }, []);

  // 공개/비공개 버튼
  const handleTogglePublic: ComponentProps<"input">["onChange"] = async (e) => {
    setIsPublic(e.target.checked);

    await supabase
      .from("diaries")
      .update({ isPublic: isPublic })
      .eq("id", Number(props.params.diaryId));
  };

  // form 제출 버튼
  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (file === null) {
      const updateResponse = await supabase
        .from("diaries")
        .update({
          title: title,
          content: content,
          isPublic: isPublic,
        })
        .eq("id", Number(props.params.diaryId));

      console.log(updateResponse);

      alert("수정이 완료되었습니다");
      router.push("/views/publicView");
    } else {
      const filename = nanoid();
      const extension = file!.name.split(".").slice(-1)[0];
      const path = `${filename}.${extension}`;

      const result = await supabase.storage
        .from("diaries")
        .upload(path, file!, { upsert: true });

      console.log(result);

      const updateResponse = await supabase
        .from("diaries")
        .update({
          imageUrl: result.data?.fullPath,
          title: title,
          content: content,
          isPublic: isPublic,
        })
        .eq("id", Number(props.params.diaryId));

      console.log(updateResponse);

      alert("수정이 완료되었습니다");
      router.push("/views/publicView");
    }
  };

  return (
    <form onSubmit={handleSubmitButton} className="flex flex-col gap-y-5">
      <label htmlFor="file">사진이나 동영상을 선택해주세요</label>
      <input
        id="file"
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <label htmlFor="title">일기 제목</label>
      <textarea
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border w-72 resize-none"
        rows={2}
      />

      <label htmlFor="content">일기 내용</label>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="border w-72 resize-none"
        rows={10}
      />

      <div className="flex gap-x-5">
        <label htmlFor="isPublic">공개</label>
        <input
          onChange={handleTogglePublic}
          id="isPublic"
          checked={isPublic}
          type="checkbox"
        />
      </div>

      <button className="border w-72 active:brightness-75">수정하기</button>
    </form>
  );
}

export default DiaryEditPage;
