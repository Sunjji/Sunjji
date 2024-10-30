/* eslint-disable @next/next/no-img-element */
import { useModalStore } from "@/zustand/modal.store";
import dayjs from "dayjs";
import CommentButton from "../../diaries/_components/CommentButton";
import HeartButton from "../../diaries/_components/HeartButton";
import LogInModal from "@/components/LoginModal";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";

function RecentDiary() {
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";
  const openModal = useModalStore((state) => state.openModal);

  const { data } = useQuery({
    queryKey: ["diaries"],
    queryFn: () => api.diaries.getDiaryUserProfile(),
  });

  const diaries = data || [];

  return (
    <>
      {diaries!
        .slice(0, 4)
        .sort((a, b) =>
          dayjs(b.createdAt).isAfter(dayjs(a.createdAt)) ? 1 : -1
        )
        .map((diary) => {
          return (
            <div key={diary.id} onClick={() => openModal(<LogInModal />)}>
              <div className="relative group rounded-[8px] bg-whitePoint border-2 border-transparent">
                <div className="absolute inset-0 rounded-[8px] group-hover:shadow-[0_0_20px_rgba(161,119,98,0.5)] transition duration-300"></div>
                <div className="flex items-center">
                  <img
                    src={`${diary.author!.imageUrl}`}
                    className="m-2 inline-block rounded-full bg-white object-cover w-[40px] h-[40px]"
                    alt="프로필 이미지"
                  />
                  <div className="grow flex justify-between">
                    <div className="text-sm font-semibold text-BrownPoint">
                      {diary.author!.nickname}
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
                  <HeartButton diaryId={diary.id} />
                  <CommentButton commentsCount={diary.comments.length} />
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
    </>
  );
}

export default RecentDiary;
