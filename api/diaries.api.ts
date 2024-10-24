import { supabase } from "@/supabase/client";

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

const diariesApi = {
  getDiary,
  deleteDiary,
};

export default diariesApi;
