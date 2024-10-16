"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type DiaryDetailPageProps = {
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

      const userResponse = await supabase.auth.getUser();
      const data = userResponse.data.user;
      const userId = data!.id;

      if (response.data.authorId === userId) return setIsUser(true);
    })();
  }, []);

  const handleClickDeleteButton = async () => {
    const deleteResponse = await supabase
      .from("diaries")
      .select("*")
      .eq("id", Number(props.params.diaryId))
      .single();

    const deleteData = await supabase
      .from("diaries")
      .delete()
      .eq("id", deleteResponse.data);
    console.log(deleteData);
  };

  return (
    <div>
      <p>
        {/* 임시로 사진 사이즈 조절함 */}
        사진:{" "}
        <img
          className="w-32"
          src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${data.imageUrl}`}
        />
      </p>
      <p>제목: {data.title}</p>
      <p>내용: {data.content}</p>
      <p>글쓴이: {data.authorId}</p>

      {/* 자기가 작성한 일기라면 편집, 삭제버튼 띄우고, 아니라면 null */}
      {isUser ? (
        <>
          <Link
            className="border w-72 inline-block text-center active:brightness-75"
            href={`/diaries/${data.id}/detail/edit`}
          >
            편집하기
          </Link>

          <button onClick={handleClickDeleteButton}>삭제하기</button>
        </>
      ) : null}
    </div>
  );
}

export default DiaryDetailPage;
