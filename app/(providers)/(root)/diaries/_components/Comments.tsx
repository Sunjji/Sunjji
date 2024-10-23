"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";

type CustomComment = Tables<"comments"> & { profile: Tables<"profiles"> };

function Comments() {
  const params = useParams();
  const { diaryId } = params;
  const [newContent, setNewContent] = useState("");
  const [comments, setComments] = useState<CustomComment[]>([]);

  const currentUserId = useAuthStore((state) => state.currentUserId);

  useEffect(() => {
    (async () => {
      // 댓글 가져오기
      const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .eq("diaryId", Number(diaryId));

      if (!comments) return console.log("comments error");

      // 프로필 가져오기
      const { data: profiles } = await supabase.from("profiles").select("*");

      if (!profiles) return console.log("profiles error");

      // 댓글 단 유저의 프로필 정보 찾기
      const match = comments.map((comment) => {
        const profile = profiles.find(
          (profile) => comment.authorId === profile.id
        );

        return {
          ...comment,
          profile: profile,
        };
      });

      setComments(match);
    })();
  }, []);

  const handleClickCommentButton = async () => {
    if (!newContent) return alert("댓글을 적어주세요");

    await supabase
      .from("comments")
      .insert({ content: newContent, diaryId: Number(diaryId) });

    setNewContent(""); // textarea 빈칸으로 바꾸기

    refetchComments();
  };

  const refetchComments = async () => {
    // supabase에서 댓글 다시 가져와서
    const { data: comments } = await supabase
      .from("comments")
      .select("*")
      .eq("diaryId", Number(diaryId))
      .order("createdAt", { ascending: false });

    // setComments에 다시 넣기
    if (!comments) {
      return console.log("error");
    }
    // 프로필 가져오기
    const { data: profiles } = await supabase.from("profiles").select("*");

    if (!profiles) return console.log("profiles error");

    // 댓글 단 유저의 프로필 정보 찾기
    const match = comments.map((comment) => {
      const profile = profiles.find(
        (profile) => comment.authorId === profile.id
      );

      return {
        ...comment,
        profile: profile,
      };
    });
    setComments(match);
  };

  const handleClickDeleteButton = async (commentId: number) => {
    await supabase.from("comments").delete().eq("id", commentId);
    refetchComments();
  };

  return (
    <div className="flex flex-col w-[380px] bg-white rounded-lg shadow-xl">
      <div className="h-[550px] relative">
        <ul className="mt-2">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex items-center gap-x-4 px-2 py-1"
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={`${comment.profile?.imageUrl}`}
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

              <p>{comment.profile?.nickname}</p>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 absolute bottom-0 px-4 py-3 bg-white w-full z-5">
          <HeartButton diaryId={diaryId.toString()} />

          <CommentButton
            diaryId={diaryId.toString()}
            commentsCount={comments.length}
          />
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
