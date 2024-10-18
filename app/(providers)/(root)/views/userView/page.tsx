import { supabase } from "@/supabase/client";
import DiariesWriteButton from "../publicView/_components/DiariesWriteButton";

async function UserViewPage() {
  const { data } = await supabase.auth.getUser();
  const authorId = data.user?.id;

  const response = await supabase
    .from("diaries")
    .select()
    .eq("authorId", authorId);

  const diaries = response.data;

  console.log(authorId);
  return (
    <>
      {/* 일기쓰기 버튼 */}
      <DiariesWriteButton />
      <div className="mx-[50px] mb-10 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {/* {diaries?.map((diary) => {})} */}
      </div>
    </>
  );
}
export default UserViewPage;
