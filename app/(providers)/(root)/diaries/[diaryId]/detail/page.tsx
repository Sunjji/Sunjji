"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type DiaryDetailPageProps = {
  params: {
    diaryId: string;
  };

  id: number;
  authorId: number;
  title: string;
  content: string;
  imageUrl: string;
  createAt: string;
  isPublic: boolean;
};
const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public";

function DiaryDetailPage(props: DiaryDetailPageProps) {
  const [data, setData] = useState(props);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(props.params.diaryId))
        .single();

      setData(response.data);

      const user = await supabase
        .from("diaries")
        .select("*")
        .eq("authorId", response.data.authorId);

      console.log("userId", user.data![user.data!.length - 1].authorId);
      console.log(response.data.authorId);

      if (user === response.data.authorId) return setIsUser(true);
      console.log("isUser", isUser);
    })();
  }, []);

  return (
    <div>
      <p>
        {/* 임시로 사진 사이즈 조절함 */}
        사진: <img className="w-32" src={`${baseURL}/${data.imageUrl}`} />
      </p>
      <p>제목: {data.title}</p>
      <p>내용: {data.content}</p>
      <p>글쓴이: {data.authorId}</p>

      {isUser ? (
        <Link
          className="border w-72 inline-block text-center active:brightness-75"
          href={`/diaries/${data.id}/detail/edit`}
        >
          편집하기
        </Link>
      ) : null}
    </div>
  );
}

export default DiaryDetailPage;
