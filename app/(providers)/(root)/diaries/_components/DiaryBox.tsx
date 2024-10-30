/* eslint-disable @next/next/no-img-element */
import api from "@/api/api";
import dayjs from "dayjs";
import Link from "next/link";
import CommentButton from "./CommentButton";
import DiariesProflie from "./DiariesProflie";
import HeartButton from "./HeartButton";

// type Diary = Awaited<ReturnType<typeof api.diaries.getPublicDiaries>>

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
      <div className="relative group rounded-[8px] bg-whitePoint hover:border-BrownPoint transition">
        <div className="flex items-center py-2">
          <DiariesProflie />
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
        <div className=" flex gap-2 mt-1 z-0 relative">
          <HeartButton diaryId={diary.id} />
          <CommentButton commentsCount={diary.comments.length} />
        </div>
        <div className="grow flex justify-between">
          <div className="text-BrownPoint mt-[10px] mb-1 font-semibold">
            <p>{diary.title}</p>
          </div>
          <div className=" text-sm  text-BrownPoint font-bold pr-2">
            {dayjs(diary.createdAt).format("YYYY.MM.DD A hh:mm")}
          </div>
        </div>

        <div className="text-BrownPoint mb-1">
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
