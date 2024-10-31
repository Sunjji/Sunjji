import { supabase } from "@/supabase/client";

async function getPublicDiaries() {
  const response = await supabase
    .from("diaries")
    .select("*, author:profiles (*), comments(id)")
    .eq("isPublic", true);
  const publicDiaries = response.data;

  return publicDiaries;
}

async function getDiary(diaryId: string) {
  const diary = await supabase
    .from("diaries")
    .select("*")
    .eq("id", Number(diaryId))
    .single();

  return diary;
}

async function deleteDiary(diaryId: string) {
  const deleteDiary = await supabase
    .from("diaries")
    .delete()
    .eq("id", Number(diaryId));

  return deleteDiary;
}

async function getRecentDiaries() {
  const { data } = await supabase
    .from("diaries")
    .select("*, author:profiles(*), comments(id)")
    .order("createdAt", { ascending: false })
    .limit(8);

  return data;
}

async function getDiaryDetail(diaryId: string) {
  const { data, error } = await supabase
    .from("diaries")
    .select("*, author:profiles(*), comments(id)")
    .eq("id", Number(diaryId))
    .single();

  return { data, error };
}

async function getDiaries() {
  const { data, error } = await supabase
    .from("diaries")
    .select("*, author:profiles(*)");

  return { data, error };
}

async function getDiaryWithLikes() {
  const { data } = await supabase
    .from("diaries")
    .select("*,likes:likes!diaryId(*), author:profiles(*)");

  return data!.map((diary) => ({
    ...diary,
    likesCount: diary.likes.length,
  }));
}

const diariesApi = {
  getPublicDiaries,
  getDiary,
  deleteDiary,
  getRecentDiaries,
  getDiaryDetail,
  getDiaries,
  getDiaryWithLikes,
};

export default diariesApi;
