"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type DiariesType = {
  params: {
    diaryId: string;
  };

  id: number;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl: string;
  isPublic: boolean;
};
function DiariesCardPage() {
  const [diaries, setDiaries] = useState<DiariesType[]>([]);
  const [isUser, setIsUser] = useState(false);
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("diaries").select("*");
      if (error) {
        console.error("error", error);
      } else {
        setDiaries(data);
      }

      const dataUsersId = data?.map((user) => user.authorId);

      const userData = await supabase.auth.getUser();
      const userId = userData.data.user?.id;

      const getDiariesByUserId = await supabase
        .from("diaries")
        .select("*")
        .eq("authorId", userId);

      const a = dataUsersId?.map((authorId) =>
        authorId === userId ? getDiariesByUserId : "NO"
      );
      const b = a?.filter((c) => c !== "NO");
      console.log("a", a);
      console.log("b", b![1]);
      setIsUser(false);
    })();
  }, [isUser]);
  return (
    <div>
      <ul>
        {/* isPublic이 true일 때 출력 */}
        {diaries
          .filter((diary) => diary.isPublic)
          .map((diary) => (
            <li key={diary.id}>
              <Link
                className="flex gap-x-3"
                href={`/diaries/${diary.id}/detail`}
              >
                <p>{diary.id}</p>
                <h2>제목: {diary.title}</h2>
              </Link>
            </li>
          ))}
        {isUser ? (
          <>
            {diaries
              .filter((diary) => !diary.isPublic)
              .map((diary) => (
                <li className="text-red-500" key={diary.id}>
                  <Link
                    className="flex gap-x-3"
                    href={`/diaries/${diary.id}/detail`}
                  >
                    <p>{diary.id}</p>
                    <h2>제목: {diary.title}</h2>
                  </Link>
                </li>
              ))}
          </>
        ) : null}
      </ul>
    </div>
  );
}

export default DiariesCardPage;
