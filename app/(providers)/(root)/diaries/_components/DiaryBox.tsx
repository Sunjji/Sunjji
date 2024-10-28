/* eslint-disable @next/next/no-img-element */
import api from "@/api/api";
import dayjs from "dayjs";
import Link from "next/link";
import CommentButton from "./CommentButton";
import HeartButton from "./HeartButton";

interface DiaryBoxProps {
  diary: Exclude<
    Awaited<ReturnType<typeof api.diaries.getPublicDiaries>>,
    null
  >[number];
}

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryBox({ diary }: DiaryBoxProps) {
  return (
    <Link href={`/diaries/${diary.id}`}>
      <div className="relative group rounded-[8px] bg-whitePoint border hover:shadow-md transition border-BrownPoint/20">
        <div className="flex items-center px-3 py-2.5">
          <img
            src={diary.author!.imageUrl}
            className="rounded-full bg-white object-cover w-10 h-10"
            alt="프로필 이미지"
          />

          <div className="grow flex justify-between">
            <div className="text-sm font-semibold text-BrownPoint">
              {diary.author!.nickname}
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
  );
}

export default DiaryBox;
