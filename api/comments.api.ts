import { supabase } from "@/supabase/client";

async function getComments(diaryId: string) {
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, author:profiles (*)")
    .eq("diaryId", Number(diaryId))
    .order("createdAt", { ascending: false }); // 최신 댓글이 위로 올라오게 하기
  return { comments, error };
}

async function deleteComment(commentId: number) {
  const deleteComment = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  return deleteComment;
}

const commentsApi = {
  getComments,
  deleteComment,
};

export default commentsApi;
