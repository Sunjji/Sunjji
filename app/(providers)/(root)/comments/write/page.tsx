"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";

type Comments = {
  id: number;
  comment: string;
  like: boolean;
};

function WriteCommentsPage() {
  const [comments, setComments] = useState("");
  const [commentsData, setCommentsData] = useState<Comments[]>([]);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: commentsResponse, error: responseError } = await supabase
        .from("comments")
        .select("*");

      if (responseError) {
        return console.log("responseError", responseError);
      } else {
        // console.log("commentsResponse", commentsResponse);
        setCommentsData(commentsResponse);
      }
    })();
  }, []);

  const handleClickCommentButton = async () => {
    if (!comments) return alert("댓글을 적어주세요");

    const response = await supabase
      .from("comments")
      .insert([{ comment: comments }])
      .select();

    // 댓글 작성하면 바로 보이게 하기
    const { data: commentsResponse, error: responseError } = await supabase
      .from("comments")
      .select("*");

    if (responseError) {
      return console.log("responseError", responseError);
    } else {
      // console.log("commentsResponse", commentsResponse);
      setCommentsData(commentsResponse);
      setComments("");
    }
  };

  // 디자인은 임시로 했으니 알아서 바꿔줘
  return (
    <div className="flex flex-col items-center">
      <div className="h-96 border w-[368px]">
        <ul className="mt-2">
          {commentsData.map((comments) => (
            <li className="flex px-2" key={comments.id}>
              <p>{comments.comment}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center">
        <textarea
          className="resize-none w-80"
          rows={2}
          onChange={(e) => setComments(e.target.value)}
          value={comments}
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
