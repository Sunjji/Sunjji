/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";
import Comments from "../_components/Comments";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

type CustomDiary = Tables<"diaries"> & { author: Tables<"profiles"> | null };

function DiaryDetailPage() {
  const params = useParams();
  const { diaryId } = params;
  const [diary, setDiary] = useState<CustomDiary>();

  const currentUserId = useAuthStore((state) => state.currentUserId);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: diaries, error } = await api.diaries.getDiaryDetail(
        diaryId.toString()
      );
      console.log("diaries", diaries, error);

      if (!diaries) {
        return console.log("diaries error");
      } else {
        setDiary(diaries || []);
      }
    })();
  }, []);

  const handleClickDeleteButton = async () => {
    await api.diaries.getDiary(diaryId.toString());

    const deleteDiary = await api.diaries.deleteDiary(diaryId.toString());

    if (!deleteDiary) {
      console.log("error");
    } else {
      toast("💚 일기가 삭제되었습니다", getToastOptions("success"));
      router.push("/diaries");
    }
  };

  if (!diary) {
    return <p className="p-5">로딩 중...</p>;
  }

  return (
    <Page title={dayjs(diary.createdAt).format("DD dddd")}>
      <div className="grid grid-cols-3 bg-whitePoint p-6 text-[#A17762] gap-x-8">
        {/* 1/3 */}
        <div className="col-span-1 gap-4">
          <h1 className="text-2xl mb-3">{diary.title}</h1>

          <div className="flex flex-col gap-y-3">
            {/* 일기 사진 */}
            <div className="aspect-w-4 aspect-h-3 border border-BrownPoint/20 rounded-md">
              <img
                className="object-cover rounded-lg"
                src={`${baseURL}${diary.imageUrl}`}
              />
            </div>

            {/* 일기 작성 시간 */}
            <p className="text-xl">
              {dayjs(diary.createdAt).format("YYYY.MM.DD A hh:mm")}
            </p>

            {/* 일기 내용 */}
            <p className="text-lg">{diary.content}</p>

            {/* 자기 일기라면 편집, 삭제 버튼 띄우기 */}
            {diary.authorId === currentUserId ? (
              <div className="mt-5 flex flex-col lg:flex-row gap-2">
                <button
                  className="border rounded-lg w-[212px] text-center py-2 hover:border-gray-400 active:brightness-50"
                  onClick={handleClickDeleteButton}
                >
                  삭제하기
                </button>

                <Link
                  className="border rounded-lg w-[212px] text-center py-2 hover:brightness-90 active:brightness-50"
                  href={`/diaries/${diary.id}/edit`}
                >
                  편집하기
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {/* 2/3, 펫 미완성*/}
        <div className="col-span-1">
          <div key={diary.author?.id} className="flex gap-x-4">
            <img
              className="rounded-full w-14 h-14 object-cover border border-BrownPoint/20"
              src={`${diary.author?.imageUrl}`}
              alt="프로필이미지"
            />
            <div className="flex">
              <div
                className="grid grid-cols-3 gap-x-4 items-center text-sm"
                key={diary.author?.id}
              >
                <p className="col-span-1 text-xl font-semibold ">
                  {diary.author?.nickname}
                </p>
                <p className="col-span-2">
                  {diary.author?.firstPetId} · {diary.author?.firstPetId}
                </p>
                <p className="col-span-3">
                  {diary.author?.firstPetId}kg / {diary.author?.firstPetId}세
                </p>
              </div>
            </div>
          </div>

          {/* 메모 */}
          <p className="text-2xl ml-2 mt-8">
            메모: <br />
            {diary.comment}
          </p>
        </div>

        {/* 3/3 */}
        <div className="col-span-1 border border-BrownPoint/20 rounded-md">
          <Comments />
        </div>
      </div>
    </Page>
  );
}

export default DiaryDetailPage;
