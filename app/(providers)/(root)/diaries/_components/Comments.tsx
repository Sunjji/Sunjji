/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useParams } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";
import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";

type CustomComment = Tables<"comments"> & { author: Tables<"profiles">[] }; // author가 배열인 경우

function Comments() {
  const params = useParams();
  const { diaryId } = params;
  const [newContent, setNewContent] = useState("");
  const [comments, setComments] = useState<CustomComment[]>([]);
  const currentUserId = useAuthStore((state) => state.currentUserId);

  useEffect(() => {
    (async () => {
      // 댓글 가져오기
      const { comments, error } = await api.comments.getComments(
        diaryId.toString()
      );

      if (error) return console.log("comments error", error);

      console.log("comments", comments);
      setComments(comments || []);
    })();
  }, []);

  const handleSubmitComment: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!newContent)
      return toast("💛 댓글을 작성하여 주세요", getToastOptions("warning"));

    await supabase
      .from("comments")
      .insert({ content: newContent, diaryId: Number(diaryId) });

    setNewContent(""); // textarea 빈칸으로 바꾸기

    refetchComments();
  };

  const refetchComments = async () => {
    // supabase에서 댓글 다시 가져오기
    const { comments, error } = await api.comments.getComments(
      diaryId.toString()
    );

    if (error) {
      return console.log("comments error", error);
    }
    console.log("comments", comments);
    setComments(comments || []);
  };

  const handleClickDeleteButton = async (commentId: number) => {
    await api.comments.deleteComment(commentId);
    refetchComments();
  };

  return (
    <div className="flex flex-col bg-white rounded-lg">
      <div className="h-[550px] relative">
        <ul className="mt-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex items-center gap-x-4 px-2 py-1"
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={`${comment.author?.imageUrl}`}
                alt="프로필 이미지"
              />

              <p
                onClick={() => handleClickDeleteButton(comment.id)}
                // 미완성
                className={`flex-grow cursor-pointer ${
                  comment.authorId === currentUserId
                    ? "hover:line-through hover:text-red-600"
                    : null
                }
                `}
              >
                {comment.content}
              </p>

              <p>{comment.author?.nickname}</p>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 absolute bottom-0 px-4 py-3 bg-white w-full z-5">
          <HeartButton diaryId={+diaryId} />

          <CommentButton commentsCount={comments.length} />
        </div>
      </div>
      <form
        className="flex items-center z-10 border-t border-BrownPoint/20"
        onClick={handleSubmitComment}
      >
        <input
          type="text"
          className="rounded-bl-lg p-4 flex-grow text-BrownPoint placeholder-BrownPoint text-2xl h-[65.6px] placeholder-opacity-75 focus:outline-none focus:ring-0"
          onChange={(e) => setNewContent(e.target.value)}
          value={newContent}
          placeholder="댓글 남기기..."
        />
        <button
          className="rounded-br-lg w-[65.6px] h-[65.6px] text-center hover:underline active:brightness-50 bg-white text-2xl text-BrownPoint focus:outline-none"
          type="submit"
        >
          게시
        </button>
      </form>
    </div>
  );
}

export default Comments;
