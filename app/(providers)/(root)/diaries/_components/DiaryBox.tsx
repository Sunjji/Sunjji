/* eslint-disable @next/next/no-img-element */
import api from "@/api/api";
import { IMAGE_BASE_URL } from "@/constants/constants";
import dayjs from "dayjs";
import Link from "next/link";
import CommentButton from "./CommentButton";
import DiariesProfile from "./DiariesProfile";
import HeartButton from "./HeartButton";

interface DiaryBoxProps {
  diary: Exclude<
    Awaited<ReturnType<typeof api.diaries.getPublicDiaries>>,
    null
  >[number];
}

function DiaryBox({ diary }: DiaryBoxProps) {
  return (
    <Link className="text-BrownPoint" href={`/diaries/${diary.id}`}>
      <div className="relative group rounded-[8px] bg-whitePoint hover:border-BrownPoint transition border pb-4">
        <div className="flex items-center py-2">
          <DiariesProfile diary={diary} />
        </div>
        {/* 이미지를 비율에 맞춰서 표시 */}
        <div className="aspect-w-4 aspect-h-3 w-full">
          <img
            className="object-cover w-full h-full"
            src={`${IMAGE_BASE_URL}/${diary.imageUrl}`}
            alt="일기 사진"
          />
        </div>
        {/* 좋아요 댓글 버튼 */}
        <div className=" flex gap-2 pt-3 z-0 relative px-4">
          <HeartButton diaryId={diary.id} />
          <CommentButton commentsCount={diary.comments.length} />
        </div>

        <div className="grow flex justify-between items-center px-4">
          <div className="mt-[10px] mb-1 font-semibold">
            <p>{diary.title}</p>
          </div>
          <div className=" text-sm font-bold pr-2">
            {dayjs(diary.createdAt).format("YYYY.MM.DD A hh:mm")}
          </div>
        </div>

        <div className="mt-2 px-4">
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
