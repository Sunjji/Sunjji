"use client";

import { supabase } from "@/supabase/client";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(props.params.diaryId))
        .single();

      setTitle(response.data.title);
      setContent(response.data.content);
    })();
  }, []);

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    const updateResponse = await supabase
      .from("diaries")
      .update({ title: title, content: content })
      .eq("id", Number(props.params.diaryId));

    alert("수정이 완료되었습니다");
    router.push("/");
  };

  return (
    <form onSubmit={handleSubmitButton} className="flex flex-col gap-y-5">
      <textarea
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border w-72 resize-none"
        rows={2}
      />
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="border w-72 resize-none"
        rows={10}
      />

      <button className="border w-72 active:brightness-75">수정하기</button>
    </form>
  );
}

export default DiaryEditPage;
