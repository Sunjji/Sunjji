"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import IsPublicToggle from "../../_components/IsPublicToggle";

type DiaryEditPageProps = {
  params: {
    diaryId: string;
  };

  id: string;
  title: string;
  content: string;
  isPublic: boolean;
};

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryEditPage(props: DiaryEditPageProps) {
  const [file, setFile] = useState<null | File>(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      setImageUrl(baseURL + response.data.imageUrl);
    })();
  }, []);

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

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

      alert("수정이 완료되었습니다");
      router.push("/diaries");
    } else {
      const filename = nanoid();
      const extension = file!.name.split(".").slice(-1)[0];
      const path = `${filename}.${extension}`;

      const result = await supabase.storage
        .from("diaries")
        .upload(path, file!, { upsert: true });

      const updateResponse = await supabase
        .from("diaries")
        .update({
          imageUrl: result.data?.fullPath,
          title: title,
          content: content,
          isPublic: isPublic,
        })
        .eq("id", Number(props.params.diaryId));

      alert("수정이 완료되었습니다");
      router.push("/diaries");
    }
  };

  return (
    <form
      onSubmit={handleSubmitButton}
      className="flex flex-col gap-y-5 p-5 w-[500px]"
    >
      <div className="flex gap-x-7">
        <img className="w-32" src={imageUrl} />

        <div className="flex flex-col gap-y-2 flex-grow">
          <label htmlFor="file">사진을 선택해주세요</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="px-1 py-2 border rounded-lg hover:border-gray-400"
          />
        </div>
      </div>

      <label htmlFor="title">일기 제목</label>
      <textarea
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        rows={2}
      />

      <label htmlFor="content">일기 내용</label>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        rows={10}
      />

      <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />

      <button
        type="submit"
        className="border rounded-lg text-center py-2 hover:border-gray-400 active:brightness-50"
      >
        수정하기
      </button>
    </form>
  );
}

export default DiaryEditPage;
