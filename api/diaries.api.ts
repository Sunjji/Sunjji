import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import dayjs from "dayjs";

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

async function getPopularDiaries() {
  const { data: diaries = [] } = await supabase
    .from("diaries")
    .select("*, likes(id), author:profiles(*), comments(id)")
    .limit(8);

  const diariesWithLikesCount = diaries?.map((diary) => ({
    ...diary,
    likesCount: diary.likes.length,
  }));

  diariesWithLikesCount?.sort(
    (diaryA, diaryB) => diaryB.likesCount - diaryA.likesCount
  );

  return diariesWithLikesCount;
}

async function getMyDiariesOnMonth(month: number) {
  const profile = useAuthStore.getState().profile;
  if (!profile) return;

  const startDateTimeOfCurrentMonth = dayjs()
    .month(month)
    .startOf("month")
    .toISOString();
  const endDateTimeOfCurrentMonth = dayjs()
    .month(month)
    .endOf("month")
    .toISOString();

  const { data: myDiaries = [] } = await supabase
    .from("diaries")
    .select("*, likes(id), author:profiles(*), comments(id)")
    .eq("authorId", profile.id)
    .gte("createdAt", startDateTimeOfCurrentMonth)
    .lte("createdAt", endDateTimeOfCurrentMonth);

  return myDiaries;
}

const diariesApi = {
  getPublicDiaries,
  getDiary,
  deleteDiary,
  getRecentDiaries,
  getDiaryDetail,
  getDiaries,
  getPopularDiaries,
  getMyDiariesOnMonth,
};

export default diariesApi;
