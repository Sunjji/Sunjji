"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";

type CommentsPageProps = {
  params: {
    diaryId: string;
  };

  id: string;
  content: string;
};

function CommentsPage(props: CommentsPageProps) {
  const [content, setComment] = useState("");
  const [commentsData, setCommentsData] = useState<CommentsPageProps[]>([]);

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

  return (
    <div className="flex flex-col w-[340px]">
      <h2 className="pb-2 font-semibold">이 일기의 댓글을 남겨주세요</h2>

      <div className="border h-[400px]">
        <ul className="mt-2">
          {commentsData.map((comment) => (
            <li className="flex px-2 py-1" key={comment.id}>
              <p className="flex-grow">{comment.content}</p>
              <p className="ml-2 text-xs text-gray-400"></p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center">
        <textarea
          className="border rounded-bl-lg p-2 flex-grow resize-none hover:border-gray-400"
          rows={2}
          onChange={(e) => setComment(e.target.value)}
          value={content}
        />
        <button
          className="border rounded-br-lg w-[65.6px] h-[65.6px] text-center hover:border-gray-400 active:brightness-50"
          onClick={handleClickCommentButton}
        >
          작성
        </button>
      </div>
    </div>
  );
}

export default CommentsPage;
