"use client";

import { supabase } from "@/supabase/client";
import { DiaryInfo } from "@/types/type";
import { useAuthStore } from "@/zustand/auth.store";
import React, { useEffect, useState } from "react";
import HeartButton from "../../diaries/_components/HeartButton";
import CommentButton from "../../diaries/_components/CommentButton";
import { useModalStore } from "@/zustand/modal.store";
import LogInModal from "@/components/LoginModal";
import dayjs from "dayjs";

function AuthCheck() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [diaryInfo, setDiaryInfo] = useState<DiaryInfo[]>([]);
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    const diaryDataLoad = async () => {
      const { data, error } = await supabase
        .from("diaries")
        .select("*, author:profiles(id, imageUrl, nickname)");

      console.log(data);

      if (error) {
        console.log("Error fetching diaries:", error);
      } else {
        setDiaryInfo(data || []);
      }
    };

    diaryDataLoad();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="flex flex-wrap justify-between h-[66vh] w-[68%] gap-5">
          <div className="rounded-2xl bg-whitePoint p-5 w-[47%] h-full">
            이달의 인기 일기
          </div>
          <div className="w-[47%] h-full flex flex-col gap-7">
            <div className="rounded-2xl bg-whitePoint p-5 h-72">
              OO과(와) 함께 한지
            </div>
            <div className="rounded-2xl bg-whitePoint p-5 h-72">OO의 생일</div>
            <div className="rounded-2xl bg-whitePoint p-5 h-full">
              나의 반려동물
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-between h-[66vh] w-[68%] gap-5">
          <div className="rounded-2xl bg-whitePoint p-5 w-[47%] h-full">
            이달의 인기 일기
          </div>
          <div className="rounded-2xl bg-whitePoint p-5 w-[47%] h-full overflow-y-auto max-h-[66vh]">
            <h2>현재 뜨고 있는 최신 일기</h2>
            {diaryInfo
              .slice(0, 4)
              .sort((a, b) =>
                dayjs(b.createdAt).isAfter(dayjs(a.createdAt)) ? 1 : 1
              )
              .map((diary) => {
                return (
                  <div key={diary.id} onClick={() => openModal(<LogInModal />)}>
                    <div className="relative group rounded-[8px] bg-whitePoint border-2 border-transparent">
                      <div className="absolute inset-0 rounded-[8px] group-hover:shadow-[0_0_20px_rgba(161,119,98,0.5)] transition duration-300"></div>
                      <div className="flex items-center">
                        <img
                          src={`${diary.author.imageUrl}`}
                          className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
                          alt="프로필 이미지"
                        />
                        <div className="grow flex justify-between">
                          <div className="text-sm font-semibold text-BrownPoint">
                            {diary.author.nickname}
                          </div>
                        </div>
                      </div>
                      <div className="aspect-w-4 aspect-h-3 w-full">
                        <img
                          className="object-cover w-full h-full"
                          src={`${baseURL}/${diary.imageUrl}`}
                          alt="일기 사진"
                        />
                      </div>
                      <div className="ml-5 flex gap-2 mt-1 z-0 relative">
                        <HeartButton />
                        <CommentButton />
                      </div>
                      <div className="text-center text-BrownPoint mt-[10px] font-semibold">
                        <p>{diary.title}</p>
                      </div>
                      <div className="text-center text-BrownPoint mt-[10px] mb-2">
                        <p>
                          {diary.content.length > 18
                            ? diary.content.slice(0, 18) + "..."
                            : diary.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default AuthCheck;
