/* eslint-disable @next/next/no-img-element */
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import Link from "next/link";
import CommentButton from "./_components/CommentButton";
import DiariesWriteButton from "./_components/DiariesWriteButton";
import HeartButton from "./_components/HeartButton";

export const revalidate = 0;

async function PublicPage() {
  const { data: diaries } = await supabase
    .from("diaries")
    .select("*, author:profiles (*), comments(id)");

  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

  return (
    <Page>
      {/* 일기쓰기 버튼 */}
      <div className="absolute top-10 right-[58px]">
        <DiariesWriteButton />
      </div>
      {/* 클릭하면 일기 상세페이지로 들어감 */}
      <div className="bg-whitePoint px-6 rounded-2xl">
        <h2 className="mt-7 text-3xl font-bold text-BrownPoint text-opacity-50 pb-[30px]">
          공개 일기들을 읽을 수 있어요!
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-20 gap-y-10">
          {diaries?.map((diary) => {
            return diary.isPublic ? (
              <Link key={diary.id} href={`/diaries/${diary.id}`}>
                <div className="relative group rounded-[8px] bg-whitePoint border-2 border-transparent">
                  {/* 바깥쪽 테두리 쉐도우 */}
                  <div className="absolute inset-0 rounded-[8px] group-hover:shadow-[0_0_20px_rgba(161,119,98,0.5)] transition duration-300"></div>
                  {/* 프로필+닉네임+날짜 */}

                  <div className="flex items-center">
                    <img
                      src={diary.author.imageUrl}
                      className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
                      alt="프로필 이미지"
                    />
                    <div className="grow flex justify-between">
                      <div className="text-sm font-semibold text-BrownPoint">
                        {diary.author.nickname}
                      </div>
                      <div className="text-sm  text-BrownPoint pr-2">
                        {dayjs(diary.createdAt).format("YYYY년 MM월 DD일")}
                      </div>
                    </div>
                  </div>
                  {/* 이미지를 비율에 맞춰서 표시 */}
                  <div className="aspect-w-4 aspect-h-3 w-full">
                    <img
                      className="object-cover w-full h-full"
                      src={`${baseURL}/${diary.imageUrl}`}
                      alt="일기 사진"
                    />
                  </div>
                  {/* 좋아요 댓글 버튼 */}
                  <div className="ml-5 flex gap-2 mt-1 z-0 relative">
                    <HeartButton diaryId={diary.id} />
                    <CommentButton commentsCount={diary.comments.length} />
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
      </div>
    </Page>
  );
}

export default PublicPage;
