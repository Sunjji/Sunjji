/* eslint-disable @next/next/no-img-element */
import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import Link from "next/link";
import CommentButton from "./_components/CommentButton";
import DiariesWriteButton from "./_components/DiariesWriteButton";
import HeartButton from "./_components/HeartButton";

export const revalidate = 0;
async function PublicPage() {
  const response = await supabase.from("diaries").select();
  const diaries = response.data;

  const response2 = await supabase.from("profiles").select();
  const profiles = response2.data;

  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

  return (
    <>
      {/* 일기쓰기 버튼 */}
      <DiariesWriteButton />
      {/* 클릭하면 일기 상세페이지로 들어감 */}
      <div className="mx-[50px] mb-10 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
        {diaries?.map((diary) => {
          return diary.isPublic ? (
            <Link key={diary.id} href={`/diaries/${diary.id}`}>
              <div className="relative group mt-[30px] rounded-[8px] bg-point border-2 border-transparent">
                {/* 바깥쪽 테두리 쉐도우 */}
                <div className="absolute inset-0 rounded-[8px] group-hover:shadow-[0_0_20px_rgba(161,119,98,0.5)] transition duration-300"></div>
                {/* 프로필+닉네임+날짜 */}
                {profiles?.map((profile) => {
                  if (diary.authorId === profile.id) {
                    return (
                      <ul key={profile.id} className="flex items-center">
                        <li>
                          <img
                            src={profile.imageUrl}
                            className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
                            alt="프로필 이미지"
                          />
                        </li>
                        <div className="grow flex justify-between">
                          <li className="text-sm font-semibold text-BrownPoint">
                            {profile.nickname}
                          </li>
                          <li className="text-sm  text-BrownPoint pr-2">
                            {dayjs(diary.createdAt).format("YYYY년 MM월 DD일")}
                          </li>
                        </div>
                      </ul>
                    );
                  }
                })}

                {/* 이미지를 비율에 맞춰서 표시 */}
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    className="object-cover w-full h-full"
                    src={`${baseURL}/${diary.imageUrl}`}
                    alt="일기 사진"
                  />
                </div>

                {/* 좋아요 댓글 버튼 */}
                <div className="ml-5 flex gap-2 mt-1">
                  <HeartButton />
                  <CommentButton />
                </div>
                <div className="text-center text-BrownPoint mt-[10px] font-semibold">
                  <p>{diary.title}</p>
                </div>
                <div className="text-center text-BrownPoint mt-[10px] mb-2">
                  {/* 18글자까지만 보여주고, 글자가 길면 "..." 표시 */}
                  <p>
                    {diary.content.length > 18
                      ? diary.content.slice(0, 18) + "..."
                      : diary.content}
                  </p>
                </div>
              </div>
            </Link>
          ) : null;
        })}
      </div>
    </>
  );
}

export default PublicPage;
