"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";

type Comments = {
  params: {
    diaryId: string;
  };

  id: number;
  content: string;
};

function WriteCommentsPage(props: Comments) {
  const [content, setComment] = useState("");
  const [commentsData, setCommentsData] = useState<Comments[]>([]);

  useEffect(() => {
    (async () => {
      // 댓글 정보 가져오기
      const { data: commentsResponse, error: commentsResponseError } =
        await supabase
          .from("comments")
          .select("*")
          .eq("diaryId", Number(props.params.diaryId));

      if (commentsResponseError) {
        return console.log("commentsResponseError", commentsResponseError);
      } else {
        // console.log("commentsResponse", commentsResponse);
        setCommentsData(commentsResponse);
      }
    })();
  }, []);

  const handleClickCommentButton = async () => {
    if (!content) return alert("댓글을 적어주세요");

    const response = await supabase
      .from("comments")
      .insert([{ content: content, diaryId: Number(props.params.diaryId) }])
      .eq("id", props.params.diaryId);
    // console.log(response);

    // 댓글 작성하면 바로 보이게 하기
    const { data: contentsResponse, error: contentsResponseError } =
      await supabase
        .from("comments")
        .select("*")
        .eq("diaryId", Number(props.params.diaryId));

    if (contentsResponseError) {
      return console.log("contentsResponseError", contentsResponseError);
    } else {
      // console.log("contentsResponse", contentsResponse);
      setCommentsData(contentsResponse);
      setComment(""); // textarea 빈칸으로 바꾸기
    }
  };

  // 디자인은 임시임
  return (
    <div className="flex flex-col items-center">
      <h2>이 일기의 댓글을 남겨주세요</h2>

      <div className="h-96 border w-[368px]">
        <ul className="mt-2">
          {commentsData.map((contents) => (
            <li className="flex px-2" key={contents.id}>
              <p>{contents.content}</p>
              <p className="ml-auto text-xs"></p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center">
        <textarea
          className="resize-none w-80"
          rows={2}
          onChange={(e) => setComment(e.target.value)}
          value={content}
        />
        <button
          className="border h-12 w-12 active:brightness-90"
          onClick={handleClickCommentButton}
        >
          작성
        </button>
      </div>
    </div>
  );
}

export default WriteCommentsPage;
