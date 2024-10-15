import { supabase } from "@/supabase/client";
import Link from "next/link";

async function PublicPage() {
  const response = await supabase.from("diaries").select();
  const diaries = response.data;
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public";

  return (
    <>
      {/* 일기미리보기 */}
      <div className="mt-[30px] ml-[50px] rounded-[8px] w-[200px] h-[50px] font-semibold text-BrownPoint bg-point text-center">
        <Link href={"/diaries/write"}>일기쓰기</Link>
      </div>
      <div className="grid grid-cols-4">
        {diaries?.map((diary) => {
          return (
            <div className=" mt-[30px] ml-[50px] rounded-[8px] w-[300px] h-[360px] bg-point">
              <div className="flex items-center">
                <div className="m-2 inline-block rounded-full bg-white w-[40px] h-[40px]"></div>
                <span className="inline-block text-sm font-semibold text-BrownPoint">
                  jjugguming
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img
                  className="w-[300px] h-[200px] object-cover"
                  src={`${baseURL}/${diary.imageUrl}`}
                />
              </div>
              <div className="ml-5 flex gap-2">
                <div className="w-[30px] h-[30px] bg-BrownPoint">좋</div>
                <p>123</p>
                <div className="w-[30px] h-[30px] bg-BrownPoint">댓</div>
                <p>12</p>
              </div>
              <div className="text-center text-BrownPoint">
                <p>{diary.title}.</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PublicPage;
