"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";

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
  }, [content]);

  const handleClickCommentButton = async () => {
    if (!newContent) return alert("댓글을 적어주세요");

    await supabase
      .from("comments")
      .insert({ content: newContent, diaryId: Number(diaryId) });

    setNewContent(""); // textarea 빈칸으로 바꾸기
    // }
  };

  const handleClickDeleteButton = async (commentId: number) => {
    const deleteComments = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    console.log(deleteComments);
  };

  return (
    <div className="flex flex-col w-[380px] bg-white rounded-lg shadow-xl">
      <div className="h-[550px] relative">
        <ul className="mt-2">
          {content.map((comment) => (
            <li className="flex px-2 py-1" key={comment.id}>
              <p
                onClick={() => handleClickDeleteButton(comment.id)}
                // 미완성
                className="flex-grow cursor-pointer hover:line-through"
              >
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 absolute bottom-0 px-4 py-3 bg-white w-full z-5">
          <HeartButton diaryId={diaryId.toString()} />
          <CommentButton diaryId={diaryId.toString()} />
        </div>
      </div>
      <div className="flex items-center z-10 shadow-[0_-4px_6px_rgba(0,0,0,0.05)]">
        <textarea
          className="rounded-bl-lg p-4 flex-grow resize-none text-BrownPoint placeholder-BrownPoint text-2xl h-[65.6px] placeholder-opacity-75 focus:outline-none focus:ring-0"
          rows={2}
          onChange={(e) => setNewContent(e.target.value)}
          value={newContent}
          placeholder="댓글 남기기..."
        />
        <button
          className="rounded-br-lg w-[65.6px] h-[65.6px] text-center hover:underline active:brightness-50 bg-white text-2xl text-BrownPoint focus:outline-none"
          onClick={handleClickCommentButton}
        >
          게시
        </button>
      </div>
    </div>
  );
}

export default Comments;
