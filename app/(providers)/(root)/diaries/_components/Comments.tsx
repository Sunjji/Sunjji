"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Comments() {
  const params = useParams();
  const [newContent, setNewContent] = useState("");
  const [content, setContent] = useState<Tables<"comments">[]>([]);
  const { diaryId } = params;

  useEffect(() => {
    (async () => {
      // 댓글 정보 가져오기
      const { data: response, error } = await supabase
        .from("comments")
        .select("*")
        .eq("diaryId", Number(diaryId));

      if (error) {
        return console.log("error", error);
      } else {
        setContent(response);
      }
    })();
  }, []);

  const handleClickCommentButton = async () => {
    if (!newContent) return alert("댓글을 적어주세요");

    await supabase
      .from("comments")
      .insert({ content: newContent, diaryId: Number(diaryId) });

    // 댓글 작성하면 바로 보이게 하기
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("diaryId", Number(diaryId));

    if (error) {
      return console.log("error", error);
    } else {
      setContent(comments);
      setNewContent(""); // textarea 빈칸으로 바꾸기
    }
  };

  return (
    <div className="flex flex-col w-[340px]">
      <h2 className="pb-2 font-semibold">이 일기의 댓글을 남겨주세요</h2>

      <div className="border h-[400px]">
        <ul className="mt-2">
          {content.map((comment) => (
            <li className="flex px-2 py-1" key={comment.id}>
              <p className="flex-grow">{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center">
        <textarea
          className="border rounded-bl-lg p-2 flex-grow resize-none hover:border-gray-400"
          rows={2}
          onChange={(e) => setNewContent(e.target.value)}
          value={newContent}
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

export default Comments;
